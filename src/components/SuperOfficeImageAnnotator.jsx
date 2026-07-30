import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Konva from "konva";
import {
    Arrow as KonvaArrow,
    Circle,
    Group,
    Image as KonvaImage,
    Label,
    Layer,
    Rect,
    Stage,
    Tag,
    Text,
    Transformer
} from "react-konva";
import {
    ArrowUpRight,
    ClipboardCopy,
    Crop,
    Download,
    Maximize2,
    MessageSquareText,
    RotateCcw,
    Square,
    Trash2,
    X
} from "lucide-react";
import {
    DEFAULT_ANNOTATION_EXPORT_MAX_WIDTH,
    getContainedImageRect,
    getLimitedExportSize,
    imagePointToStagePoint,
    normalizeRectFromPoints,
    stagePointToImagePoint
} from "../utils/imageAnnotation.js";

const TOOL_OPTIONS = [
    { id: "arrow", title: "Flèche", icon: ArrowUpRight },
    { id: "rect", title: "Rectangle", icon: Square },
    { id: "text", title: "Bulle texte", icon: MessageSquareText },
    { id: "crop", title: "Crop / zoom", icon: Crop }
];

const COLOR_OPTIONS = ["#ef4444", "#f59e0b", "#22c55e", "#06b6d4", "#3b82f6", "#a855f7"];
const MIN_DRAW_DISTANCE = 8;
const MIN_CROP_SIZE = 36;
const DEFAULT_STROKE_WIDTH = 4;
const MIN_STROKE_WIDTH = 1;
const MAX_STROKE_WIDTH = 14;
const ARROW_CURVE_SEGMENTS = 28;
const ARROW_HANDLE_RADIUS = 5;

function colorWithAlpha(hexColor, alpha = 0.22) {
    const raw = String(hexColor || "").replace("#", "");
    if (!/^[0-9a-f]{6}$/i.test(raw)) return `rgba(239,68,68,${alpha})`;
    const value = Number.parseInt(raw, 16);
    const red = (value >> 16) & 255;
    const green = (value >> 8) & 255;
    const blue = value & 255;
    return `rgba(${red},${green},${blue},${alpha})`;
}

function makeAnnotationId() {
    return globalThis.crypto?.randomUUID?.() || `annotation-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function isRemoteHttpUrl(url = "") {
    return /^https?:\/\//i.test(String(url));
}

function isCanvasSafeInlineUrl(url = "") {
    return /^(data:|blob:)/i.test(String(url));
}

function loadImageElement(src) {
    return new Promise((resolve, reject) => {
        const image = new window.Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("Impossible de charger cette image."));
        image.src = src;
    });
}

async function loadAnnotatableImageSource(src) {
    const source = String(src || "").trim();
    if (!source) throw new Error("Image manquante.");

    if (isCanvasSafeInlineUrl(source)) {
        const image = await loadImageElement(source);
        return { image, objectUrl: "", canExport: true, exportBlockedReason: "" };
    }

    if (isRemoteHttpUrl(source)) {
        try {
            const response = await fetch(source, { mode: "cors", credentials: "omit" });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            const image = await loadImageElement(objectUrl);
            return { image, objectUrl, canExport: true, exportBlockedReason: "" };
        } catch {
            const image = await loadImageElement(source);
            return {
                image,
                objectUrl: "",
                canExport: false,
                exportBlockedReason: "Le navigateur bloque l'export PNG de cette image distante. Utilise une image importée en data URL/blob/local object URL pour pouvoir la copier annotée."
            };
        }
    }

    const image = await loadImageElement(source);
    return { image, objectUrl: "", canExport: true, exportBlockedReason: "" };
}

function useAnnotatableImage(src) {
    const [state, setState] = useState({
        status: "idle",
        image: null,
        width: 0,
        height: 0,
        canExport: false,
        error: "",
        exportBlockedReason: ""
    });

    useEffect(() => {
        let canceled = false;
        let objectUrl = "";

        setState({
            status: "loading",
            image: null,
            width: 0,
            height: 0,
            canExport: false,
            error: "",
            exportBlockedReason: ""
        });

        loadAnnotatableImageSource(src)
            .then((result) => {
                objectUrl = result.objectUrl;
                if (canceled) return;
                setState({
                    status: "ready",
                    image: result.image,
                    width: result.image.naturalWidth || result.image.width,
                    height: result.image.naturalHeight || result.image.height,
                    canExport: result.canExport,
                    error: "",
                    exportBlockedReason: result.exportBlockedReason
                });
            })
            .catch((error) => {
                if (canceled) return;
                setState({
                    status: "error",
                    image: null,
                    width: 0,
                    height: 0,
                    canExport: false,
                    error: error?.message || "Impossible de charger cette image.",
                    exportBlockedReason: ""
                });
            });

        return () => {
            canceled = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [src]);

    return state;
}

function useElementSize() {
    const ref = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const node = ref.current;
        if (!node) return undefined;

        const update = () => {
            const rect = node.getBoundingClientRect();
            setSize({
                width: Math.max(0, Math.round(rect.width)),
                height: Math.max(0, Math.round(rect.height))
            });
        };

        update();
        if (typeof ResizeObserver === "undefined") {
            window.addEventListener("resize", update);
            return () => window.removeEventListener("resize", update);
        }

        const observer = new ResizeObserver(update);
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return [ref, size];
}

function getStagePoint(event, imageRect) {
    const stage = event.target.getStage();
    const pointer = stage?.getPointerPosition();
    return stagePointToImagePoint(pointer, imageRect);
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function normalizeStrokeWidth(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return DEFAULT_STROKE_WIDTH;
    return clamp(Math.round(numeric), MIN_STROKE_WIDTH, MAX_STROKE_WIDTH);
}

function getAnnotationStrokeWidth(annotation = {}) {
    return normalizeStrokeWidth(annotation.strokeWidth ?? DEFAULT_STROKE_WIDTH);
}

function getArrowPointerSize(strokeWidth) {
    return Math.max(10, strokeWidth * 4);
}

function stageCoordsToImagePoint(point, imageRect) {
    const scale = imageRect.scale || 1;
    const sourceX = Number.isFinite(imageRect.sourceX) ? imageRect.sourceX : 0;
    const sourceY = Number.isFinite(imageRect.sourceY) ? imageRect.sourceY : 0;
    const sourceWidth = Number.isFinite(imageRect.sourceWidth) ? imageRect.sourceWidth : imageRect.imageWidth;
    const sourceHeight = Number.isFinite(imageRect.sourceHeight) ? imageRect.sourceHeight : imageRect.imageHeight;
    return {
        x: clamp(sourceX + ((point.x - imageRect.x) / scale), sourceX, sourceX + sourceWidth),
        y: clamp(sourceY + ((point.y - imageRect.y) / scale), sourceY, sourceY + sourceHeight)
    };
}

function normalizeCropRect(crop, imageWidth, imageHeight) {
    if (!crop || imageWidth <= 0 || imageHeight <= 0) return null;
    const rawX = Number(crop.x);
    const rawY = Number(crop.y);
    const rawWidth = Number(crop.width);
    const rawHeight = Number(crop.height);
    if (![rawX, rawY, rawWidth, rawHeight].every(Number.isFinite)) return null;

    const left = clamp(Math.min(rawX, rawX + rawWidth), 0, imageWidth);
    const top = clamp(Math.min(rawY, rawY + rawHeight), 0, imageHeight);
    const right = clamp(Math.max(rawX, rawX + rawWidth), 0, imageWidth);
    const bottom = clamp(Math.max(rawY, rawY + rawHeight), 0, imageHeight);
    const width = right - left;
    const height = bottom - top;

    if (width < MIN_CROP_SIZE || height < MIN_CROP_SIZE) return null;
    if (left <= 1 && top <= 1 && right >= imageWidth - 1 && bottom >= imageHeight - 1) return null;

    return { x: left, y: top, width, height };
}

function getImageSourceRect(crop, imageWidth, imageHeight) {
    return normalizeCropRect(crop, imageWidth, imageHeight) || {
        x: 0,
        y: 0,
        width: imageWidth,
        height: imageHeight
    };
}

function getDisplayImageRect(imageWidth, imageHeight, containerWidth, containerHeight, crop) {
    const source = getImageSourceRect(crop, imageWidth, imageHeight);
    const rect = getContainedImageRect(source.width, source.height, containerWidth, containerHeight);
    return {
        ...rect,
        imageWidth,
        imageHeight,
        sourceX: source.x,
        sourceY: source.y,
        sourceWidth: source.width,
        sourceHeight: source.height
    };
}

function makeKonvaCrop(sourceRect) {
    return {
        x: sourceRect.x,
        y: sourceRect.y,
        width: sourceRect.width,
        height: sourceRect.height
    };
}

function isFinitePoint(point) {
    return Number.isFinite(point?.x) && Number.isFinite(point?.y);
}

function getArrowEndpoints(annotation = {}) {
    const [x1, y1, x2, y2] = annotation.points || [];
    return {
        start: {
            x: Number.isFinite(x1) ? x1 : 0,
            y: Number.isFinite(y1) ? y1 : 0
        },
        end: {
            x: Number.isFinite(x2) ? x2 : 0,
            y: Number.isFinite(y2) ? y2 : 0
        }
    };
}

function getArrowMidpoint(start, end) {
    return {
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2
    };
}

function hasCustomArrowControl(annotation = {}) {
    return isFinitePoint(annotation.control);
}

function getArrowControlPoint(annotation = {}) {
    const { start, end } = getArrowEndpoints(annotation);
    return hasCustomArrowControl(annotation) ? annotation.control : getArrowMidpoint(start, end);
}

function getQuadraticBezierPoint(start, control, end, t) {
    const inverse = 1 - t;
    return {
        x: inverse * inverse * start.x + 2 * inverse * t * control.x + t * t * end.x,
        y: inverse * inverse * start.y + 2 * inverse * t * control.y + t * t * end.y
    };
}

function getArrowCurvePoints(annotation = {}) {
    const { start, end } = getArrowEndpoints(annotation);
    const control = getArrowControlPoint(annotation);
    const points = [];
    for (let index = 0; index <= ARROW_CURVE_SEGMENTS; index += 1) {
        points.push(getQuadraticBezierPoint(start, control, end, index / ARROW_CURVE_SEGMENTS));
    }
    return points;
}

function getArrowStagePoints(annotation, imageRect) {
    return getArrowCurvePoints(annotation).flatMap((point) => {
        const stagePoint = imagePointToStagePoint(point, imageRect);
        return [stagePoint.x, stagePoint.y];
    });
}

function getArrowExportPoints(annotation, exportScale, sourceRect) {
    return getArrowCurvePoints(annotation).flatMap((point) => [
        (point.x - sourceRect.x) * exportScale,
        (point.y - sourceRect.y) * exportScale
    ]);
}

function renderAnnotationShape(annotation, imageRect, options = {}) {
    const {
        editable = false,
        keyPrefix = "",
        onDragEnd,
        onSelect,
        onTransformEnd,
        setNodeRef
    } = options;
    const scale = imageRect.scale || 1;
    const color = annotation.color || COLOR_OPTIONS[0];
    const strokeWidth = getAnnotationStrokeWidth(annotation);
    const commonProps = editable ? {
        draggable: true,
        listening: true,
        name: "annotation-shape",
        onClick: (event) => {
            event.cancelBubble = true;
            onSelect?.(annotation.id);
        },
        onDragEnd: (event) => onDragEnd?.(annotation, event),
        onMouseDown: (event) => {
            event.cancelBubble = true;
            onSelect?.(annotation.id);
        },
        onTap: (event) => {
            event.cancelBubble = true;
            onSelect?.(annotation.id);
        },
        onTouchStart: (event) => {
            event.cancelBubble = true;
            onSelect?.(annotation.id);
        },
        onTransformEnd: (event) => onTransformEnd?.(annotation, event),
        ref: (node) => setNodeRef?.(annotation.id, node)
    } : {
        listening: false,
        ref: (node) => setNodeRef?.(annotation.id, node)
    };

    if (annotation.type === "arrow") {
        return (
            <KonvaArrow
                key={`${keyPrefix}${annotation.id}`}
                points={getArrowStagePoints(annotation, imageRect)}
                pointerLength={getArrowPointerSize(strokeWidth)}
                pointerWidth={getArrowPointerSize(strokeWidth)}
                stroke={color}
                fill={color}
                strokeWidth={strokeWidth}
                lineCap="round"
                lineJoin="round"
                hitStrokeWidth={Math.max(22, strokeWidth + 18)}
                {...commonProps}
            />
        );
    }

    if (annotation.type === "rect") {
        const topLeft = imagePointToStagePoint({ x: annotation.x, y: annotation.y }, imageRect);
        return (
            <Rect
                key={`${keyPrefix}${annotation.id}`}
                x={topLeft.x}
                y={topLeft.y}
                width={(annotation.width || 0) * scale}
                height={(annotation.height || 0) * scale}
                stroke={color}
                strokeWidth={strokeWidth}
                fill={colorWithAlpha(color)}
                cornerRadius={4}
                {...commonProps}
            />
        );
    }

    if (annotation.type === "text") {
        const point = imagePointToStagePoint(annotation, imageRect);
        const fontSize = Math.max(10, (annotation.fontSize || 34) * scale);
        const width = Math.max(120, (annotation.width || 360) * scale);
        return (
            <Label
                key={`${keyPrefix}${annotation.id}`}
                x={point.x}
                y={point.y}
                {...commonProps}
            >
                <Tag
                    fill={color}
                    opacity={0.92}
                    cornerRadius={8}
                    pointerDirection="down"
                    pointerWidth={14}
                    pointerHeight={10}
                />
                <Text
                    text={annotation.text || ""}
                    width={width}
                    padding={10}
                    fontSize={fontSize}
                    lineHeight={1.2}
                    fontStyle="700"
                    fill="#ffffff"
                    wrap="word"
                />
            </Label>
        );
    }

    return null;
}

function renderArrowEditHandles(annotation, imageRect, options = {}) {
    if (!annotation || annotation.type !== "arrow") return null;
    const {
        onHandleDrag,
        onSelect
    } = options;
    const color = annotation.color || COLOR_OPTIONS[0];
    const { start, end } = getArrowEndpoints(annotation);
    const control = getArrowControlPoint(annotation);
    const handles = [
        { id: "start", point: start, fill: "#ffffff", stroke: color, radius: ARROW_HANDLE_RADIUS, title: "Départ" },
        { id: "control", point: control, fill: color, stroke: "#ffffff", radius: ARROW_HANDLE_RADIUS - 1, title: "Courbure" },
        { id: "end", point: end, fill: "#ffffff", stroke: color, radius: ARROW_HANDLE_RADIUS, title: "Pointe" }
    ];

    return handles.map((handle) => {
        const stagePoint = imagePointToStagePoint(handle.point, imageRect);
        return (
            <Circle
                key={`${annotation.id}-${handle.id}-handle`}
                x={stagePoint.x}
                y={stagePoint.y}
                radius={handle.radius}
                fill={handle.fill}
                stroke={handle.stroke}
                strokeWidth={2}
                draggable
                listening
                name="annotation-handle"
                shadowBlur={5}
                shadowColor="rgba(0,0,0,0.45)"
                hitStrokeWidth={22}
                onClick={(event) => {
                    event.cancelBubble = true;
                    onSelect?.(annotation.id);
                }}
                onDragEnd={(event) => onHandleDrag?.(annotation, handle.id, event)}
                onDragMove={(event) => onHandleDrag?.(annotation, handle.id, event)}
                onMouseDown={(event) => {
                    event.cancelBubble = true;
                    onSelect?.(annotation.id);
                }}
                onTap={(event) => {
                    event.cancelBubble = true;
                    onSelect?.(annotation.id);
                }}
                onTouchStart={(event) => {
                    event.cancelBubble = true;
                    onSelect?.(annotation.id);
                }}
            />
        );
    });
}

function renderCropDraftRect(rect, imageRect) {
    if (!rect) return null;
    const topLeft = imagePointToStagePoint({ x: rect.x, y: rect.y }, imageRect);
    return (
        <Rect
            key="crop-draft"
            x={topLeft.x}
            y={topLeft.y}
            width={rect.width * (imageRect.scale || 1)}
            height={rect.height * (imageRect.scale || 1)}
            stroke="#ffffff"
            strokeWidth={2}
            dash={[9, 7]}
            fill="rgba(255,255,255,0.12)"
            listening={false}
        />
    );
}

function materializeDraftAnnotation(draft) {
    if (!draft) return null;
    if (draft.type === "arrow") {
        return {
            id: draft.id,
            type: "arrow",
            points: [draft.start.x, draft.start.y, draft.end.x, draft.end.y],
            color: draft.color,
            strokeWidth: draft.strokeWidth
        };
    }
    if (draft.type === "rect") {
        return {
            id: draft.id,
            type: "rect",
            ...normalizeRectFromPoints(draft.start, draft.end),
            color: draft.color,
            strokeWidth: draft.strokeWidth
        };
    }
    return null;
}

function addAnnotationToKonvaLayer(layer, annotation, exportScale, sourceRect) {
    const color = annotation.color || COLOR_OPTIONS[0];
    const strokeWidth = getAnnotationStrokeWidth(annotation);
    const exportStrokeWidth = Math.max(1, strokeWidth * exportScale);
    const exportArrowPointerSize = Math.max(8, getArrowPointerSize(strokeWidth) * exportScale);

    if (annotation.type === "arrow") {
        layer.add(new Konva.Arrow({
            points: getArrowExportPoints(annotation, exportScale, sourceRect),
            pointerLength: exportArrowPointerSize,
            pointerWidth: exportArrowPointerSize,
            stroke: color,
            fill: color,
            strokeWidth: exportStrokeWidth,
            lineCap: "round",
            lineJoin: "round"
        }));
        return;
    }

    if (annotation.type === "rect") {
        layer.add(new Konva.Rect({
            x: (annotation.x - sourceRect.x) * exportScale,
            y: (annotation.y - sourceRect.y) * exportScale,
            width: annotation.width * exportScale,
            height: annotation.height * exportScale,
            stroke: color,
            strokeWidth: exportStrokeWidth,
            fill: colorWithAlpha(color, 0.24),
            cornerRadius: Math.max(4, 8 * exportScale)
        }));
        return;
    }

    if (annotation.type === "text") {
        const label = new Konva.Label({
            x: (annotation.x - sourceRect.x) * exportScale,
            y: (annotation.y - sourceRect.y) * exportScale
        });
        label.add(new Konva.Tag({
            fill: color,
            opacity: 0.92,
            cornerRadius: Math.max(8, 12 * exportScale),
            pointerDirection: "down",
            pointerWidth: Math.max(12, 18 * exportScale),
            pointerHeight: Math.max(9, 14 * exportScale)
        }));
        label.add(new Konva.Text({
            text: annotation.text || "",
            width: (annotation.width || 360) * exportScale,
            padding: Math.max(10, 14 * exportScale),
            fontSize: Math.max(18, (annotation.fontSize || 34) * exportScale),
            lineHeight: 1.2,
            fontStyle: "700",
            fill: "#ffffff",
            wrap: "word"
        }));
        layer.add(label);
    }
}

async function dataUrlToBlob(dataUrl) {
    const response = await fetch(dataUrl);
    return response.blob();
}

function createExportBaseCanvas(image, sourceRect, exportSize) {
    const canvas = document.createElement("canvas");
    canvas.width = exportSize.width;
    canvas.height = exportSize.height;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("Impossible de préparer le canevas d’export.");

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(
        image,
        sourceRect.x,
        sourceRect.y,
        sourceRect.width,
        sourceRect.height,
        0,
        0,
        exportSize.width,
        exportSize.height
    );
    return canvas;
}

async function buildAnnotatedImageBlob(image, annotations, crop, maxWidth = DEFAULT_ANNOTATION_EXPORT_MAX_WIDTH) {
    const naturalWidth = image.naturalWidth || image.width;
    const naturalHeight = image.naturalHeight || image.height;
    const sourceRect = getImageSourceRect(crop, naturalWidth, naturalHeight);
    const exportSize = getLimitedExportSize(sourceRect.width, sourceRect.height, maxWidth);
    if (!exportSize.width || !exportSize.height) {
        throw new Error("Image invalide pour l'export PNG.");
    }

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-10000px";
    container.style.top = "-10000px";
    document.body.appendChild(container);

    const stage = new Konva.Stage({
        container,
        width: exportSize.width,
        height: exportSize.height
    });
    const layer = new Konva.Layer();
    stage.add(layer);
    const baseCanvas = createExportBaseCanvas(image, sourceRect, exportSize);
    layer.add(new Konva.Image({
        image: baseCanvas,
        x: 0,
        y: 0,
        width: exportSize.width,
        height: exportSize.height
    }));

    annotations.forEach((annotation) => addAnnotationToKonvaLayer(layer, annotation, exportSize.scale, sourceRect));
    layer.draw();

    try {
        const dataUrl = stage.toDataURL({ mimeType: "image/png", pixelRatio: 1 });
        return await dataUrlToBlob(dataUrl);
    } finally {
        stage.destroy();
        container.remove();
    }
}

export default function SuperOfficeImageAnnotator({
    image,
    annotations = [],
    crop = null,
    onChangeAnnotations,
    onChangeCrop,
    onClose
}) {
    const loadedImage = useAnnotatableImage(image?.url);
    const [workspaceRef, workspaceSize] = useElementSize();
    const [tool, setTool] = useState("arrow");
    const [color, setColor] = useState(COLOR_OPTIONS[0]);
    const [strokeWidth, setStrokeWidth] = useState(DEFAULT_STROKE_WIDTH);
    const [draft, setDraft] = useState(null);
    const draftRef = useRef(null);
    const [selectedId, setSelectedId] = useState(null);
    const annotationNodeRefs = useRef(new Map());
    const transformerRef = useRef(null);
    const [copyState, setCopyState] = useState({ status: "idle", message: "" });
    const [exportResult, setExportResult] = useState(null);
    const exportObjectUrlRef = useRef("");

    const activeCrop = useMemo(() => normalizeCropRect(
        crop,
        loadedImage.width,
        loadedImage.height
    ), [crop, loadedImage.height, loadedImage.width]);

    const imageRect = useMemo(() => getDisplayImageRect(
        loadedImage.width,
        loadedImage.height,
        workspaceSize.width,
        workspaceSize.height,
        activeCrop
    ), [activeCrop, loadedImage.height, loadedImage.width, workspaceSize.height, workspaceSize.width]);

    const renderedAnnotations = useMemo(() => {
        const draftAnnotation = materializeDraftAnnotation(draft);
        return draftAnnotation ? [...annotations, draftAnnotation] : annotations;
    }, [annotations, draft]);

    const cropDraftRect = useMemo(() => (
        draft?.type === "crop" ? normalizeRectFromPoints(draft.start, draft.end) : null
    ), [draft]);

    const selectedAnnotation = useMemo(() => (
        annotations.find((annotation) => annotation.id === selectedId) || null
    ), [annotations, selectedId]);

    const selectedSupportsStroke = selectedAnnotation?.type === "arrow" || selectedAnnotation?.type === "rect";
    const activeStrokeWidth = selectedSupportsStroke
        ? getAnnotationStrokeWidth(selectedAnnotation)
        : strokeWidth;

    const setAnnotations = useCallback((nextAnnotations) => {
        onChangeAnnotations?.(nextAnnotations);
    }, [onChangeAnnotations]);

    const addAnnotation = useCallback((annotation) => {
        setAnnotations([...annotations, annotation]);
        setSelectedId(annotation.id);
        setCopyState({ status: "idle", message: "" });
    }, [annotations, setAnnotations]);

    const updateAnnotation = useCallback((annotationId, updater) => {
        setAnnotations(annotations.map((annotation) => {
            if (annotation.id !== annotationId) return annotation;
            return updater(annotation);
        }));
        setCopyState({ status: "idle", message: "" });
    }, [annotations, setAnnotations]);

    const setCrop = useCallback((nextCrop) => {
        onChangeCrop?.(nextCrop);
        setCopyState({ status: "idle", message: "" });
    }, [onChangeCrop]);

    const registerAnnotationNode = useCallback((annotationId, node) => {
        if (!annotationId) return;
        if (node) {
            annotationNodeRefs.current.set(annotationId, node);
            return;
        }
        annotationNodeRefs.current.delete(annotationId);
    }, []);

    const updateDraft = useCallback((nextDraft) => {
        draftRef.current = nextDraft;
        setDraft(nextDraft);
    }, []);

    const handleSelectAnnotation = useCallback((annotationId) => {
        setSelectedId(annotationId);
    }, []);

    const handleStrokeWidthChange = useCallback((event) => {
        const nextStrokeWidth = normalizeStrokeWidth(event.target.value);
        setStrokeWidth(nextStrokeWidth);
        if (selectedSupportsStroke) {
            updateAnnotation(selectedAnnotation.id, (current) => ({
                ...current,
                strokeWidth: nextStrokeWidth
            }));
        }
    }, [selectedAnnotation, selectedSupportsStroke, updateAnnotation]);

    const handleAnnotationDragEnd = useCallback((annotation, event) => {
        event.cancelBubble = true;
        const node = event.target;
        if (!node) return;

        if (annotation.type === "arrow") {
            const dx = (node.x() || 0) / (imageRect.scale || 1);
            const dy = (node.y() || 0) / (imageRect.scale || 1);
            node.position({ x: 0, y: 0 });
            updateAnnotation(annotation.id, (current) => ({
                ...current,
                points: [
                    (current.points?.[0] || 0) + dx,
                    (current.points?.[1] || 0) + dy,
                    (current.points?.[2] || 0) + dx,
                    (current.points?.[3] || 0) + dy
                ],
                ...(hasCustomArrowControl(current)
                    ? { control: { x: current.control.x + dx, y: current.control.y + dy } }
                    : {})
            }));
            return;
        }

        const point = stageCoordsToImagePoint({ x: node.x(), y: node.y() }, imageRect);
        updateAnnotation(annotation.id, (current) => ({
            ...current,
            x: point.x,
            y: point.y
        }));
    }, [imageRect, updateAnnotation]);

    const handleAnnotationTransformEnd = useCallback((annotation, event) => {
        event.cancelBubble = true;
        const node = event.target;
        if (!node) return;

        if (annotation.type === "arrow") {
            return;
        }

        const scaleX = Math.abs(node.scaleX() || 1);
        const scaleY = Math.abs(node.scaleY() || 1);
        const point = stageCoordsToImagePoint({ x: node.x(), y: node.y() }, imageRect);
        node.scale({ x: 1, y: 1 });

        if (annotation.type === "rect") {
            updateAnnotation(annotation.id, (current) => ({
                ...current,
                x: point.x,
                y: point.y,
                width: Math.max(8, (node.width() * scaleX) / (imageRect.scale || 1)),
                height: Math.max(8, (node.height() * scaleY) / (imageRect.scale || 1))
            }));
            return;
        }

        if (annotation.type === "text") {
            updateAnnotation(annotation.id, (current) => ({
                ...current,
                x: point.x,
                y: point.y,
                width: Math.max(120, (current.width || 360) * scaleX),
                fontSize: Math.max(16, Math.min(96, (current.fontSize || 34) * scaleY))
            }));
        }
    }, [imageRect, updateAnnotation]);

    const handleArrowHandleDrag = useCallback((annotation, handleId, event) => {
        event.cancelBubble = true;
        const node = event.target;
        if (!node || annotation.type !== "arrow") return;

        const point = stageCoordsToImagePoint({ x: node.x(), y: node.y() }, imageRect);
        updateAnnotation(annotation.id, (current) => {
            const { start, end } = getArrowEndpoints(current);
            const hadCustomControl = hasCustomArrowControl(current);
            const next = { ...current };

            if (handleId === "start") {
                next.points = [point.x, point.y, end.x, end.y];
                if (!hadCustomControl) delete next.control;
                return next;
            }

            if (handleId === "end") {
                next.points = [start.x, start.y, point.x, point.y];
                if (!hadCustomControl) delete next.control;
                return next;
            }

            next.points = [start.x, start.y, end.x, end.y];
            next.control = point;
            return next;
        });
    }, [imageRect, updateAnnotation]);

    const handlePointerDown = useCallback((event) => {
        if (loadedImage.status !== "ready") return;
        const targetName = typeof event.target?.name === "function" ? event.target.name() : "";
        const isDrawableTarget = event.target === event.target.getStage() || targetName === "annotation-image";
        if (!isDrawableTarget) return;

        setSelectedId(null);
        const point = getStagePoint(event, imageRect);
        if (!point) return;

        if (tool === "text") {
            const text = window.prompt("Texte de la bulle");
            const cleanText = String(text || "").trim();
            if (!cleanText) return;
            addAnnotation({
                id: makeAnnotationId(),
                type: "text",
                x: point.x,
                y: point.y,
                width: Math.min(480, Math.max(220, loadedImage.width - point.x - 24)),
                fontSize: Math.max(28, Math.min(44, Math.round(loadedImage.width * 0.03))),
                text: cleanText,
                color
            });
            return;
        }

        updateDraft({
            id: makeAnnotationId(),
            type: tool,
            start: point,
            end: point,
            color,
            strokeWidth
        });
    }, [addAnnotation, color, imageRect, loadedImage.status, loadedImage.width, strokeWidth, tool, updateDraft]);

    const handlePointerMove = useCallback((event) => {
        const currentDraft = draftRef.current;
        if (!currentDraft) return;
        const point = getStagePoint(event, imageRect);
        if (!point) return;
        updateDraft({ ...currentDraft, end: point });
    }, [imageRect, updateDraft]);

    const commitDraft = useCallback(() => {
        const currentDraft = draftRef.current;
        if (!currentDraft) return;
        const { start, end } = currentDraft;
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        if (Math.hypot(dx, dy) < MIN_DRAW_DISTANCE) {
            updateDraft(null);
            return;
        }

        if (currentDraft.type === "crop") {
            const nextCrop = normalizeCropRect(
                normalizeRectFromPoints(start, end),
                loadedImage.width,
                loadedImage.height
            );
            setCrop(nextCrop);
            setSelectedId(null);
            updateDraft(null);
            return;
        }

        if (currentDraft.type === "arrow") {
            addAnnotation({
                id: currentDraft.id,
                type: "arrow",
                points: [start.x, start.y, end.x, end.y],
                color: currentDraft.color,
                strokeWidth: currentDraft.strokeWidth
            });
        }
        if (currentDraft.type === "rect") {
            const rect = normalizeRectFromPoints(start, end);
            addAnnotation({
                id: currentDraft.id,
                type: "rect",
                ...rect,
                color: currentDraft.color,
                strokeWidth: currentDraft.strokeWidth
            });
        }
        updateDraft(null);
    }, [addAnnotation, loadedImage.height, loadedImage.width, setCrop, updateDraft]);

    const handleUndo = useCallback(() => {
        const nextAnnotations = annotations.slice(0, -1);
        setAnnotations(nextAnnotations);
        if (selectedId && !nextAnnotations.some((annotation) => annotation.id === selectedId)) {
            setSelectedId(null);
        }
        setCopyState({ status: "idle", message: "" });
    }, [annotations, selectedId, setAnnotations]);

    const handleClear = useCallback(() => {
        setAnnotations([]);
        updateDraft(null);
        setSelectedId(null);
        setCopyState({ status: "idle", message: "" });
    }, [setAnnotations, updateDraft]);

    const handleResetCrop = useCallback(() => {
        setCrop(null);
        updateDraft(null);
        setSelectedId(null);
    }, [setCrop, updateDraft]);

    const handleDeleteSelected = useCallback(() => {
        if (!selectedId) return;
        setAnnotations(annotations.filter((annotation) => annotation.id !== selectedId));
        setSelectedId(null);
        setCopyState({ status: "idle", message: "" });
    }, [annotations, selectedId, setAnnotations]);

    const buildFinalImage = useCallback(async () => {
        if (loadedImage.status !== "ready" || !loadedImage.image) {
            throw new Error("L'image n'est pas encore prête.");
        }
        if (!loadedImage.canExport) {
            throw new Error(loadedImage.exportBlockedReason || "Cette image ne peut pas être exportée en PNG depuis le navigateur.");
        }
        return buildAnnotatedImageBlob(loadedImage.image, annotations, activeCrop);
    }, [activeCrop, annotations, loadedImage]);

    const handlePrepareImage = useCallback(async () => {
        setCopyState({ status: "working", message: "Création de l’image finale..." });
        try {
            const blob = await buildFinalImage();
            if (exportObjectUrlRef.current) URL.revokeObjectURL(exportObjectUrlRef.current);
            const objectUrl = URL.createObjectURL(blob);
            exportObjectUrlRef.current = objectUrl;
            const baseName = String(image?.name || "image-annotee")
                .replace(/\.[^.]+$/, "")
                .replace(/[^\p{L}\p{N}._-]+/gu, "-");
            setExportResult({
                blob,
                objectUrl,
                fileName: `${baseName || "image-annotee"}-annotee.png`
            });
            setCopyState({ status: "idle", message: "" });
        } catch (error) {
            setCopyState({
                status: "error",
                message: error?.message || "Impossible de créer l'image annotée."
            });
        }
    }, [buildFinalImage, image?.name]);

    const handleCopyPreparedImage = useCallback(async () => {
        if (!exportResult?.blob) return;
        setCopyState({ status: "working", message: "Copie en cours..." });
        try {
            if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
                throw new Error("Copie automatique bloquée. Fais un clic droit sur l’image puis « Copier l’image ».");
            }
            await navigator.clipboard.write([
                new ClipboardItem({ "image/png": exportResult.blob })
            ]);
            setCopyState({ status: "success", message: "Image copiée." });
        } catch (error) {
            setCopyState({
                status: "error",
                message: error?.message || "Copie automatique bloquée. Fais un clic droit sur l’image puis « Copier l’image »."
            });
        }
    }, [exportResult]);

    const closeExportResult = useCallback(() => {
        if (exportObjectUrlRef.current) {
            URL.revokeObjectURL(exportObjectUrlRef.current);
            exportObjectUrlRef.current = "";
        }
        setExportResult(null);
        setCopyState({ status: "idle", message: "" });
    }, []);

    useEffect(() => () => {
        if (exportObjectUrlRef.current) URL.revokeObjectURL(exportObjectUrlRef.current);
    }, []);

    useEffect(() => {
        if (selectedId && !selectedAnnotation) {
            setSelectedId(null);
        }
    }, [selectedAnnotation, selectedId]);

    useEffect(() => {
        const transformer = transformerRef.current;
        if (!transformer) return;

        const selectedNode = selectedId && selectedAnnotation?.type !== "arrow"
            ? annotationNodeRefs.current.get(selectedId)
            : null;
        transformer.nodes(selectedNode ? [selectedNode] : []);
        transformer.getLayer()?.batchDraw();
    }, [annotations, imageRect, selectedAnnotation, selectedId]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose?.();
                return;
            }
            if ((event.key === "Delete" || event.key === "Backspace") && selectedId) {
                event.preventDefault();
                handleDeleteSelected();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleDeleteSelected, onClose, selectedId]);

    return (
        <div className="so-annotator" role="dialog" aria-modal="true" aria-label={`Annoter ${image?.name || "image"}`} onMouseDown={(event) => event.stopPropagation()}>
            <div className="so-annotator__bar">
                <div className="so-annotator__title">
                    <strong>{image?.name || "Image"}</strong>
                    <span>{loadedImage.width && loadedImage.height ? `${loadedImage.width} x ${loadedImage.height}` : "Chargement"}</span>
                </div>
                <div className="so-annotator__tools" role="toolbar" aria-label="Annotation tools">
                    <div className="so-annotator__tool-group">
                        {TOOL_OPTIONS.map((option) => {
                            const Icon = option.icon;
                            return (
                                <button
                                    key={option.id}
                                    type="button"
                                    className={tool === option.id ? "is-active" : ""}
                                    onClick={() => {
                                        setTool(option.id);
                                        setSelectedId(null);
                                    }}
                                    title={option.title}
                                    aria-label={option.title}
                                >
                                    <Icon size={18} aria-hidden="true" />
                                </button>
                            );
                        })}
                    </div>
                    <div className="so-annotator__colors" aria-label="Couleur">
                        {COLOR_OPTIONS.map((option) => (
                            <button
                                key={option}
                                type="button"
                                className={color === option ? "is-active" : ""}
                                style={{ "--annotation-color": option }}
                                onClick={() => setColor(option)}
                                title={`Couleur ${option}`}
                                aria-label={`Couleur ${option}`}
                            />
                        ))}
                    </div>
                    <label className="so-annotator__stroke" title="Épaisseur">
                        <span>Trait</span>
                        <input
                            type="range"
                            min={MIN_STROKE_WIDTH}
                            max={MAX_STROKE_WIDTH}
                            step="1"
                            value={activeStrokeWidth}
                            onChange={handleStrokeWidthChange}
                            aria-label="Épaisseur du trait"
                        />
                        <output>{activeStrokeWidth}</output>
                    </label>
                    <div className="so-annotator__tool-group">
                        <button type="button" onClick={handleUndo} disabled={annotations.length === 0} title="Undo" aria-label="Undo">
                            <RotateCcw size={18} aria-hidden="true" />
                        </button>
                        <button type="button" onClick={handleDeleteSelected} disabled={!selectedId} title="Supprimer la sélection" aria-label="Supprimer la sélection">
                            <Trash2 size={18} aria-hidden="true" />
                        </button>
                        <button type="button" onClick={handleResetCrop} disabled={!activeCrop} title="Image complète" aria-label="Image complète">
                            <Maximize2 size={18} aria-hidden="true" />
                        </button>
                        <button type="button" className="so-annotator__text-action" onClick={handleClear} disabled={annotations.length === 0 && !draft} title="Tout effacer" aria-label="Tout effacer">
                            <span>Clear</span>
                        </button>
                        <button type="button" className="so-annotator__copy" onClick={handlePrepareImage} disabled={copyState.status === "working" || loadedImage.status !== "ready"} title="Créer l’image finale">
                            <ClipboardCopy size={17} aria-hidden="true" />
                            <span>Image finale</span>
                        </button>
                        <button type="button" onClick={onClose} title="Fermer" aria-label="Fermer">
                            <X size={19} aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="so-annotator__workspace" ref={workspaceRef}>
                {loadedImage.status === "loading" && (
                    <div className="so-annotator__state">Chargement de l’image...</div>
                )}
                {loadedImage.status === "error" && (
                    <div className="so-annotator__state is-error">{loadedImage.error}</div>
                )}
                {loadedImage.status === "ready" && (
                    <Stage
                        width={Math.max(1, workspaceSize.width)}
                        height={Math.max(1, workspaceSize.height)}
                        onMouseDown={handlePointerDown}
                        onMouseMove={handlePointerMove}
                        onMouseUp={commitDraft}
                        onMouseLeave={commitDraft}
                        onTouchStart={handlePointerDown}
                        onTouchMove={handlePointerMove}
                        onTouchEnd={commitDraft}
                    >
                        <Layer>
                            <Group
                                clipX={imageRect.x}
                                clipY={imageRect.y}
                                clipWidth={imageRect.width}
                                clipHeight={imageRect.height}
                            >
                                <KonvaImage
                                    image={loadedImage.image}
                                    crop={makeKonvaCrop({
                                        x: imageRect.sourceX || 0,
                                        y: imageRect.sourceY || 0,
                                        width: imageRect.sourceWidth || loadedImage.width,
                                        height: imageRect.sourceHeight || loadedImage.height
                                    })}
                                    x={imageRect.x}
                                    y={imageRect.y}
                                    width={imageRect.width}
                                    height={imageRect.height}
                                    listening
                                    name="annotation-image"
                                />
                                {renderedAnnotations.map((annotation) => {
                                    const isDraftAnnotation = draft?.id === annotation.id;
                                    return renderAnnotationShape(annotation, imageRect, {
                                        editable: !isDraftAnnotation,
                                        keyPrefix: isDraftAnnotation ? "draft-" : "",
                                        onDragEnd: handleAnnotationDragEnd,
                                        onSelect: handleSelectAnnotation,
                                        onTransformEnd: handleAnnotationTransformEnd,
                                        setNodeRef: isDraftAnnotation ? undefined : registerAnnotationNode
                                    });
                                })}
                                {selectedAnnotation?.type === "arrow" && renderArrowEditHandles(selectedAnnotation, imageRect, {
                                    onHandleDrag: handleArrowHandleDrag,
                                    onSelect: handleSelectAnnotation
                                })}
                                {renderCropDraftRect(cropDraftRect, imageRect)}
                            </Group>
                            <Transformer
                                ref={transformerRef}
                                rotateEnabled={false}
                                flipEnabled={false}
                                anchorSize={9}
                                anchorStroke="#93c5fd"
                                anchorFill="#ffffff"
                                borderStroke="#60a5fa"
                                borderDash={[5, 5]}
                                boundBoxFunc={(oldBox, newBox) => {
                                    const width = Math.abs(newBox.width);
                                    const height = Math.abs(newBox.height);
                                    return width < 18 || height < 18 ? oldBox : newBox;
                                }}
                            />
                        </Layer>
                    </Stage>
                )}
            </div>

            {(copyState.message || loadedImage.exportBlockedReason) && (
                <div className={`so-annotator__status ${copyState.status === "error" || loadedImage.exportBlockedReason ? "is-error" : ""}`}>
                    {copyState.message || loadedImage.exportBlockedReason}
                </div>
            )}

            {exportResult && (
                <div className="so-annotator-result" role="dialog" aria-modal="true" aria-label="Image annotée prête">
                    <div className="so-annotator-result__bar">
                        <div>
                            <strong>Image annotée prête</strong>
                            <span>Clic droit sur l’image → Copier l’image si la copie automatique est bloquée.</span>
                        </div>
                        <div className="so-annotator-result__actions">
                            <button type="button" className="secondary-btn" onClick={closeExportResult}>
                                Retour à l’éditeur
                            </button>
                            <button type="button" className="primary-btn" onClick={handleCopyPreparedImage} disabled={copyState.status === "working"}>
                                <ClipboardCopy size={16} aria-hidden="true" />
                                Copier l’image
                            </button>
                            <a className="secondary-btn" href={exportResult.objectUrl} download={exportResult.fileName}>
                                <Download size={16} aria-hidden="true" />
                                Télécharger PNG
                            </a>
                            <button type="button" className="so-annotator-result__close" onClick={onClose} title="Fermer" aria-label="Fermer le résultat">
                                <X size={19} aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                    <div className="so-annotator-result__preview">
                        <img src={exportResult.objectUrl} alt="Image annotée finale à copier" draggable="true" />
                    </div>
                    {copyState.message && (
                        <div className={`so-annotator__status ${copyState.status === "error" ? "is-error" : ""}`}>
                            {copyState.message}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

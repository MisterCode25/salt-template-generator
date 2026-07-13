import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Edit3,
    ExternalLink,
    FileText,
    Image as ImageIcon,
    RotateCcw,
    Video,
    ZoomIn,
    ZoomOut
} from "lucide-react";
import Modal from "./Modal.jsx";
import SuperOfficeImageAnnotator from "./SuperOfficeImageAnnotator.jsx";
import {
    getSuperOfficeMediaAttachments,
    groupSuperOfficeMediaAttachmentsByPost
} from "../utils/superOfficeImport.js";

const VIEWER_MIN_ZOOM = 1;
const VIEWER_MAX_ZOOM = 5;
const VIEWER_ZOOM_STEP = 0.35;
const BROWSER_PREVIEWABLE_IMAGE_PATTERN = /\.(jpe?g|png|webp|gif|bmp|avif|ico|svg)(?:$|[?#])/i;
const CONVERTIBLE_IMAGE_PATTERN = /\.(heic|heif|tiff?|tif)(?:$|[?#])/i;
const INITIAL_VISIBLE_MEDIA_COUNT = 72;
const VISIBLE_MEDIA_BATCH_SIZE = 72;

const convertedImageUrlCache = new Map();

function displayValue(value) {
    if (value === null || value === undefined) return "";
    return String(value).trim();
}

function firstValue(...values) {
    for (const value of values) {
        const text = displayValue(value);
        if (text) return text;
    }
    return "";
}

function attachmentKey(attachment) {
    return `${attachment?.type || ""}|${attachment?.name || ""}|${attachment?.url || ""}`;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function getDefaultViewerTransform() {
    return { scale: 1, x: 0, y: 0 };
}

function getMediaTypeLabel(attachment = {}) {
    if (attachment.type === "video") return "Vidéo";
    if (attachment.type === "pdf") return "PDF";
    return "Photo";
}

function getMediaIcon(attachment = {}) {
    if (attachment.type === "video") return Video;
    if (attachment.type === "pdf") return FileText;
    return ImageIcon;
}

function getOpenMediaLabel(attachment = {}) {
    if (attachment.type === "video") return "Ouvrir la vidéo";
    if (attachment.type === "pdf") return "Ouvrir le PDF";
    return "Ouvrir l’image";
}

function getVideoContentType(attachment = {}) {
    const contentType = displayValue(attachment.contentType).toLowerCase();
    if (contentType.startsWith("video/")) return contentType;

    const source = `${attachment.name || ""} ${attachment.url || ""}`;
    if (/\.mov(?:$|[?#])/i.test(source)) return "video/quicktime";
    if (/\.mp4(?:$|[?#])/i.test(source)) return "video/mp4";
    return undefined;
}

function isBrowserPreviewableImage(attachment = {}) {
    const contentType = displayValue(attachment.contentType).toLowerCase();
    if (contentType === "image/svg+xml") return true;
    if (/^image\/(jpeg|jpg|png|webp|gif|bmp|avif|x-icon|vnd\.microsoft\.icon)$/.test(contentType)) return true;

    const source = `${attachment.name || ""} ${attachment.url || ""}`;
    return BROWSER_PREVIEWABLE_IMAGE_PATTERN.test(source);
}

function isConvertibleImage(attachment = {}) {
    const contentType = displayValue(attachment.contentType).toLowerCase();
    if (["image/heic", "image/heif", "image/tiff", "image/tif"].includes(contentType)) return true;

    const source = `${attachment.name || ""} ${attachment.url || ""}`;
    return CONVERTIBLE_IMAGE_PATTERN.test(source);
}

async function buildConvertedImageUrl(attachment = {}) {
    if (!attachment.url || typeof fetch !== "function" || typeof createImageBitmap !== "function") {
        throw new Error("IMAGE_CONVERSION_UNAVAILABLE");
    }

    const cacheKey = attachmentKey(attachment);
    const cached = convertedImageUrlCache.get(cacheKey);
    if (cached) return cached;

    const response = await fetch(attachment.url, { credentials: "include" });
    if (!response.ok) throw new Error("IMAGE_FETCH_FAILED");

    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("IMAGE_CANVAS_UNAVAILABLE");
    context.drawImage(bitmap, 0, 0);
    bitmap.close?.();

    const convertedBlob = await new Promise((resolve, reject) => {
        canvas.toBlob((nextBlob) => {
            if (nextBlob) resolve(nextBlob);
            else reject(new Error("IMAGE_EXPORT_FAILED"));
        }, "image/png");
    });
    const objectUrl = URL.createObjectURL(convertedBlob);
    convertedImageUrlCache.set(cacheKey, objectUrl);
    return objectUrl;
}

function useDisplayImageUrl(attachment) {
    const [displayUrl, setDisplayUrl] = useState(attachment?.url || "");

    useEffect(() => {
        let cancelled = false;

        if (!attachment?.url) {
            setDisplayUrl("");
            return undefined;
        }

        if (isBrowserPreviewableImage(attachment) || !isConvertibleImage(attachment)) {
            setDisplayUrl(attachment.url);
            return undefined;
        }

        setDisplayUrl("");
        buildConvertedImageUrl(attachment)
            .then((nextUrl) => {
                if (!cancelled) setDisplayUrl(nextUrl);
            })
            .catch(() => {
                if (!cancelled) {
                    setDisplayUrl(attachment.url);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [attachment]);

    return displayUrl;
}

function inferRouterModelFromSerial(serial = "") {
    const value = displayValue(serial).toUpperCase();
    if (value.startsWith("GFAB")) return "X6";
    if (value.startsWith("GFAC")) return "W7";
    if (value.startsWith("SFAA")) return "Arc";
    return "";
}

function buildPhotoContextBadges(profile = null) {
    if (!profile || typeof profile !== "object") return [];

    const vars = profile.vars || profile.variables || {};
    const routerSerial = firstValue(
        profile.routerSerialNumber,
        profile.oldRouterSerialNumber,
        vars.routerSerialNumber,
        vars.healthcheckRouterSerialNumber
    );
    const routerModel = firstValue(
        profile.routerModel,
        profile.boxType,
        profile.externalBoxType,
        vars.routerModel,
        vars.boxType,
        vars.externalBoxType,
        inferRouterModelFromSerial(routerSerial)
    );

    return [
        {
            key: "oto",
            label: "Prise optique",
            value: firstValue(profile.otoId, vars.otoId, vars.healthcheckOtoId)
        },
        {
            key: "port",
            label: "Port",
            value: firstValue(
                profile.otoPortId,
                profile.crossConnectionPort,
                vars.otoPortId,
                vars.healthcheckOtoPortId,
                vars.crossConnectionPort,
                vars.healthcheckCrossConnexionPort
            )
        },
        {
            key: "routerSerial",
            label: "N° série routeur",
            value: routerSerial
        },
        {
            key: "routerModel",
            label: "Modèle routeur",
            value: routerModel
        }
    ].filter((badge) => badge.value);
}

function normalizeZoom(value) {
    return Math.round(clamp(value, VIEWER_MIN_ZOOM, VIEWER_MAX_ZOOM) * 100) / 100;
}

function clampViewerTransform(transform, bounds) {
    const scale = normalizeZoom(transform.scale);
    if (scale <= VIEWER_MIN_ZOOM) return getDefaultViewerTransform();

    const maxX = bounds?.width ? (bounds.width * (scale - 1)) / 2 : Number.POSITIVE_INFINITY;
    const maxY = bounds?.height ? (bounds.height * (scale - 1)) / 2 : Number.POSITIVE_INFINITY;

    return {
        scale,
        x: clamp(transform.x || 0, -maxX, maxX),
        y: clamp(transform.y || 0, -maxY, maxY)
    };
}

function getZoomedViewerTransform(currentTransform, nextScaleValue, anchorPoint, bounds) {
    const currentScale = currentTransform.scale || VIEWER_MIN_ZOOM;
    const nextScale = normalizeZoom(nextScaleValue);
    if (nextScale <= VIEWER_MIN_ZOOM) return getDefaultViewerTransform();

    const centerX = (bounds?.width || 0) / 2;
    const centerY = (bounds?.height || 0) / 2;
    const anchorX = (anchorPoint?.x ?? centerX) - centerX;
    const anchorY = (anchorPoint?.y ?? centerY) - centerY;
    const ratio = nextScale / currentScale;

    return clampViewerTransform({
        scale: nextScale,
        x: anchorX - (anchorX - currentTransform.x) * ratio,
        y: anchorY - (anchorY - currentTransform.y) * ratio
    }, bounds);
}

function limitMediaGroups(groups = [], visibleCount = INITIAL_VISIBLE_MEDIA_COUNT) {
    let remaining = visibleCount;
    const visibleGroups = [];

    for (const group of groups) {
        if (remaining <= 0) break;
        const visibleAttachments = group.attachments.slice(0, remaining);
        if (visibleAttachments.length > 0) {
            visibleGroups.push({
                ...group,
                attachments: visibleAttachments,
                hiddenCount: Math.max(group.attachments.length - visibleAttachments.length, 0)
            });
            remaining -= visibleAttachments.length;
        }
    }

    return visibleGroups;
}

function SuperOfficePhotoThumb({ attachment, onOpen, hasFailed, onMediaError }) {
    const [isImageLoading, setIsImageLoading] = useState(false);

    const handleClick = useCallback(() => {
        onOpen(attachment.galleryIndex);
    }, [attachment.galleryIndex, onOpen]);

    const mediaTypeLabel = getMediaTypeLabel(attachment);
    const MediaIcon = getMediaIcon(attachment);
    const isImage = attachment.type === "image";
    const displayUrl = useDisplayImageUrl(attachment);
    const shouldRenderImage = isImage && !hasFailed && displayUrl;

    useEffect(() => {
        setIsImageLoading(Boolean(shouldRenderImage));
    }, [shouldRenderImage, displayUrl]);

    return (
        <button
            type="button"
            className="so-photo-thumb"
            onClick={handleClick}
            title={`${attachment.name} · ${mediaTypeLabel}`}
        >
            {shouldRenderImage ? (
                <>
                    {isImageLoading && (
                        <span className="so-photo-loading" aria-hidden="true">
                            <span className="so-photo-loading__spinner" />
                        </span>
                    )}
                    <img
                        src={displayUrl}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                        onLoad={() => setIsImageLoading(false)}
                        onError={() => {
                            setIsImageLoading(false);
                            onMediaError(attachment);
                        }}
                    />
                </>
            ) : (
                <span className={`so-photo-thumb__fallback so-photo-thumb__fallback--${attachment.type}`} aria-hidden="true">
                    <MediaIcon size={30} strokeWidth={1.7} />
                </span>
            )}
            <span className={`so-photo-thumb__type so-photo-thumb__type--${attachment.type}`}>{mediaTypeLabel}</span>
            <span className="so-photo-thumb__name">{attachment.name}</span>
        </button>
    );
}

function SuperOfficeViewerFallback({ attachment, message = "Aperçu indisponible." }) {
    const MediaIcon = getMediaIcon(attachment);

    return (
        <div className="so-photo-viewer__fallback">
            <MediaIcon size={48} strokeWidth={1.6} />
            <span>{message}</span>
            <a href={attachment.url} target="_blank" rel="noreferrer">
                {getOpenMediaLabel(attachment)}
                <ExternalLink size={15} aria-hidden="true" />
            </a>
        </div>
    );
}

function SuperOfficeImagePreview({ attachment, viewerTransform, onMediaError }) {
    const [isLoading, setIsLoading] = useState(false);
    const displayUrl = useDisplayImageUrl(attachment);

    useEffect(() => {
        setIsLoading(Boolean(displayUrl));
    }, [displayUrl]);

    if (!displayUrl) {
        return (
            <SuperOfficeViewerFallback
                attachment={attachment}
                message="Conversion de l’image en cours…"
            />
        );
    }

    return (
        <>
            {isLoading && (
                <span className="so-photo-viewer__loading" aria-live="polite">
                    <span className="so-photo-loading__spinner" aria-hidden="true" />
                    Chargement de l’image…
                </span>
            )}
            <img
                src={displayUrl}
                alt={attachment.name}
                draggable="false"
                style={{
                    transform: `translate3d(${viewerTransform.x}px, ${viewerTransform.y}px, 0) scale(${viewerTransform.scale})`
                }}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setIsLoading(false);
                    onMediaError(attachment);
                }}
            />
        </>
    );
}

export default function SuperOfficePhotoGallery({ ticket, profile = null, onClose }) {
    const sourceAttachments = useMemo(() => (
        ticket?.attachments?.length ? ticket.attachments : ticket?.mediaAttachments || ticket?.imageAttachments || []
    ), [ticket]);
    const mediaItems = useMemo(() => getSuperOfficeMediaAttachments(sourceAttachments), [sourceAttachments]);
    const groups = useMemo(() => groupSuperOfficeMediaAttachmentsByPost(mediaItems), [mediaItems]);
    const [visibleMediaCount, setVisibleMediaCount] = useState(INITIAL_VISIBLE_MEDIA_COUNT);
    const visibleGroups = useMemo(() => limitMediaGroups(groups, visibleMediaCount), [groups, visibleMediaCount]);
    const hasHiddenMedia = visibleMediaCount < mediaItems.length;
    const visibleMediaTotal = Math.min(visibleMediaCount, mediaItems.length);
    const contextBadges = useMemo(() => buildPhotoContextBadges(profile), [profile]);
    const [activeIndex, setActiveIndex] = useState(null);
    const [annotatorOpen, setAnnotatorOpen] = useState(false);
    const [annotationsByImage, setAnnotationsByImage] = useState({});
    const [cropsByImage, setCropsByImage] = useState({});
    const [failedAttachments, setFailedAttachments] = useState(() => new Set());
    const [viewerTransform, setViewerTransform] = useState(getDefaultViewerTransform);
    const [isViewerPanning, setIsViewerPanning] = useState(false);
    const viewerImageWrapRef = useRef(null);
    const viewerPanRef = useRef(null);
    const activeAttachment = activeIndex === null ? null : mediaItems[activeIndex] || null;
    const activeAttachmentKey = activeAttachment ? attachmentKey(activeAttachment) : "";
    const activeIsImage = activeAttachment?.type === "image";
    const activeImageKey = activeIsImage ? activeAttachmentKey : "";
    const activeAnnotations = activeImageKey ? annotationsByImage[activeImageKey] || [] : [];
    const activeCrop = activeImageKey ? cropsByImage[activeImageKey] || null : null;
    const activeAttachmentFailed = activeAttachmentKey ? failedAttachments.has(activeAttachmentKey) : false;
    const activeImageFailed = activeIsImage && activeAttachmentFailed;
    const viewerZoomPercent = Math.round(viewerTransform.scale * 100);
    const ticketSignature = `${ticket?.clientSignature || ""}|${ticket?.ticketId || ""}|${ticket?.importedAt || ""}`;

    const openAttachment = useCallback((index) => {
        setActiveIndex(index);
    }, []);

    const showMoreMedia = useCallback(() => {
        setVisibleMediaCount((current) => Math.min(current + VISIBLE_MEDIA_BATCH_SIZE, mediaItems.length));
    }, [mediaItems.length]);

    const closeAttachment = useCallback(() => {
        setAnnotatorOpen(false);
        setActiveIndex(null);
    }, []);

    const goToPrevious = useCallback(() => {
        setAnnotatorOpen(false);
        setActiveIndex((current) => {
            if (current === null || mediaItems.length === 0) return current;
            return (current - 1 + mediaItems.length) % mediaItems.length;
        });
    }, [mediaItems.length]);

    const goToNext = useCallback(() => {
        setAnnotatorOpen(false);
        setActiveIndex((current) => {
            if (current === null || mediaItems.length === 0) return current;
            return (current + 1) % mediaItems.length;
        });
    }, [mediaItems.length]);

    const handleMediaError = useCallback((attachment) => {
        setFailedAttachments((current) => {
            const next = new Set(current);
            next.add(attachmentKey(attachment));
            return next;
        });
    }, []);

    const updateActiveAnnotations = useCallback((nextAnnotations) => {
        if (!activeImageKey) return;
        setAnnotationsByImage((current) => ({
            ...current,
            [activeImageKey]: nextAnnotations
        }));
    }, [activeImageKey]);

    const updateActiveCrop = useCallback((nextCrop) => {
        if (!activeImageKey) return;
        setCropsByImage((current) => {
            if (!nextCrop) {
                const { [activeImageKey]: _removed, ...rest } = current;
                return rest;
            }
            return {
                ...current,
                [activeImageKey]: nextCrop
            };
        });
    }, [activeImageKey]);

    const resetViewerZoom = useCallback(() => {
        viewerPanRef.current = null;
        setIsViewerPanning(false);
        setViewerTransform(getDefaultViewerTransform());
    }, []);

    const updateViewerZoom = useCallback((nextScaleValue, anchorPoint = null) => {
        const bounds = viewerImageWrapRef.current?.getBoundingClientRect();
        setViewerTransform((current) => getZoomedViewerTransform(current, nextScaleValue, anchorPoint, bounds));
    }, []);

    const zoomViewerBy = useCallback((direction) => {
        const nextScaleValue = viewerTransform.scale + (direction * VIEWER_ZOOM_STEP);
        updateViewerZoom(nextScaleValue);
    }, [updateViewerZoom, viewerTransform.scale]);

    const handleViewerWheel = useCallback((event) => {
        if (!activeIsImage || activeImageFailed) return;
        event.preventDefault();
        event.stopPropagation();

        const bounds = event.currentTarget.getBoundingClientRect();
        const wheelFactor = Math.exp(-event.deltaY * 0.0012);
        const anchorPoint = {
            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top
        };

        setViewerTransform((current) => getZoomedViewerTransform(
            current,
            current.scale * wheelFactor,
            anchorPoint,
            bounds
        ));
    }, [activeImageFailed, activeIsImage]);

    const handleViewerDoubleClick = useCallback((event) => {
        if (!activeIsImage || activeImageFailed) return;
        event.preventDefault();
        event.stopPropagation();

        if (viewerTransform.scale > VIEWER_MIN_ZOOM) {
            resetViewerZoom();
            return;
        }

        const bounds = event.currentTarget.getBoundingClientRect();
        updateViewerZoom(2, {
            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top
        });
    }, [activeImageFailed, activeIsImage, resetViewerZoom, updateViewerZoom, viewerTransform.scale]);

    const handleViewerPointerDown = useCallback((event) => {
        if (!activeIsImage || activeImageFailed || viewerTransform.scale <= VIEWER_MIN_ZOOM || event.button !== 0) return;
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.setPointerCapture?.(event.pointerId);
        viewerPanRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            originX: viewerTransform.x,
            originY: viewerTransform.y
        };
        setIsViewerPanning(true);
    }, [activeImageFailed, activeIsImage, viewerTransform]);

    const handleViewerPointerMove = useCallback((event) => {
        const pan = viewerPanRef.current;
        if (!pan || pan.pointerId !== event.pointerId) return;
        event.preventDefault();
        event.stopPropagation();

        const bounds = event.currentTarget.getBoundingClientRect();
        setViewerTransform((current) => clampViewerTransform({
            ...current,
            x: pan.originX + event.clientX - pan.startX,
            y: pan.originY + event.clientY - pan.startY
        }, bounds));
    }, []);

    const endViewerPan = useCallback((event) => {
        const pan = viewerPanRef.current;
        if (!pan) return;
        if (event?.pointerId !== undefined && pan.pointerId !== event.pointerId) return;
        viewerPanRef.current = null;
        setIsViewerPanning(false);
    }, []);

    useEffect(() => {
        if (activeIndex === null || annotatorOpen) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                closeAttachment();
            }
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                goToPrevious();
            }
            if (event.key === "ArrowRight") {
                event.preventDefault();
                goToNext();
            }
            if (activeIsImage && (event.key === "+" || event.key === "=")) {
                event.preventDefault();
                zoomViewerBy(1);
            }
            if (activeIsImage && event.key === "-") {
                event.preventDefault();
                zoomViewerBy(-1);
            }
            if (activeIsImage && event.key === "0") {
                event.preventDefault();
                resetViewerZoom();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [activeIndex, activeIsImage, annotatorOpen, closeAttachment, goToNext, goToPrevious, resetViewerZoom, zoomViewerBy]);

    useEffect(() => {
        resetViewerZoom();
    }, [activeAttachmentKey, resetViewerZoom]);

    useEffect(() => {
        setAnnotatorOpen(false);
        setActiveIndex(null);
        setFailedAttachments(new Set());
        setAnnotationsByImage({});
        setCropsByImage({});
        setVisibleMediaCount(INITIAL_VISIBLE_MEDIA_COUNT);
    }, [ticketSignature]);

    return (
        <Modal
            onClose={onClose}
            dialogClassName="popup-box so-photo-gallery-modal"
            ariaLabel="SuperOffice ticket media"
            disableEscapeClose={activeIndex !== null}
        >
            <div className="popup-header so-photo-gallery-header">
                <div>
                    <p className="eyebrow">SuperOffice</p>
                    <h2>Médias du ticket{ticket?.ticketId ? ` ${ticket.ticketId}` : ""}</h2>
                </div>
                <span className="so-photo-gallery-count">{mediaItems.length} média{mediaItems.length > 1 ? "s" : ""}</span>
            </div>

            <div className="so-photo-gallery-body">
                {visibleGroups.length > 0 ? visibleGroups.map((group) => (
                    <section key={group.dateKey} className="so-photo-date-section">
                        <div className="so-photo-date-section__head">
                            <div>
                                <h3>{group.label}</h3>
                                {group.metaLabel && <small>{group.metaLabel}</small>}
                            </div>
                            <span>{group.attachments.length}{group.hiddenCount ? ` / ${group.attachments.length + group.hiddenCount}` : ""}</span>
                        </div>
                        <div className="so-photo-grid">
                            {group.attachments.map((attachment) => (
                                <SuperOfficePhotoThumb
                                    key={attachmentKey(attachment)}
                                    attachment={attachment}
                                    hasFailed={failedAttachments.has(attachmentKey(attachment))}
                                    onOpen={openAttachment}
                                    onMediaError={handleMediaError}
                                />
                            ))}
                        </div>
                    </section>
                )) : (
                    <div className="so-photo-gallery-empty">
                        <FileText size={34} strokeWidth={1.7} />
                        <span>Aucune photo, vidéo ou PDF dans le dernier ticket importé.</span>
                    </div>
                )}
                {hasHiddenMedia && (
                    <div className="so-photo-gallery-more">
                        <button type="button" onClick={showMoreMedia}>
                            Charger {Math.min(VISIBLE_MEDIA_BATCH_SIZE, mediaItems.length - visibleMediaTotal)} média{mediaItems.length - visibleMediaTotal > 1 ? "s" : ""} de plus
                        </button>
                        <span>{visibleMediaTotal} / {mediaItems.length} médias affichés</span>
                    </div>
                )}
            </div>

            {activeAttachment && (
                <div className="so-photo-viewer" role="dialog" aria-modal="true" aria-label={activeAttachment.name} onMouseDown={closeAttachment}>
                    <div className="so-photo-viewer__stage" onMouseDown={(event) => event.stopPropagation()}>
                        <div className="so-photo-viewer__meta">
                            <div className="so-photo-viewer__meta-main">
                                <strong>{activeAttachment.name}</strong>
                                <div className="so-photo-viewer__meta-actions">
                                    {activeIsImage && (
                                        <div className="so-photo-viewer__zoom-controls" role="group" aria-label="Zoom image">
                                            <button
                                                type="button"
                                                onClick={() => zoomViewerBy(-1)}
                                                disabled={activeImageFailed || viewerTransform.scale <= VIEWER_MIN_ZOOM}
                                                title="Zoom arrière"
                                                aria-label="Zoom arrière"
                                            >
                                                <ZoomOut size={15} aria-hidden="true" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={resetViewerZoom}
                                                disabled={activeImageFailed || viewerTransform.scale <= VIEWER_MIN_ZOOM}
                                                title="Réinitialiser le zoom"
                                                aria-label="Réinitialiser le zoom"
                                            >
                                                <RotateCcw size={14} aria-hidden="true" />
                                                <span>{viewerZoomPercent}%</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => zoomViewerBy(1)}
                                                disabled={activeImageFailed || viewerTransform.scale >= VIEWER_MAX_ZOOM}
                                                title="Zoom avant"
                                                aria-label="Zoom avant"
                                            >
                                                <ZoomIn size={15} aria-hidden="true" />
                                            </button>
                                        </div>
                                    )}
                                    {activeIsImage && !activeAttachmentFailed && (
                                        <button
                                            type="button"
                                            onClick={() => setAnnotatorOpen(true)}
                                            title="Annoter"
                                            aria-label="Annoter l'image"
                                        >
                                            <Edit3 size={15} aria-hidden="true" />
                                            <span>Annoter</span>
                                        </button>
                                    )}
                                    <a
                                        className="so-photo-viewer__open-link"
                                        href={activeAttachment.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        title={getOpenMediaLabel(activeAttachment)}
                                    >
                                        <ExternalLink size={15} aria-hidden="true" />
                                    </a>
                                    <span>{activeIndex + 1} / {mediaItems.length}</span>
                                </div>
                            </div>
                            {contextBadges.length > 0 && (
                                <div className="so-photo-viewer__context-badges" aria-label="Contexte technique client">
                                    {contextBadges.map((badge) => (
                                        <span key={badge.key} className="so-photo-viewer__context-badge" title={`${badge.label}: ${badge.value}`}>
                                            <small>{badge.label}</small>
                                            <strong>{badge.value}</strong>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="so-photo-viewer__image-shell">
                            <button
                                type="button"
                                className="so-photo-viewer__nav so-photo-viewer__nav--prev"
                                onClick={goToPrevious}
                                aria-label="Média précédent"
                                title="Média précédent"
                            >
                                <ChevronLeft size={26} aria-hidden="true" />
                            </button>
                            <div
                                ref={viewerImageWrapRef}
                                className={`so-photo-viewer__image-wrap so-photo-viewer__image-wrap--${activeAttachment.type} ${activeIsImage && viewerTransform.scale > VIEWER_MIN_ZOOM ? "is-zoomed" : ""} ${isViewerPanning ? "is-panning" : ""}`}
                                onWheel={handleViewerWheel}
                                onDoubleClick={handleViewerDoubleClick}
                                onPointerDown={handleViewerPointerDown}
                                onPointerMove={handleViewerPointerMove}
                                onPointerUp={endViewerPan}
                                onPointerCancel={endViewerPan}
                                onLostPointerCapture={endViewerPan}
                            >
                                {activeAttachmentFailed ? (
                                    <SuperOfficeViewerFallback attachment={activeAttachment} />
                                ) : activeIsImage ? (
                                    <SuperOfficeImagePreview
                                        attachment={activeAttachment}
                                        viewerTransform={viewerTransform}
                                        onMediaError={handleMediaError}
                                    />
                                ) : activeAttachment.type === "video" ? (
                                    <video
                                        className="so-photo-viewer__video"
                                        controls
                                        playsInline
                                        preload="metadata"
                                        onError={() => handleMediaError(activeAttachment)}
                                    >
                                        <source src={activeAttachment.url} type={getVideoContentType(activeAttachment)} />
                                        Votre navigateur ne peut pas lire cette vidéo.
                                    </video>
                                ) : activeAttachment.type === "pdf" ? (
                                    <object
                                        className="so-photo-viewer__pdf"
                                        data={activeAttachment.url}
                                        type="application/pdf"
                                        aria-label={activeAttachment.name}
                                    >
                                        <SuperOfficeViewerFallback
                                            attachment={activeAttachment}
                                            message="Prévisualisation PDF indisponible."
                                        />
                                    </object>
                                ) : (
                                    <SuperOfficeViewerFallback attachment={activeAttachment} />
                                )}
                            </div>
                            <button
                                type="button"
                                className="so-photo-viewer__nav so-photo-viewer__nav--next"
                                onClick={goToNext}
                                aria-label="Média suivant"
                                title="Média suivant"
                            >
                                <ChevronRight size={26} aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                    {annotatorOpen && activeIsImage && (
                        <SuperOfficeImageAnnotator
                            image={activeAttachment}
                            annotations={activeAnnotations}
                            crop={activeCrop}
                            onChangeAnnotations={updateActiveAnnotations}
                            onChangeCrop={updateActiveCrop}
                            onClose={() => setAnnotatorOpen(false)}
                        />
                    )}
                </div>
            )}
        </Modal>
    );
}

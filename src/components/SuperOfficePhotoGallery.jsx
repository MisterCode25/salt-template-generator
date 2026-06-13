import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Edit3,
    ExternalLink,
    Image as ImageIcon,
    RotateCcw,
    ZoomIn,
    ZoomOut
} from "lucide-react";
import Modal from "./Modal.jsx";
import SuperOfficeImageAnnotator from "./SuperOfficeImageAnnotator.jsx";
import {
    getSuperOfficeImageAttachments,
    groupSuperOfficeImageAttachmentsByDate
} from "../utils/superOfficeImport.js";

const VIEWER_MIN_ZOOM = 1;
const VIEWER_MAX_ZOOM = 5;
const VIEWER_ZOOM_STEP = 0.35;

function imageKey(image) {
    return `${image?.name || ""}|${image?.url || ""}`;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function getDefaultViewerTransform() {
    return { scale: 1, x: 0, y: 0 };
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

function SuperOfficePhotoThumb({ image, onOpen, hasFailed, onImageError }) {
    const handleClick = useCallback(() => {
        onOpen(image.galleryIndex);
    }, [image.galleryIndex, onOpen]);

    return (
        <button
            type="button"
            className="so-photo-thumb"
            onClick={handleClick}
            title={image.name}
        >
            {hasFailed ? (
                <span className="so-photo-thumb__fallback" aria-hidden="true">
                    <ImageIcon size={28} strokeWidth={1.7} />
                </span>
            ) : (
                <img
                    src={image.url}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    onError={() => onImageError(image)}
                />
            )}
            <span className="so-photo-thumb__name">{image.name}</span>
        </button>
    );
}

export default function SuperOfficePhotoGallery({ ticket, onClose }) {
    const sourceAttachments = useMemo(() => (
        ticket?.attachments?.length ? ticket.attachments : ticket?.imageAttachments || []
    ), [ticket]);
    const images = useMemo(() => getSuperOfficeImageAttachments(sourceAttachments), [sourceAttachments]);
    const groups = useMemo(() => groupSuperOfficeImageAttachmentsByDate(images), [images]);
    const [activeIndex, setActiveIndex] = useState(null);
    const [annotatorOpen, setAnnotatorOpen] = useState(false);
    const [annotationsByImage, setAnnotationsByImage] = useState({});
    const [cropsByImage, setCropsByImage] = useState({});
    const [failedImages, setFailedImages] = useState(() => new Set());
    const [viewerTransform, setViewerTransform] = useState(getDefaultViewerTransform);
    const [isViewerPanning, setIsViewerPanning] = useState(false);
    const viewerImageWrapRef = useRef(null);
    const viewerPanRef = useRef(null);
    const activeImage = activeIndex === null ? null : images[activeIndex] || null;
    const activeImageKey = activeImage ? imageKey(activeImage) : "";
    const activeAnnotations = activeImageKey ? annotationsByImage[activeImageKey] || [] : [];
    const activeCrop = activeImageKey ? cropsByImage[activeImageKey] || null : null;
    const activeImageFailed = activeImageKey ? failedImages.has(activeImageKey) : false;
    const viewerZoomPercent = Math.round(viewerTransform.scale * 100);
    const ticketSignature = `${ticket?.clientSignature || ""}|${ticket?.ticketId || ""}|${ticket?.importedAt || ""}`;

    const openImage = useCallback((index) => {
        setActiveIndex(index);
    }, []);

    const closeImage = useCallback(() => {
        setAnnotatorOpen(false);
        setActiveIndex(null);
    }, []);

    const goToPrevious = useCallback(() => {
        setAnnotatorOpen(false);
        setActiveIndex((current) => {
            if (current === null || images.length === 0) return current;
            return (current - 1 + images.length) % images.length;
        });
    }, [images.length]);

    const goToNext = useCallback(() => {
        setAnnotatorOpen(false);
        setActiveIndex((current) => {
            if (current === null || images.length === 0) return current;
            return (current + 1) % images.length;
        });
    }, [images.length]);

    const handleImageError = useCallback((image) => {
        setFailedImages((current) => {
            const next = new Set(current);
            next.add(imageKey(image));
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
        if (activeImageFailed) return;
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
    }, [activeImageFailed]);

    const handleViewerDoubleClick = useCallback((event) => {
        if (activeImageFailed) return;
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
    }, [activeImageFailed, resetViewerZoom, updateViewerZoom, viewerTransform.scale]);

    const handleViewerPointerDown = useCallback((event) => {
        if (activeImageFailed || viewerTransform.scale <= VIEWER_MIN_ZOOM || event.button !== 0) return;
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
    }, [activeImageFailed, viewerTransform]);

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
                closeImage();
            }
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                goToPrevious();
            }
            if (event.key === "ArrowRight") {
                event.preventDefault();
                goToNext();
            }
            if (event.key === "+" || event.key === "=") {
                event.preventDefault();
                zoomViewerBy(1);
            }
            if (event.key === "-") {
                event.preventDefault();
                zoomViewerBy(-1);
            }
            if (event.key === "0") {
                event.preventDefault();
                resetViewerZoom();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [activeIndex, annotatorOpen, closeImage, goToNext, goToPrevious, resetViewerZoom, zoomViewerBy]);

    useEffect(() => {
        resetViewerZoom();
    }, [activeImageKey, resetViewerZoom]);

    useEffect(() => {
        setAnnotatorOpen(false);
        setActiveIndex(null);
        setFailedImages(new Set());
        setAnnotationsByImage({});
        setCropsByImage({});
    }, [ticketSignature]);

    return (
        <Modal
            onClose={onClose}
            dialogClassName="popup-box so-photo-gallery-modal"
            ariaLabel="SuperOffice ticket photos"
            disableEscapeClose={activeIndex !== null}
        >
            <div className="popup-header so-photo-gallery-header">
                <div>
                    <p className="eyebrow">SuperOffice</p>
                    <h2>Photos du ticket{ticket?.ticketId ? ` ${ticket.ticketId}` : ""}</h2>
                </div>
                <span className="so-photo-gallery-count">{images.length} photo{images.length > 1 ? "s" : ""}</span>
            </div>

            <div className="so-photo-gallery-body">
                {groups.length > 0 ? groups.map((group) => (
                    <section key={group.dateKey} className="so-photo-date-section">
                        <div className="so-photo-date-section__head">
                            <h3>{group.label}</h3>
                            <span>{group.attachments.length}</span>
                        </div>
                        <div className="so-photo-grid">
                            {group.attachments.map((image) => (
                                <SuperOfficePhotoThumb
                                    key={imageKey(image)}
                                    image={image}
                                    hasFailed={failedImages.has(imageKey(image))}
                                    onOpen={openImage}
                                    onImageError={handleImageError}
                                />
                            ))}
                        </div>
                    </section>
                )) : (
                    <div className="so-photo-gallery-empty">
                        <ImageIcon size={34} strokeWidth={1.7} />
                        <span>Aucune photo dans le dernier ticket importé.</span>
                    </div>
                )}
            </div>

            {activeImage && (
                <div className="so-photo-viewer" role="dialog" aria-modal="true" aria-label={activeImage.name} onMouseDown={closeImage}>
                    <div className="so-photo-viewer__stage" onMouseDown={(event) => event.stopPropagation()}>
                        <div className="so-photo-viewer__meta">
                            <strong>{activeImage.name}</strong>
                            <div className="so-photo-viewer__meta-actions">
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
                                <button
                                    type="button"
                                    onClick={() => setAnnotatorOpen(true)}
                                    title="Annoter"
                                    aria-label="Annoter l'image"
                                >
                                    <Edit3 size={15} aria-hidden="true" />
                                    <span>Annoter</span>
                                </button>
                                <span>{activeIndex + 1} / {images.length}</span>
                            </div>
                        </div>
                        <div className="so-photo-viewer__image-shell">
                            <button
                                type="button"
                                className="so-photo-viewer__nav so-photo-viewer__nav--prev"
                                onClick={goToPrevious}
                                aria-label="Photo précédente"
                                title="Photo précédente"
                            >
                                <ChevronLeft size={26} aria-hidden="true" />
                            </button>
                            <div
                                ref={viewerImageWrapRef}
                                className={`so-photo-viewer__image-wrap ${viewerTransform.scale > VIEWER_MIN_ZOOM ? "is-zoomed" : ""} ${isViewerPanning ? "is-panning" : ""}`}
                                onWheel={handleViewerWheel}
                                onDoubleClick={handleViewerDoubleClick}
                                onPointerDown={handleViewerPointerDown}
                                onPointerMove={handleViewerPointerMove}
                                onPointerUp={endViewerPan}
                                onPointerCancel={endViewerPan}
                                onLostPointerCapture={endViewerPan}
                            >
                                {activeImageFailed ? (
                                    <div className="so-photo-viewer__fallback">
                                        <ImageIcon size={48} strokeWidth={1.6} />
                                        <a href={activeImage.url} target="_blank" rel="noreferrer">
                                            Ouvrir l’image
                                            <ExternalLink size={15} aria-hidden="true" />
                                        </a>
                                    </div>
                                ) : (
                                    <img
                                        src={activeImage.url}
                                        alt={activeImage.name}
                                        draggable="false"
                                        style={{
                                            transform: `translate3d(${viewerTransform.x}px, ${viewerTransform.y}px, 0) scale(${viewerTransform.scale})`
                                        }}
                                        onError={() => handleImageError(activeImage)}
                                    />
                                )}
                            </div>
                            <button
                                type="button"
                                className="so-photo-viewer__nav so-photo-viewer__nav--next"
                                onClick={goToNext}
                                aria-label="Photo suivante"
                                title="Photo suivante"
                            >
                                <ChevronRight size={26} aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                    {annotatorOpen && (
                        <SuperOfficeImageAnnotator
                            image={activeImage}
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

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Edit3,
    ExternalLink,
    Image as ImageIcon
} from "lucide-react";
import Modal from "./Modal.jsx";
import SuperOfficeImageAnnotator from "./SuperOfficeImageAnnotator.jsx";
import {
    getSuperOfficeImageAttachments,
    groupSuperOfficeImageAttachmentsByDate
} from "../utils/superOfficeImport.js";

function imageKey(image) {
    return `${image?.name || ""}|${image?.url || ""}`;
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
    const activeImage = activeIndex === null ? null : images[activeIndex] || null;
    const activeImageKey = activeImage ? imageKey(activeImage) : "";
    const activeAnnotations = activeImageKey ? annotationsByImage[activeImageKey] || [] : [];
    const activeCrop = activeImageKey ? cropsByImage[activeImageKey] || null : null;
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
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [activeIndex, annotatorOpen, closeImage, goToNext, goToPrevious]);

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
                            <div className="so-photo-viewer__image-wrap">
                                {failedImages.has(imageKey(activeImage)) ? (
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

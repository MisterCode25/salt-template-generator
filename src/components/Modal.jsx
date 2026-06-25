import { useCallback, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";

function safeFocus(element) {
    if (!element || typeof element.focus !== "function") return;
    try {
        element.focus({ preventScroll: true });
    } catch (error) {
        console.warn("Unable to restore modal focus", error);
    }
}

function getFocusableElements(container) {
    if (!container) return [];
    return Array.from(
        container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
    ).filter((el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true");
}

export default function Modal({
    onClose,
    children,
    dialogClassName = "popup-box",
    overlayClassName = "popup",
    ariaLabel,
    ariaLabelledBy,
    closeOnOverlay = true,
    disableEscapeClose = false
}) {
    const dialogRef = useRef(null);
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    const requestClose = useCallback(() => {
        onCloseRef.current?.();
    }, []);

    useLayoutEffect(() => {
        const previousActive = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const focusables = getFocusableElements(dialogRef.current);
        dialogRef.current?.scrollTo?.({ top: 0, left: 0 });
        if (focusables.length > 0) {
            safeFocus(focusables[0]);
        } else {
            safeFocus(dialogRef.current);
        }
        dialogRef.current?.scrollTo?.({ top: 0, left: 0 });

        const onKeyDown = (event) => {
            if (event.key === "Escape" && !disableEscapeClose) {
                event.preventDefault();
                requestClose();
                return;
            }

            if (event.key !== "Tab") return;
            const items = getFocusableElements(dialogRef.current);
            if (items.length === 0) {
                event.preventDefault();
                safeFocus(dialogRef.current);
                return;
            }

            const first = items[0];
            const last = items[items.length - 1];
            const active = document.activeElement;

            if (event.shiftKey && active === first) {
                event.preventDefault();
                safeFocus(last);
            } else if (!event.shiftKey && active === last) {
                event.preventDefault();
                safeFocus(first);
            }
        };

        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = previousOverflow;
            safeFocus(previousActive);
        };
    }, [disableEscapeClose, requestClose]);

    const modal = (
        <div
            className={overlayClassName}
            onMouseDown={(event) => {
                if (!closeOnOverlay) return;
                if (event.target === event.currentTarget) {
                    requestClose();
                }
            }}
        >
            <div
                ref={dialogRef}
                className={dialogClassName}
                role="dialog"
                aria-modal="true"
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
                tabIndex={-1}
                onMouseDown={(event) => event.stopPropagation()}
            >
                {children}
                <button
                    type="button"
                    className="modal-close-btn"
                    onClick={requestClose}
                    aria-label="Close dialog"
                    title="Close"
                >
                    ×
                </button>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
}

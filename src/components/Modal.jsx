import { useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";

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

    useLayoutEffect(() => {
        const previousActive = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const focusables = getFocusableElements(dialogRef.current);
        dialogRef.current?.scrollTo?.({ top: 0, left: 0 });
        if (focusables.length > 0) {
            focusables[0].focus({ preventScroll: true });
        } else {
            dialogRef.current?.focus({ preventScroll: true });
        }
        dialogRef.current?.scrollTo?.({ top: 0, left: 0 });

        const onKeyDown = (event) => {
            if (event.key === "Escape" && !disableEscapeClose) {
                event.preventDefault();
                onClose?.();
                return;
            }

            if (event.key !== "Tab") return;
            const items = getFocusableElements(dialogRef.current);
            if (items.length === 0) {
                event.preventDefault();
                dialogRef.current?.focus({ preventScroll: true });
                return;
            }

            const first = items[0];
            const last = items[items.length - 1];
            const active = document.activeElement;

            if (event.shiftKey && active === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && active === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = previousOverflow;
            if (previousActive && typeof previousActive.focus === "function") {
                previousActive.focus({ preventScroll: true });
            }
        };
    }, [onClose, disableEscapeClose]);

    const modal = (
        <div
            className={overlayClassName}
            onMouseDown={(event) => {
                if (!closeOnOverlay) return;
                if (event.target === event.currentTarget) {
                    onClose?.();
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
            </div>
        </div>
    );

    return createPortal(modal, document.body);
}

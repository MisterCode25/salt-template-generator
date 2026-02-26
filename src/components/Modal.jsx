import { useEffect, useRef } from "react";

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

    useEffect(() => {
        const previousActive = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const focusables = getFocusableElements(dialogRef.current);
        if (focusables.length > 0) {
            focusables[0].focus();
        } else {
            dialogRef.current?.focus();
        }

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
                dialogRef.current?.focus();
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
                previousActive.focus();
            }
        };
    }, [onClose, disableEscapeClose]);

    return (
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
}

import Modal from "./Modal.jsx";

export default function ConfirmDialog({ title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", variant = "default", onConfirm, onCancel }) {
    return (
        <Modal onClose={onCancel} ariaLabel={title}>
            <div className="popup-header">
                <h2>{title}</h2>
            </div>
            <div className="confirm-dialog-body">
                <p>{message}</p>
            </div>
            <div className="popup-actions">
                <button type="button" className="secondary-btn" onClick={onCancel}>{cancelLabel}</button>
                <button type="button" className={`primary-btn${variant === "danger" ? " danger-btn" : ""}`} onClick={onConfirm}>{confirmLabel}</button>
            </div>
        </Modal>
    );
}

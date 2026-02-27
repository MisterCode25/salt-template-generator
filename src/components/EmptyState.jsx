export default function EmptyState({ icon, message, action }) {
    return (
        <div className="empty-state-inline">
            {icon && <span className="empty-state-inline__icon">{icon}</span>}
            <p className="empty-state-inline__text">{message}</p>
            {action && action}
        </div>
    );
}

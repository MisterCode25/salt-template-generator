import { ChevronDown, History, Image as ImageIcon, Loader2 } from "lucide-react";
import { getClientSummaryFields } from "../utils/clientClipboard.js";

function summaryValue(clientPayload, label) {
    const field = getClientSummaryFields(clientPayload).find((candidate) => candidate.label === label);
    return field?.value && field.value !== "-" ? field.value : "";
}

function formatSavedAt(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    }).format(date);
}

function getEntryPresentation(entry) {
    const clientName = summaryValue(entry.clientPayload, "Name") || "Unnamed client";
    const contractor = summaryValue(entry.clientPayload, "Contractor");
    const ticket = entry.superOfficeTicket?.ticketId || entry.superOfficeTicket?.sourceTicketId || "";
    const mediaCount = entry.superOfficeTicket?.attachments?.filter((attachment) => (
        ["image", "video", "pdf"].includes(attachment.type)
    )).length || 0;
    return {
        clientName,
        contractor,
        ticket,
        mediaCount,
        savedAt: formatSavedAt(entry.savedAt)
    };
}

export default function RecentClientsMenu({
    entries = [],
    isOpen,
    restoringId = "",
    onToggle,
    onRestore
}) {
    return (
        <div className="dropdown recent-clients-dropdown">
            <button
                type="button"
                className="dropdown-btn recent-clients-trigger"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                onClick={onToggle}
            >
                <History size={17} aria-hidden="true" />
                <span>Recent clients</span>
                {entries.length > 0 && <span className="recent-clients-count">{entries.length}</span>}
                <ChevronDown size={16} aria-hidden="true" />
            </button>

            {isOpen && (
                <div className="dropdown-menu recent-clients-menu is-open" role="menu">
                    <div className="recent-clients-menu__header">
                        <strong>Recent clients</strong>
                        <span>Last 15</span>
                    </div>
                    {entries.length === 0 ? (
                        <div className="recent-clients-empty">No recent clients yet.</div>
                    ) : (
                        <div className="recent-clients-list">
                            {entries.map((entry) => {
                                const presentation = getEntryPresentation(entry);
                                const isRestoring = restoringId === entry.id;
                                return (
                                    <button
                                        key={entry.id}
                                        type="button"
                                        role="menuitem"
                                        className="recent-client-entry"
                                        disabled={Boolean(restoringId)}
                                        aria-label={`Restore ${presentation.clientName}. VTI ${presentation.contractor || "not available"}. Ticket ${presentation.ticket || "not available"}.`}
                                        onClick={() => onRestore(entry.id)}
                                    >
                                        <span className="recent-client-entry__main">
                                            <strong title={presentation.clientName}>{presentation.clientName}</strong>
                                            <small>
                                                {`VTI ${presentation.contractor || "—"} · Ticket ${presentation.ticket || "—"}`}
                                            </small>
                                        </span>
                                        <span className="recent-client-entry__side">
                                            {isRestoring ? (
                                                <Loader2 className="recent-client-entry__spinner" size={17} aria-label="Restoring client" />
                                            ) : (
                                                <>
                                                    <small>{presentation.savedAt}</small>
                                                    {presentation.mediaCount > 0 && (
                                                        <span className="recent-client-entry__media" title={`${presentation.mediaCount} ticket media`}>
                                                            <ImageIcon size={15} aria-hidden="true" />
                                                            {presentation.mediaCount}
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

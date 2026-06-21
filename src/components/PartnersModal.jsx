import { useEffect, useMemo, useState } from "react";
import { Copy, Mail, Phone, Search, Users } from "lucide-react";
import EmptyState from "./EmptyState.jsx";
import Modal from "./Modal.jsx";
import { PARTNER_COLUMNS } from "../data/partnersData.js";
import { copyText } from "../services/clipboardService.js";
import { loadPartners } from "../services/partnersService.js";
import { partnerMatchesQuery } from "../utils/partnerSearch.js";

function getPartnerKey(partner, index = 0) {
    return [
        partner?.["Firma Entität"] || "partner",
        partner?.["ALA-P ID"] || index
    ].join("__");
}

function splitContactEntries(value) {
    return String(value ?? "")
        .split(";")
        .map((entry) => entry.trim())
        .filter(Boolean);
}

function ContactIcon({ column }) {
    if (column === "Telefon") return <Phone size={13} strokeWidth={2} aria-hidden="true" />;
    if (column === "Email") return <Mail size={13} strokeWidth={2} aria-hidden="true" />;
    return null;
}

export default function PartnersModal({ onClose }) {
    const [query, setQuery] = useState("");
    const [selectedKey, setSelectedKey] = useState("");
    const [partners, setPartners] = useState([]);
    const [loadingPartners, setLoadingPartners] = useState(true);
    const [partnersError, setPartnersError] = useState("");

    useEffect(() => {
        let alive = true;

        async function load() {
            try {
                setLoadingPartners(true);
                setPartnersError("");
                const loaded = await loadPartners();
                if (alive) setPartners(loaded);
            } catch (error) {
                if (alive) setPartnersError(error?.message || "Error loading partners");
            } finally {
                if (alive) setLoadingPartners(false);
            }
        }

        load();
        return () => {
            alive = false;
        };
    }, []);

    const filteredPartners = useMemo(() => {
        const needle = query.trim();
        if (!needle) return partners;
        return partners.filter((partner) => partnerMatchesQuery(partner, needle));
    }, [query, partners]);

    useEffect(() => {
        if (filteredPartners.length === 0) {
            setSelectedKey("");
            return;
        }

        const selectedExists = filteredPartners.some((partner, index) => getPartnerKey(partner, index) === selectedKey);
        if (!selectedKey || !selectedExists) {
            setSelectedKey(getPartnerKey(filteredPartners[0], 0));
        }
    }, [filteredPartners, selectedKey]);

    const selectedPartner = useMemo(() => (
        filteredPartners.find((partner, index) => getPartnerKey(partner, index) === selectedKey) || null
    ), [filteredPartners, selectedKey]);

    const copyPartnerField = async (value, label) => {
        const text = String(value ?? "").trim();
        if (!text) return;
        await copyText(text, { message: `${label} copied`, variant: "success" });
    };

    const renderValue = (column, value) => {
        const text = String(value ?? "").trim();
        if (!text) return <span className="partners-detail-value-text">-</span>;

        const isCopyField = column === "Telefon" || column === "Email";
        if (!isCopyField) return <span className="partners-detail-value-text">{text}</span>;

        return (
            <div className="partners-detail-stack">
                {splitContactEntries(text).map((entry, index) => (
                    <div key={`${entry}_${index}`} className="partners-detail-contact-line">
                        <ContactIcon column={column} />
                        <span className="partners-detail-value-text">{entry}</span>
                        <button
                            type="button"
                            className="partners-copy-btn"
                            onClick={() => copyPartnerField(entry, column)}
                            title={`Copy ${column}`}
                            aria-label={`Copy ${column}: ${entry}`}
                        >
                            <Copy size={13} strokeWidth={2} aria-hidden="true" />
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <Modal onClose={onClose} dialogClassName="popup-box partners-modal" ariaLabel="Partners">
            <div className="popup-header partners-header">
                <div className="partners-title">
                    <span className="partners-title-icon" aria-hidden="true">
                        <Users size={18} strokeWidth={2} />
                    </span>
                    <div>
                        <h2>Partners</h2>
                        <p className="partners-subtitle">Contacts by partner, topic and availability.</p>
                    </div>
                </div>
            </div>

            <label className="partners-search" aria-label="Search partners">
                <Search size={15} strokeWidth={2} aria-hidden="true" />
                <input
                    type="text"
                    placeholder="Search partner, topic, role, email or phone"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />
            </label>

            <div className="partners-layout">
                <aside className="partners-list-panel" aria-label="Partner results">
                    <div className="partners-list-count">
                        {loadingPartners ? "Loading partners..." : `${filteredPartners.length} result${filteredPartners.length === 1 ? "" : "s"}`}
                    </div>
                    <div className="partners-list">
                        {filteredPartners.map((partner, index) => {
                            const key = getPartnerKey(partner, index);
                            const active = key === selectedKey;
                            return (
                                <button
                                    key={`${key}_${index}`}
                                    type="button"
                                    className={`partners-list-item${active ? " is-active" : ""}`}
                                    onClick={() => setSelectedKey(key)}
                                >
                                    <strong>{partner["Firma Entität"] || "No name"}</strong>
                                    <span>{partner["Thema"] || "-"}</span>
                                    <small>{partner["Unit/Rolle"] || partner["ALA-P ID"] || "-"}</small>
                                </button>
                            );
                        })}
                        {!loadingPartners && !partnersError && filteredPartners.length === 0 && (
                            <EmptyState message="No partner found." />
                        )}
                        {partnersError && <p className="hint">{partnersError}</p>}
                    </div>
                </aside>

                <section className="partners-detail-panel" aria-label="Partner detail">
                    {selectedPartner ? (
                        <div className="partners-detail-card">
                            <h3>{selectedPartner["Firma Entität"] || "Partner"}</h3>
                            <div className="partners-detail-grid">
                                {PARTNER_COLUMNS.map((column) => (
                                    <div key={column} className="partners-detail-row">
                                        <div className="partners-detail-label">{column}</div>
                                        <div className="partners-detail-value">
                                            {renderValue(column, selectedPartner[column])}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <EmptyState message={loadingPartners ? "Loading partner details." : "Select a partner to see their information."} />
                    )}
                </section>
            </div>
        </Modal>
    );
}

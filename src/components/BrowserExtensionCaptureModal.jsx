import { useEffect, useRef, useState } from "react";
import {
    AlertTriangle,
    CheckCircle2,
    Download,
    Loader2,
    Puzzle,
    RefreshCw
} from "lucide-react";
import { BROWSER_EXTENSION_PHASE } from "../../shared/browserExtensionProtocol.js";
import { normalizeSuperOfficeTicketNumber } from "../../shared/superOfficeTicketNavigation.js";
import Modal from "./Modal.jsx";

const COMPLETED_AUTO_CLOSE_DELAY_MS = 1000;

function getVisual(state) {
    if (state.error) {
        return {
            mode: "error",
            Icon: AlertTriangle,
            title: state.installed === false ? "Extension non détectée" : "Capture interrompue"
        };
    }
    if (state.phase === BROWSER_EXTENSION_PHASE.COMPLETED) {
        return { mode: "done", Icon: CheckCircle2, title: "Import terminé" };
    }
    if (state.isRunning || state.isChecking) {
        return { mode: "scanning", Icon: Loader2, title: "Capture automatique en cours" };
    }
    return { mode: "ready", Icon: Puzzle, title: "Extension de capture" };
}

export default function BrowserExtensionCaptureModal({ state, onStart, onClose }) {
    const [ticketNumber, setTicketNumber] = useState("");
    const [ticketInputError, setTicketInputError] = useState("");
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    useEffect(() => {
        if (state.phase !== BROWSER_EXTENSION_PHASE.COMPLETED) {
            return undefined;
        }

        const timeoutId = window.setTimeout(() => onCloseRef.current(), COMPLETED_AUTO_CLOSE_DELAY_MS);
        return () => window.clearTimeout(timeoutId);
    }, [state.phase]);

    const visual = getVisual(state);
    const VisualIcon = visual.Icon;
    const isBusy = state.isRunning || state.isChecking;
    const isCompleted = state.phase === BROWSER_EXTENSION_PHASE.COMPLETED;
    const timelineProgressClass = state.vtiStatus === "done"
        ? "is-complete"
        : state.superOfficeStatus === "done"
            ? "is-half"
            : "is-start";
    const downloadUrl = `${import.meta.env.BASE_URL}downloads/salt-bo-capture-beta.zip`;
    const submitTicket = (event) => {
        event.preventDefault();
        if (isBusy) return;

        const normalizedTicketNumber = normalizeSuperOfficeTicketNumber(ticketNumber);
        if (!normalizedTicketNumber) {
            setTicketInputError("Saisis uniquement le numéro du ticket SuperOffice.");
            return;
        }

        setTicketNumber(normalizedTicketNumber);
        setTicketInputError("");
        onStart(normalizedTicketNumber);
    };

    return (
        <Modal
            onClose={onClose}
            closeOnOverlay={!isBusy}
            disableEscapeClose={isBusy}
            showCloseButton={!isBusy}
            dialogClassName="popup-box capture-data-modal browser-extension-capture-modal"
            ariaLabel="Capture automatique avec l’extension"
        >
            <div className="capture-data-header">
                <div className="capture-data-orb browser-extension-capture-orb" aria-hidden="true">
                    <Puzzle size={22} />
                </div>
                <div>
                    <p className="eyebrow">Bêta</p>
                    <h2>Capture par extension</h2>
                    <p>Charge le ticket demandé dans l’onglet SuperOffice ouvert, puis capture SO et VTI.</p>
                </div>
            </div>

            {!isCompleted && (
                <form className="browser-extension-ticket-form" onSubmit={submitTicket}>
                    <label htmlFor="browser-extension-ticket-number">Numéro du ticket SuperOffice</label>
                    <div className="browser-extension-ticket-row">
                        <input
                            id="browser-extension-ticket-number"
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            autoFocus
                            value={ticketNumber}
                            onChange={(event) => {
                                setTicketNumber(event.target.value);
                                if (ticketInputError) setTicketInputError("");
                            }}
                            placeholder="28958607"
                            disabled={isBusy}
                            aria-invalid={Boolean(ticketInputError)}
                            aria-describedby={ticketInputError ? "browser-extension-ticket-error" : undefined}
                        />
                        <button type="submit" className="primary-btn" disabled={isBusy}>
                            {state.error && <RefreshCw size={15} aria-hidden="true" />}
                            {state.error ? "Réessayer" : "Charger et capturer"}
                        </button>
                    </div>
                    {ticketInputError && (
                        <small id="browser-extension-ticket-error" className="browser-extension-ticket-error">
                            {ticketInputError}
                        </small>
                    )}
                </form>
            )}

            <div className={`browser-extension-capture-focus is-${visual.mode}`} aria-live="polite">
                <VisualIcon
                    size={30}
                    aria-hidden="true"
                    className={isBusy ? "capture-data-spinner" : undefined}
                />
                <div>
                    <strong>{visual.title}</strong>
                    <span>{state.error || state.message}</span>
                </div>
            </div>

            <div className={`capture-data-timeline ${timelineProgressClass}`} aria-label="Progression de la capture">
                <div className="capture-data-timeline-line" aria-hidden="true"><span /></div>
                <div className={`capture-data-timeline-step is-${state.superOfficeStatus}`}>
                    <span className="capture-data-timeline-dot" aria-hidden="true" />
                    <strong>SuperOffice</strong>
                    <small>Ticket demandé</small>
                </div>
                <div className={`capture-data-timeline-step is-${state.vtiStatus}`}>
                    <span className="capture-data-timeline-dot" aria-hidden="true" />
                    <strong>VTI</strong>
                    <small>Client déjà ouvert</small>
                </div>
            </div>

            <div className="browser-extension-capture-note">
                Exactement un onglet SuperOffice et un onglet VTI doivent être ouverts. L’onglet SuperOffice
                est réutilisé en arrière-plan ; l’onglet VTI doit déjà afficher le bon client.
            </div>

            <div className="popup-actions capture-data-actions">
                <a className="secondary-btn browser-extension-download-btn" href={downloadUrl} download>
                    <Download size={15} aria-hidden="true" />
                    Télécharger l’extension
                </a>
                {!isBusy && (
                    <button type="button" className="secondary-btn" onClick={onClose}>Fermer</button>
                )}
            </div>
        </Modal>
    );
}

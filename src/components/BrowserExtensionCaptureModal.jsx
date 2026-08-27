import { useEffect, useRef, useState } from "react";
import {
    AlertTriangle,
    CheckCircle2,
    Database,
    Download,
    FileText,
    Puzzle,
    RefreshCw,
    Search
} from "lucide-react";
import { BROWSER_EXTENSION_PHASE } from "../../shared/browserExtensionProtocol.js";
import { normalizeSuperOfficeTicketNumber } from "../../shared/superOfficeTicketNavigation.js";
import { normalizeContractorNumber } from "../../shared/vtiContractorNavigation.js";
import { getBrowserExtensionJourneyActiveStep } from "../utils/browserExtensionCaptureState.js";
import Modal from "./Modal.jsx";

const COMPLETED_AUTO_CLOSE_DELAY_MS = 1000;
const CAPTURE_JOURNEY_STEPS = Object.freeze([
    { id: "super-office", label: "SO", detail: "Ticket", Icon: FileText },
    { id: "vti", label: "VTI", detail: "Client", Icon: Search },
    { id: "application", label: "App", detail: "Import", Icon: Database }
]);

function BrowserExtensionCaptureJourney({ phase, ticketNumber }) {
    const activeStep = getBrowserExtensionJourneyActiveStep(phase);

    return (
        <div className={`browser-extension-capture-journey is-stage-${activeStep}`} aria-hidden="true">
            <div className="browser-extension-journey-track">
                <span className="browser-extension-journey-fill" />
                <span className="browser-extension-journey-packet is-first" />
                <span className="browser-extension-journey-packet is-second" />
                <span className="browser-extension-journey-packet is-third" />
            </div>
            <div className="browser-extension-journey-steps">
                {CAPTURE_JOURNEY_STEPS.map((step, index) => {
                    const status = index < activeStep ? "done" : index === activeStep ? "active" : "waiting";
                    const StepIcon = step.Icon;
                    return (
                        <div key={step.id} className={`browser-extension-journey-step is-${status}`}>
                            <span className="browser-extension-journey-node">
                                <StepIcon size={18} strokeWidth={2.2} />
                            </span>
                            <strong>{step.label}</strong>
                            <small>{step.detail}</small>
                        </div>
                    );
                })}
            </div>
            {ticketNumber && (
                <span className="browser-extension-journey-ticket">Ticket {ticketNumber}</span>
            )}
        </div>
    );
}

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
    if (state.requiresContractorInput) {
        return { mode: "warning", Icon: AlertTriangle, title: "Contractor introuvable" };
    }
    if (state.isRunning || state.isChecking) {
        return { mode: "scanning", Icon: Puzzle, title: "Capture automatique en cours" };
    }
    return { mode: "ready", Icon: Puzzle, title: "Extension de capture" };
}

export default function BrowserExtensionCaptureModal({ state, onStart, onClose }) {
    const [ticketNumber, setTicketNumber] = useState("");
    const [ticketInputError, setTicketInputError] = useState("");
    const [manualContractorNumber, setManualContractorNumber] = useState("");
    const [manualContractorError, setManualContractorError] = useState("");
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
    const requiresContractorInput = state.requiresContractorInput;
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
    const submitManualContractor = (event) => {
        event.preventDefault();
        const requestedTicketNumber = normalizeSuperOfficeTicketNumber(
            state.ticketNumber || ticketNumber
        );
        const normalizedContractorNumber = normalizeContractorNumber(manualContractorNumber);
        if (!normalizedContractorNumber) {
            setManualContractorError("Saisis uniquement le numéro du contractor.");
            return;
        }
        if (!requestedTicketNumber || isBusy) return;

        setManualContractorNumber(normalizedContractorNumber);
        setManualContractorError("");
        onStart(requestedTicketNumber, { manualContractorNumber: normalizedContractorNumber });
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

            {!isCompleted && !requiresContractorInput && (
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

            <div
                className={`browser-extension-capture-focus is-${visual.mode}${isBusy ? " has-journey" : ""}`}
                aria-live="polite"
            >
                {isBusy ? (
                    <BrowserExtensionCaptureJourney
                        phase={state.phase}
                        ticketNumber={state.ticketNumber || ticketNumber}
                    />
                ) : (
                    <VisualIcon size={30} aria-hidden="true" />
                )}
                <div className="browser-extension-capture-copy">
                    <strong>{visual.title}</strong>
                    <span>{state.error || state.message}</span>
                </div>
            </div>

            {requiresContractorInput && (
                <form className="browser-extension-contractor-input" onSubmit={submitManualContractor}>
                    <strong>Aucune action n’a été effectuée dans VTI.</strong>
                    <span>
                        Indique le contractor à rechercher. L’extension ouvrira sa fiche VTI uniquement après
                        ta validation.
                    </span>
                    <label htmlFor="browser-extension-contractor-number">Numéro du contractor</label>
                    <div className="browser-extension-ticket-row">
                        <input
                            id="browser-extension-contractor-number"
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            autoFocus
                            value={manualContractorNumber}
                            onChange={(event) => {
                                setManualContractorNumber(event.target.value);
                                if (manualContractorError) setManualContractorError("");
                            }}
                            placeholder="31486331"
                            aria-invalid={Boolean(manualContractorError)}
                            aria-describedby={manualContractorError
                                ? "browser-extension-contractor-error"
                                : undefined}
                        />
                        <button type="submit" className="primary-btn">Rechercher dans VTI</button>
                    </div>
                    {manualContractorError && (
                        <small id="browser-extension-contractor-error" className="browser-extension-ticket-error">
                            {manualContractorError}
                        </small>
                    )}
                </form>
            )}

            {!isBusy && (
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
                        <small>Recherche et capture</small>
                    </div>
                </div>
            )}

            <div className="browser-extension-capture-note">
                Exactement un onglet SuperOffice et un onglet VTI doivent être ouverts. Les deux onglets sont
                réutilisés en arrière-plan ; VTI recherche automatiquement le contractor trouvé dans le ticket.
            </div>

            <div className="popup-actions capture-data-actions">
                <a className="secondary-btn browser-extension-download-btn" href={downloadUrl} download>
                    <Download size={15} aria-hidden="true" />
                    Télécharger l’extension
                </a>
                {requiresContractorInput && (
                    <button type="button" className="secondary-btn" onClick={onClose}>
                        Annuler la capture
                    </button>
                )}
                {!isBusy && !requiresContractorInput && (
                    <button type="button" className="secondary-btn" onClick={onClose}>Fermer</button>
                )}
            </div>
        </Modal>
    );
}

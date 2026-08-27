import {
    AlertTriangle,
    CheckCircle2,
    Download,
    Loader2,
    Puzzle,
    RefreshCw
} from "lucide-react";
import { BROWSER_EXTENSION_PHASE } from "../../shared/browserExtensionProtocol.js";
import Modal from "./Modal.jsx";

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

export default function BrowserExtensionCaptureModal({ state, onRetry, onClose }) {
    const visual = getVisual(state);
    const VisualIcon = visual.Icon;
    const isBusy = state.isRunning || state.isChecking;
    const timelineProgressClass = state.vtiStatus === "done"
        ? "is-complete"
        : state.superOfficeStatus === "done"
            ? "is-half"
            : "is-start";
    const downloadUrl = `${import.meta.env.BASE_URL}downloads/salt-bo-capture-beta.zip`;

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
                    <p>Utilise les onglets SuperOffice et VTI déjà ouverts, sans navigation automatique.</p>
                </div>
            </div>

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
                    <small>Ticket déjà ouvert</small>
                </div>
                <div className={`capture-data-timeline-step is-${state.vtiStatus}`}>
                    <span className="capture-data-timeline-dot" aria-hidden="true" />
                    <strong>VTI</strong>
                    <small>Client déjà ouvert</small>
                </div>
            </div>

            <div className="browser-extension-capture-note">
                Exactement un onglet SuperOffice et un onglet VTI doivent être ouverts. En cas de doute,
                l’extension s’arrête sans choisir un onglet au hasard.
            </div>

            <div className="popup-actions capture-data-actions">
                <a className="secondary-btn browser-extension-download-btn" href={downloadUrl} download>
                    <Download size={15} aria-hidden="true" />
                    Télécharger l’extension
                </a>
                {state.error && (
                    <button type="button" className="primary-btn" onClick={onRetry}>
                        <RefreshCw size={15} aria-hidden="true" />
                        Réessayer
                    </button>
                )}
                {!isBusy && (
                    <button type="button" className="secondary-btn" onClick={onClose}>Fermer</button>
                )}
            </div>
        </Modal>
    );
}

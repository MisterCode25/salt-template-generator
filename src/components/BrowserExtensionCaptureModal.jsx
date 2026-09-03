import { useEffect, useRef, useState } from "react";
import {
    AlertTriangle,
    CheckCircle2,
    Download,
    Info,
    Puzzle,
    RefreshCw
} from "lucide-react";
import { BROWSER_EXTENSION_PHASE } from "../../shared/browserExtensionProtocol.js";
import { normalizeSuperOfficeTicketNumber } from "../../shared/superOfficeTicketNavigation.js";
import { normalizeContractorNumber } from "../../shared/vtiContractorNavigation.js";
import { getBrowserExtensionJourneyActiveStep } from "../utils/browserExtensionCaptureState.js";
import Modal from "./Modal.jsx";

const COMPLETED_AUTO_CLOSE_DELAY_MS = 1000;
const CAPTURE_JOURNEY_STEPS = Object.freeze([
    {
        id: "super-office",
        label: "SO",
        path: "M 28 110 A 92 92 0 0 1 68.6 33.7"
    },
    {
        id: "vti",
        label: "VTI",
        path: "M 76.8 28.8 A 92 92 0 0 1 163.2 28.8"
    },
    {
        id: "application",
        label: "APP",
        path: "M 171.4 33.7 A 92 92 0 0 1 212 110"
    }
]);

function getJourneyStepStatus(index, activeStep, mode) {
    if (mode === "done" || index < activeStep) return "done";
    if (index > activeStep) return "waiting";
    if (["error", "warning"].includes(mode)) return mode;
    return "active";
}

function BrowserExtensionCaptureJourney({ state, mode }) {
    const activeStep = getBrowserExtensionJourneyActiveStep(state.phase, state);
    const JourneyIcon = mode === "done"
        ? CheckCircle2
        : ["error", "warning"].includes(mode)
            ? AlertTriangle
            : Puzzle;

    return (
        <div
            className={`browser-extension-capture-journey is-stage-${activeStep} is-${mode}`}
            aria-hidden="true"
        >
            <div className="browser-extension-capture-arc-shell">
                <svg
                    className="browser-extension-capture-arc"
                    viewBox="0 0 240 120"
                    focusable="false"
                >
                    {CAPTURE_JOURNEY_STEPS.map((step, index) => {
                        const status = getJourneyStepStatus(index, activeStep, mode);
                        return (
                            <g key={step.id} className={`browser-extension-arc-step is-${step.id} is-${status}`}>
                                <path className="browser-extension-arc-track" d={step.path} pathLength="100" />
                                <path className="browser-extension-arc-value" d={step.path} pathLength="100" />
                                {status === "active" && (
                                    <path className="browser-extension-arc-shimmer" d={step.path} pathLength="100" />
                                )}
                            </g>
                        );
                    })}
                </svg>
                <span className="browser-extension-capture-arc-icon">
                    <JourneyIcon size={25} strokeWidth={2.2} />
                </span>
            </div>
            <div className="browser-extension-arc-stages">
                {CAPTURE_JOURNEY_STEPS.map((step, index) => {
                    const status = getJourneyStepStatus(index, activeStep, mode);
                    return (
                        <span key={step.id} className={`browser-extension-arc-stage is-${status}`}>
                            <span className="browser-extension-arc-stage-dot" />
                            <span>{step.label}</span>
                        </span>
                    );
                })}
            </div>
        </div>
    );
}

function getVisual(state) {
    if (state.error) {
        return {
            mode: "error",
            title: state.installed === false ? "Extension not detected" : "Capture interrupted"
        };
    }
    if (state.phase === BROWSER_EXTENSION_PHASE.COMPLETED) {
        return { mode: "done", title: "Import complete" };
    }
    if (state.requiresContractorInput) {
        return { mode: "warning", title: "Contractor not found" };
    }
    if (state.isRunning || state.isChecking) {
        return { mode: "scanning", title: "Automatic capture in progress" };
    }
    return { mode: "ready", title: "Capture extension" };
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
    const isBusy = state.isRunning || state.isChecking;
    const isCompleted = state.phase === BROWSER_EXTENSION_PHASE.COMPLETED;
    const requiresContractorInput = state.requiresContractorInput;
    const currentTicketNumber = state.ticketNumber || ticketNumber;
    const shouldShowProgress = isBusy || isCompleted || requiresContractorInput || Boolean(state.error);
    const downloadUrl = `${import.meta.env.BASE_URL}downloads/salt-bo-capture-beta.zip`;
    const submitTicket = (event) => {
        event.preventDefault();
        if (isBusy) return;

        const normalizedTicketNumber = normalizeSuperOfficeTicketNumber(ticketNumber);
        if (!normalizedTicketNumber) {
            setTicketInputError("Enter only the SuperOffice ticket number.");
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
            setManualContractorError("Enter only the contractor number.");
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
            showCloseButton={!isBusy && !isCompleted}
            dialogClassName={`popup-box capture-data-modal browser-extension-capture-modal is-${visual.mode}`}
            ariaLabel="Automatic capture with the extension"
        >
            <div className="browser-extension-capture-header">
                <div className="browser-extension-capture-heading">
                    <div className="browser-extension-capture-orb" aria-hidden="true">
                        <Puzzle size={18} />
                    </div>
                    <div>
                        <p className="eyebrow">Beta</p>
                        <h2>Automatic capture</h2>
                    </div>
                </div>
                {currentTicketNumber && (
                    <span className="browser-extension-capture-ticket">Ticket {currentTicketNumber}</span>
                )}
            </div>

            {!isBusy && !isCompleted && !requiresContractorInput && !state.error && (
                <p className="browser-extension-capture-intro">
                    Enter the SuperOffice ticket. The extension will then capture the SO and VTI data.
                </p>
            )}

            {!isBusy && !isCompleted && !requiresContractorInput && (
                <form className="browser-extension-ticket-form" onSubmit={submitTicket}>
                    <label htmlFor="browser-extension-ticket-number">SuperOffice ticket number</label>
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
                            {state.error ? "Retry" : "Capture"}
                        </button>
                    </div>
                    {ticketInputError && (
                        <small id="browser-extension-ticket-error" className="browser-extension-ticket-error">
                            {ticketInputError}
                        </small>
                    )}
                </form>
            )}

            {shouldShowProgress && (
                <div
                    className={`browser-extension-capture-progress is-${visual.mode}`}
                    aria-live="polite"
                >
                    <BrowserExtensionCaptureJourney
                        state={state}
                        mode={visual.mode}
                    />
                    <div className="browser-extension-capture-copy">
                        <strong>{visual.title}</strong>
                        {visual.mode !== "scanning" && <span>{state.error || state.message}</span>}
                    </div>
                </div>
            )}

            {requiresContractorInput && (
                <form className="browser-extension-contractor-input" onSubmit={submitManualContractor}>
                    <strong>No action was performed in VTI.</strong>
                    <span>
                        Enter the contractor to search for. The extension will open its VTI record only after
                        you confirm it.
                    </span>
                    <label htmlFor="browser-extension-contractor-number">Contractor number</label>
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
                        <button type="submit" className="primary-btn">Search VTI</button>
                    </div>
                    {manualContractorError && (
                        <small id="browser-extension-contractor-error" className="browser-extension-ticket-error">
                            {manualContractorError}
                        </small>
                    )}
                </form>
            )}

            {!isBusy && !isCompleted && !requiresContractorInput && (
                <div className="browser-extension-capture-note">
                    <Info size={14} aria-hidden="true" />
                    <span>The first matching SuperOffice and VTI tabs will be used.</span>
                </div>
            )}

            {!isBusy && !isCompleted && (
                <div className={`browser-extension-capture-footer${requiresContractorInput ? " is-cancel-only" : ""}`}>
                    {!requiresContractorInput && (
                        <a className="browser-extension-download-link" href={downloadUrl} download>
                            <Download size={14} aria-hidden="true" />
                            Download extension
                        </a>
                    )}
                    {requiresContractorInput && (
                        <button type="button" className="secondary-btn" onClick={onClose}>
                            Cancel capture
                        </button>
                    )}
                </div>
            )}
        </Modal>
    );
}

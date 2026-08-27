import {
    BROWSER_EXTENSION_MESSAGE,
    BROWSER_EXTENSION_PHASE
} from "../../shared/browserExtensionProtocol.js";

export const BROWSER_EXTENSION_CAPTURE_ACTION = Object.freeze({
    RESET: "BROWSER_EXTENSION_CAPTURE_RESET",
    CHECKING: "BROWSER_EXTENSION_CAPTURE_CHECKING",
    STARTING: "BROWSER_EXTENSION_CAPTURE_STARTING",
    IMPORTING: "BROWSER_EXTENSION_CAPTURE_IMPORTING",
    SUCCEEDED: "BROWSER_EXTENSION_CAPTURE_SUCCEEDED",
    LOCAL_FAILURE: "BROWSER_EXTENSION_CAPTURE_LOCAL_FAILURE"
});

export function createBrowserExtensionCaptureState() {
    return {
        installed: null,
        version: "",
        requestId: "",
        isChecking: false,
        isRunning: false,
        requiresContractorInput: false,
        ticketNumber: "",
        phase: null,
        superOfficeStatus: "waiting",
        vtiStatus: "waiting",
        message: "Saisis le numéro du ticket SuperOffice à charger.",
        error: ""
    };
}

function isCurrentRequest(state, event) {
    return !state.requestId || state.requestId === event.requestId;
}

export function reduceBrowserExtensionCaptureState(state, event) {
    switch (event?.type) {
        case BROWSER_EXTENSION_CAPTURE_ACTION.RESET:
            return createBrowserExtensionCaptureState();
        case BROWSER_EXTENSION_CAPTURE_ACTION.CHECKING:
            return {
                ...createBrowserExtensionCaptureState(),
                isChecking: true,
                message: "Vérification de l’extension…"
            };
        case BROWSER_EXTENSION_CAPTURE_ACTION.STARTING:
            return {
                ...createBrowserExtensionCaptureState(),
                installed: true,
                requestId: event.requestId,
                ticketNumber: event.ticketNumber || "",
                isRunning: true,
                phase: BROWSER_EXTENSION_PHASE.LOCATING_TABS,
                message: "Connexion à l’extension…"
            };
        case BROWSER_EXTENSION_MESSAGE.CONTRACTOR_INPUT_REQUIRED:
            if (!isCurrentRequest(state, event)) return state;
            return {
                ...state,
                isChecking: false,
                isRunning: false,
                requiresContractorInput: true,
                ticketNumber: event.ticketNumber || state.ticketNumber,
                phase: BROWSER_EXTENSION_PHASE.AWAITING_CONTRACTOR_INPUT,
                superOfficeStatus: "done",
                vtiStatus: "waiting",
                message: event.message || "Aucun contractor n’a été trouvé. Saisis-le pour continuer ; l’onglet VTI n’a pas été modifié.",
                error: ""
            };
        case BROWSER_EXTENSION_CAPTURE_ACTION.IMPORTING:
            if (!isCurrentRequest(state, event)) return state;
            return {
                ...state,
                isRunning: true,
                requiresContractorInput: false,
                phase: BROWSER_EXTENSION_PHASE.IMPORTING,
                superOfficeStatus: "done",
                vtiStatus: "done",
                message: "Import des données dans l’application…",
                error: ""
            };
        case BROWSER_EXTENSION_CAPTURE_ACTION.SUCCEEDED:
            if (!isCurrentRequest(state, event)) return state;
            return {
                ...state,
                isRunning: false,
                requiresContractorInput: false,
                phase: BROWSER_EXTENSION_PHASE.COMPLETED,
                superOfficeStatus: "done",
                vtiStatus: "done",
                message: event.message || "Données SuperOffice et VTI importées.",
                error: ""
            };
        case BROWSER_EXTENSION_CAPTURE_ACTION.LOCAL_FAILURE:
            if (!isCurrentRequest(state, event)) return state;
            return {
                ...state,
                installed: event.installed ?? state.installed,
                isChecking: false,
                isRunning: false,
                requiresContractorInput: false,
                phase: BROWSER_EXTENSION_PHASE.FAILED,
                message: "Capture automatique interrompue.",
                error: event.error || "Capture impossible."
            };
        case BROWSER_EXTENSION_MESSAGE.READY:
        case BROWSER_EXTENSION_MESSAGE.STATUS:
            return {
                ...state,
                installed: true,
                version: event.version || state.version,
                isChecking: false,
                message: state.isRunning || state.requiresContractorInput
                    ? state.message
                    : "Extension détectée."
            };
        case BROWSER_EXTENSION_MESSAGE.ACCEPTED:
            if (!isCurrentRequest(state, event)) return state;
            return {
                ...state,
                installed: true,
                version: event.version || state.version,
                isChecking: false,
                isRunning: true,
                requiresContractorInput: false,
                error: ""
            };
        case BROWSER_EXTENSION_MESSAGE.PROGRESS:
            if (!isCurrentRequest(state, event)) return state;
            return {
                ...state,
                isChecking: false,
                isRunning: true,
                requiresContractorInput: false,
                phase: event.phase || state.phase,
                superOfficeStatus: event.superOfficeStatus || state.superOfficeStatus,
                vtiStatus: event.vtiStatus || state.vtiStatus,
                message: event.message || state.message,
                error: ""
            };
        case BROWSER_EXTENSION_MESSAGE.COMPLETED:
            if (!isCurrentRequest(state, event)) return state;
            return {
                ...state,
                isChecking: false,
                isRunning: true,
                requiresContractorInput: false,
                superOfficeStatus: "done",
                vtiStatus: "done",
                message: event.message || "Captures terminées."
            };
        case BROWSER_EXTENSION_MESSAGE.FAILED:
            if (!isCurrentRequest(state, event)) return state;
            return {
                ...state,
                isChecking: false,
                isRunning: false,
                requiresContractorInput: false,
                phase: BROWSER_EXTENSION_PHASE.FAILED,
                message: "Capture automatique interrompue.",
                error: event.error || "Capture impossible."
            };
        default:
            return state;
    }
}

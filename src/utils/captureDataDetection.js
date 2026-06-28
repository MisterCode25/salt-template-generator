import { parseClientClipboardJSON } from "./clientClipboard.js";
import { parseSuperOfficeInfoPayload } from "./superOfficeImport.js";

export const CAPTURE_DATA_TYPE = Object.freeze({
    CLIENT: "client",
    SUPER_OFFICE: "superOffice",
    UNKNOWN: "unknown"
});

export function classifyCaptureClipboardText(text) {
    const raw = String(text ?? "").trim();
    if (!raw) {
        return {
            type: CAPTURE_DATA_TYPE.UNKNOWN,
            error: "Clipboard is empty."
        };
    }

    const superOfficeResult = parseSuperOfficeInfoPayload(raw);
    if (superOfficeResult.ok) {
        return {
            type: CAPTURE_DATA_TYPE.SUPER_OFFICE,
            result: superOfficeResult
        };
    }

    try {
        return {
            type: CAPTURE_DATA_TYPE.CLIENT,
            payload: parseClientClipboardJSON(raw)
        };
    } catch (clientError) {
        return {
            type: CAPTURE_DATA_TYPE.UNKNOWN,
            error: clientError?.message || "Clipboard does not contain supported capture data.",
            superOfficeError: superOfficeResult.error || ""
        };
    }
}

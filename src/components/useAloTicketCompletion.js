import { useEffect } from "react";
import { BROWSER_EXTENSION_MESSAGE } from "../../shared/browserExtensionProtocol.js";
import { ACTIVE_CLIENT_PAYLOAD_UPDATED_EVENT, CLIENT_INPUT_VALUES_UPDATED_EVENT } from "../services/activeClientService.js";
import { SUPER_OFFICE_TICKET_UPDATED_EVENT } from "../services/superOfficeTicketService.js";
import { completeAloTicket, loadPendingAloTicketCompletions } from "../services/aloTicketCompletionService.js";
import { acknowledgeAloResult, requestPendingAloResults, subscribeToBrowserExtensionEvents } from "../services/browserExtensionCaptureService.js";
import { showToast } from "../services/clipboardService.js";

export function useAloTicketCompletion() {
    useEffect(() => {
        let disposed = false;
        let replaying = false;
        const waitingNotices = new Set();
        const receive = async (message) => {
            try {
                const completion = await completeAloTicket(message.requestId, message.result, message.capturedAt);
                if (disposed) return;
                if (["completed", "ignored"].includes(completion.status)) acknowledgeAloResult(message.requestId);
                if (completion.status === "completed") showToast(`ALO ${completion.incidentId}: External ID saved`, "success");
                if (completion.status === "waiting" && !waitingNotices.has(message.requestId)) {
                    waitingNotices.add(message.requestId);
                    showToast(`ALO ${completion.incidentId} received. Reopen its original case to save the External ID.`, "warning");
                }
            } catch (error) {
                if (!disposed) showToast(error.message || "Could not save the ALO result. Return to the app to retry.", "error");
            }
        };
        const replay = async () => {
            if (replaying || disposed) return;
            replaying = true;
            try {
                const pending = await loadPendingAloTicketCompletions();
                if (disposed) return;
                for (const record of pending.filter((entry) => entry.result)) await receive(record);
                if (pending.length) requestPendingAloResults(pending.map((record) => record.requestId));
            } finally { replaying = false; }
        };
        const retry = () => replay().catch((error) => {
            if (!disposed) showToast(error.message || "Could not reload pending ALO results.", "error");
        });
        const unsubscribe = subscribeToBrowserExtensionEvents((message) => {
            if (message.type === BROWSER_EXTENSION_MESSAGE.ALO_TICKET_CREATED) receive(message);
            if (message.type === BROWSER_EXTENSION_MESSAGE.READY) retry();
        });
        const events = ["focus", "pageshow", ACTIVE_CLIENT_PAYLOAD_UPDATED_EVENT, CLIENT_INPUT_VALUES_UPDATED_EVENT, SUPER_OFFICE_TICKET_UPDATED_EVENT];
        events.forEach((event) => window.addEventListener(event, retry));
        retry();
        return () => {
            disposed = true;
            unsubscribe();
            events.forEach((event) => window.removeEventListener(event, retry));
        };
    }, []);
}

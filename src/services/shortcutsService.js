import superOfficeBookmarklet from "../data/superOfficeBookmarklet.txt?raw";
import vtiHealthcheckBookmarklet from "../data/vtiHealthcheckBookmarklet.txt?raw";
import { buildAloAutofillBookmarklet } from "../utils/aloAutofill.js";

export const DATA_SHORTCUTS = Object.freeze([
    {
        id: "vti",
        eyebrow: "VTI customer data",
        title: "Capture VTI data",
        buttonLabel: "Capture VTI data",
        bookmarklet: vtiHealthcheckBookmarklet.trim(),
        description: "Extracts Billing, Contact Details and Healthcheck data, then copies the customer JSON used by Salt Templater.",
        steps: [
            "Open the customer in VTI on Billing Account information.",
            "Click the saved bookmarklet in the bookmarks bar.",
            "Wait until it copies the JSON. The main Capture data popup will detect it automatically."
        ]
    },
    {
        id: "so",
        eyebrow: "SuperOffice ticket data",
        title: "Capture SO info",
        buttonLabel: "Capture SO info",
        bookmarklet: superOfficeBookmarklet.trim(),
        description: "Extracts the SuperOffice ticket number, External ticket ID, attachments and message dates, then copies the JSON used by Capture data.",
        steps: [
            "Open the ticket in SuperOffice.",
            "Click the saved bookmarklet in the bookmarks bar.",
            "Come back to Salt Templater with the Capture data popup open.",
            "Ticket photos, videos and PDFs will appear in the Médias SO tool when compatible attachments are present."
        ]
    },
    {
        id: "alo",
        eyebrow: "ALO ticket form",
        title: "Fill ALO site",
        buttonLabel: "Fill ALO site",
        bookmarklet: buildAloAutofillBookmarklet(),
        description: "Reads the structured ALO fill data copied from Salt Templater and fills the ticket, end-user and ISP contact fields.",
        steps: [
            "Capture VTI data in Salt Templater.",
            "Capture SO data if you want the SO ticket copied into Ext. reference.",
            "Click ALO fill in the tools bar to copy the structured data.",
            "Open the ALO ticket form, then click this bookmarklet from the bookmarks bar."
        ]
    }
]);

export function copyTextFallback(value) {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
}

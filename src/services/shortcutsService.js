import superOfficeBookmarklet from "../data/superOfficeBookmarklet.txt?raw";
import vtiHealthcheckBookmarklet from "../data/vtiHealthcheckBookmarklet.txt?raw";
import {
    buildAloAutofillBetaBookmarklet,
    buildAloAutofillBookmarklet
} from "../utils/aloAutofill.js";
import { buildAlexTicketBookmarklet } from "../utils/alexTicket.js";

export const DATA_SHORTCUTS = Object.freeze([
    {
        id: "vti",
        eyebrow: "VTI customer data",
        title: "Capture VTI data",
        buttonLabel: "Capture VTI data",
        bookmarklet: vtiHealthcheckBookmarklet.trim(),
        description: "Extracts Billing, Contact Details and Healthcheck data, then copies the customer JSON used by Salt BO tools.",
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
            "Come back to Salt BO tools with the Capture data popup open.",
            "Ticket photos, videos and PDFs will appear in the Médias SO tool when compatible attachments are present."
        ]
    },
    {
        id: "alex-ticket",
        eyebrow: "ALEX ticket consultation",
        title: "Open ALEX ticket",
        buttonLabel: "Open ALEX ticket",
        bookmarklet: buildAlexTicketBookmarklet(),
        description: "Reads the ALEX payload, selects the matching partner and opens either SEP filtered by the VTI OTO ID or an existing ticket.",
        steps: [
            "Capture the current VTI customer and generate or import its External ID.",
            "Click Create ALEX ticket to copy the partner and VTI OTO context, or Ticket ALEX to copy an existing ticket context.",
            "On the newly opened ftthproxy.ch tab, sign in if necessary.",
            "Click this bookmarklet to select the partner and open the requested SEP search or existing ticket."
        ]
    },
    {
        id: "alo",
        eyebrow: "ALO ticket form",
        title: "Fill ALO site",
        buttonLabel: "Fill ALO site",
        bookmarklet: buildAloAutofillBookmarklet(),
        description: "Reads the structured ALO fill data copied from Salt BO tools and fills the ticket, end-user and ISP contact fields.",
        steps: [
            "Capture VTI data in Salt BO tools.",
            "Capture SO data if you want the SO ticket copied into Ext. reference.",
            "Click ALO fill in the tools bar to copy the structured data.",
            "Open the ALO ticket form, then click this bookmarklet from the bookmarks bar."
        ]
    },
    {
        id: "alo-beta",
        eyebrow: "ALO ticket form · Beta",
        title: "Fill ALO site + Ext Ref",
        buttonLabel: "Fill ALO site Beta",
        bookmarklet: buildAloAutofillBetaBookmarklet(),
        description: "Loads the matching Fulfillment order in the background, extracts its Ext Ref and fills the ALO ticket form without submitting it.",
        steps: [
            "Capture current VTI data so the Provider Order Ref is available.",
            "Click ALO fill in the tools bar and prepare the structured ticket data.",
            "Open the ALO ticket creation form.",
            "Click this beta bookmarklet and wait for the progress overlay to finish.",
            "Review every populated field, then validate the ticket manually."
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

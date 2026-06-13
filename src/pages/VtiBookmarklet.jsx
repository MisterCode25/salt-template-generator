import superOfficeBookmarklet from "../data/superOfficeBookmarklet.txt?raw";
import vtiHealthcheckBookmarklet from "../data/vtiHealthcheckBookmarklet.txt?raw";
import { showToast } from "../services/clipboardService.js";
import { buildAloAutofillBookmarklet } from "../utils/aloAutofill.js";

const shortcuts = [
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
            "Wait until it copies the JSON, then import customer data from the main screen."
        ]
    },
    {
        id: "so",
        eyebrow: "SuperOffice ticket data",
        title: "Capture SO info",
        buttonLabel: "Capture SO info",
        bookmarklet: superOfficeBookmarklet.trim(),
        description: "Extracts the SuperOffice ticket number, External ticket ID, attachments and message dates, then copies the JSON used by Import data from SO.",
        steps: [
            "Open the ticket in SuperOffice.",
            "Click the saved bookmarklet in the bookmarks bar.",
            "Come back to Salt Templater and click Import data from SO.",
            "Ticket photos will appear in the Photos SO tool when image attachments are present."
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
            "Import VTI data in Salt Templater.",
            "Import SO data if you want the SO ticket copied into Ext. reference.",
            "Click ALO fill in the tools bar to copy the structured data.",
            "Open the ALO ticket form, then click this bookmarklet from the bookmarks bar."
        ]
    }
];

function copyTextFallback(value) {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
}

function ShortcutCard({ shortcut }) {
    const copyBookmarklet = async () => {
        try {
            await navigator.clipboard.writeText(shortcut.bookmarklet);
        } catch {
            copyTextFallback(shortcut.bookmarklet);
        }
        showToast(`${shortcut.buttonLabel} shortcut copied`, "success");
    };

    return (
        <article className="vti-bookmarklet-panel vti-bookmarklet-shortcut-card">
            <div>
                <p className="eyebrow">{shortcut.eyebrow}</p>
                <h2>{shortcut.title}</h2>
                <p className="hint">{shortcut.description}</p>
            </div>
            <a
                className={`vti-bookmarklet-button vti-bookmarklet-button--${shortcut.id}`}
                href={shortcut.bookmarklet}
                draggable="true"
                title={shortcut.buttonLabel}
                aria-label={shortcut.buttonLabel}
                onDragStart={(event) => {
                    event.dataTransfer.setData("text/uri-list", shortcut.bookmarklet);
                    event.dataTransfer.setData("text/plain", shortcut.bookmarklet);
                    event.dataTransfer.setData("text/x-moz-url", `${shortcut.bookmarklet}\n${shortcut.buttonLabel}`);
                    event.dataTransfer.effectAllowed = "copyLink";
                }}
                onClick={(event) => {
                    event.preventDefault();
                    showToast("Drag this button to the bookmarks bar.", "info");
                }}
            >
                {shortcut.buttonLabel}
            </a>
            <ol className="vti-bookmarklet-steps">
                {shortcut.steps.map((step) => (
                    <li key={step}>{step}</li>
                ))}
            </ol>
            <button type="button" className="secondary-btn" onClick={copyBookmarklet}>
                Copy shortcut
            </button>
        </article>
    );
}

export default function VtiBookmarklet({ embedded = false }) {
    return (
        <main className={embedded ? "management-embedded-page vti-bookmarklet-page" : "page-container vti-bookmarklet-page"}>
            <section className="vti-bookmarklet-hero">
                <div>
                    <p className="eyebrow">Browser shortcuts</p>
                    <h1>Install data capture shortcuts</h1>
                    <p className="vti-bookmarklet-lead">
                        Drag the buttons into the bookmarks bar. VTI imports full customer data;
                        SuperOffice imports the SO ticket number, a valid External ID and ticket photos with their message dates when present.
                        The ALO shortcut fills the ticket form from the structured data prepared by the app.
                    </p>
                </div>
            </section>

            <section className="vti-bookmarklet-grid">
                {shortcuts.map((shortcut) => (
                    <ShortcutCard key={shortcut.id} shortcut={shortcut} />
                ))}
            </section>

            <section className="vti-bookmarklet-panel vti-bookmarklet-support">
                <div>
                    <h2>Drag does not work?</h2>
                    <p className="hint">
                        Copy the shortcut, create a bookmark manually, then paste it as the bookmark URL.
                    </p>
                </div>
            </section>
        </main>
    );
}

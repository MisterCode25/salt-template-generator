import superOfficeBookmarklet from "../data/superOfficeBookmarklet.txt?raw";
import vtiHealthcheckBookmarklet from "../data/vtiHealthcheckBookmarklet.txt?raw";
import { showToast } from "../services/clipboardService.js";

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
        description: "Extracts the SuperOffice ticket number and External ticket ID, then copies the JSON used by Import data from SO.",
        steps: [
            "Open the ticket in SuperOffice.",
            "Click the saved bookmarklet in the bookmarks bar.",
            "Come back to Salt Templater and click Import data from SO."
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
                        SuperOffice imports the SO ticket number and a valid External ID when present.
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

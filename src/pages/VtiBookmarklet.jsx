import { showToast } from "../services/clipboardService.js";
import { DATA_SHORTCUTS, copyTextFallback } from "../services/shortcutsService.js";

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
                title={shortcut.buttonLabel}
                aria-label={shortcut.buttonLabel}
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
                {DATA_SHORTCUTS.map((shortcut) => (
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

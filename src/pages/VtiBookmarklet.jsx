import { useEffect, useState } from "react";
import { CheckCircle2, Download, Puzzle } from "lucide-react";
import { showToast } from "../services/clipboardService.js";
import { requestBrowserExtensionStatus } from "../services/browserExtensionCaptureService.js";
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
    const [extensionStatus, setExtensionStatus] = useState({ checking: true, installed: false, version: "" });
    const extensionDownloadUrl = `${import.meta.env.BASE_URL}downloads/salt-bo-capture-beta.zip`;

    useEffect(() => {
        let cancelled = false;
        requestBrowserExtensionStatus().then((status) => {
            if (cancelled) return;
            setExtensionStatus({
                checking: false,
                installed: Boolean(status?.installed),
                version: status?.version || ""
            });
        });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <main className={embedded ? "management-embedded-page vti-bookmarklet-page" : "page-container vti-bookmarklet-page"}>
            <section className="vti-bookmarklet-hero">
                <div>
                    <p className="eyebrow">Browser shortcuts</p>
                    <h1>Install data capture shortcuts</h1>
                    <p className="vti-bookmarklet-lead">
                        Drag the buttons into the bookmarks bar. VTI imports full customer data;
                        SuperOffice imports the SO ticket number, a valid External ID and ticket media with their message dates when present.
                        The ALO shortcuts fill the ticket form from the structured data prepared by the app;
                        the beta version also retrieves the Fulfillment Ext Ref in the background.
                    </p>
                </div>
            </section>

            <section className="vti-bookmarklet-panel browser-extension-install-panel">
                <div className="browser-extension-install-heading">
                    <span className="browser-extension-install-icon" aria-hidden="true"><Puzzle size={24} /></span>
                    <div>
                        <p className="eyebrow">Beta extension</p>
                        <h2>Automatic SO + VTI capture</h2>
                        <p className="hint">
                            The app pilots the extension. This first version captures exactly one already-open
                            SuperOffice tab and one already-open VTI tab; it does not search or navigate.
                        </p>
                    </div>
                    <span className={`browser-extension-install-status${extensionStatus.installed ? " is-installed" : ""}`}>
                        {extensionStatus.installed && <CheckCircle2 size={14} aria-hidden="true" />}
                        {extensionStatus.checking
                            ? "Checking…"
                            : extensionStatus.installed
                                ? `Installed${extensionStatus.version ? ` · v${extensionStatus.version}` : ""}`
                                : "Not detected"}
                    </span>
                </div>

                <div className="browser-extension-install-content">
                    <ol className="vti-bookmarklet-steps">
                        <li>Download and unzip the extension.</li>
                        <li>Open <code>edge://extensions</code> or <code>chrome://extensions</code>.</li>
                        <li>Enable Developer mode, choose “Load unpacked”, then select the unzipped folder.</li>
                        <li>Reload this app once, then use the “Capture beta” button.</li>
                    </ol>
                    <a className="primary-btn browser-extension-install-download" href={extensionDownloadUrl} download>
                        <Download size={16} aria-hidden="true" />
                        Download extension ZIP
                    </a>
                </div>
                <p className="browser-extension-install-fallback">
                    The bookmarklets below remain fully available as the production fallback during the beta.
                </p>
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

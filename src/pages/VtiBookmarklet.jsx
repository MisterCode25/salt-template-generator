import vtiHealthcheckBookmarklet from "../data/vtiHealthcheckBookmarklet.txt?raw";
import { showToast } from "../services/clipboardService.js";

const bookmarkletCode = vtiHealthcheckBookmarklet.trim();

export default function VtiBookmarklet({ embedded = false, onClose = null }) {
    const copyBookmarklet = async () => {
        try {
            await navigator.clipboard.writeText(bookmarkletCode);
        } catch {
            const textarea = document.createElement("textarea");
            textarea.value = bookmarkletCode;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
        }
        showToast("Bookmarklet copied", "success");
    };

    return (
        <main className={embedded ? "management-embedded-page vti-bookmarklet-page" : "page-container vti-bookmarklet-page"}>
            <section className="vti-bookmarklet-hero">
                <div>
                    <p className="eyebrow">VTI customer data</p>
                    <h1>Install the VTI shortcut</h1>
                    <p className="vti-bookmarklet-lead">
                        This shortcut runs inside VTI, extracts Billing, Contact Details and Healthcheck data,
                        then copies the customer JSON used by Salt Templater.
                    </p>
                </div>
                <a
                    className="vti-bookmarklet-button"
                    href={bookmarkletCode}
                    draggable="true"
                    onClick={(event) => {
                        event.preventDefault();
                        showToast("Drag this button to the bookmarks bar.", "info");
                    }}
                >
                    Capture VTI data
                </a>
                {embedded && (
                    <button type="button" className="secondary-btn" onClick={onClose}>Close</button>
                )}
            </section>

            <section className="vti-bookmarklet-grid">
                <div className="vti-bookmarklet-panel">
                    <h2>Install</h2>
                    <ol className="vti-bookmarklet-steps">
                        <li>Show your browser bookmarks bar.</li>
                        <li>Drag the blue button above into the bookmarks bar.</li>
                        <li>Keep the shortcut there. It is the script used to generate customer JSON from VTI.</li>
                    </ol>
                </div>

                <div className="vti-bookmarklet-panel">
                    <h2>Use in VTI</h2>
                    <ol className="vti-bookmarklet-steps">
                        <li>Open the customer in VTI on Billing Account information.</li>
                        <li>Click the saved bookmarklet in the bookmarks bar.</li>
                        <li>Wait until it copies the JSON, then come back here and import customer data.</li>
                    </ol>
                </div>
            </section>

            <section className="vti-bookmarklet-panel vti-bookmarklet-support">
                <div>
                    <h2>Drag does not work?</h2>
                    <p className="hint">
                        Copy the shortcut, create a bookmark manually, then paste it as the bookmark URL.
                    </p>
                </div>
                <button type="button" className="secondary-btn" onClick={copyBookmarklet}>
                    Copy shortcut
                </button>
            </section>
        </main>
    );
}

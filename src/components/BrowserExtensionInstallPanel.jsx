import { useEffect, useState } from "react";
import { CheckCircle2, Download, Puzzle } from "lucide-react";
import {
    isBrowserExtensionVersionAtLeast,
    requestBrowserExtensionStatus
} from "../services/browserExtensionCaptureService.js";

const CURRENT_EXTENSION_VERSION = "0.1.4";

export default function BrowserExtensionInstallPanel() {
    const [extensionStatus, setExtensionStatus] = useState({
        checking: true,
        installed: false,
        version: ""
    });
    const extensionDownloadUrl = `${import.meta.env.BASE_URL}downloads/salt-bo-capture-beta.zip`;
    const needsUpdate = extensionStatus.installed
        && !isBrowserExtensionVersionAtLeast(extensionStatus.version, CURRENT_EXTENSION_VERSION);

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
        <section className="vti-bookmarklet-panel browser-extension-install-panel">
            <div className="browser-extension-install-heading">
                <span className="browser-extension-install-icon" aria-hidden="true"><Puzzle size={24} /></span>
                <div>
                    <p className="eyebrow">Beta extension</p>
                    <h2>Automatic SO, VTI, ALO and ALEX workflows</h2>
                    <p className="hint">
                        The app pilots the extension. SO/VTI capture uses the already-open tabs; ALO and ALEX
                        reuse their tab when possible, or open one when needed.
                    </p>
                </div>
                <span className={`browser-extension-install-status${extensionStatus.installed ? " is-installed" : ""}`}>
                    {extensionStatus.installed && <CheckCircle2 size={14} aria-hidden="true" />}
                    {extensionStatus.checking
                        ? "Checking…"
                        : extensionStatus.installed
                            ? `Installed${extensionStatus.version ? ` · v${extensionStatus.version}` : ""}${needsUpdate ? " · Update required" : ""}`
                            : "Not detected"}
                </span>
            </div>

            <div className="browser-extension-install-content">
                <ol className="vti-bookmarklet-steps">
                    <li>Download and unzip the extension.</li>
                    <li>Open <code>edge://extensions</code> or <code>chrome://extensions</code>.</li>
                    <li>Enable Developer mode, choose “Load unpacked”, then select the unzipped folder.</li>
                    <li>Reload this app, then use “Capture beta”, “ALO fill” or “Ticket ALEX”.</li>
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
    );
}

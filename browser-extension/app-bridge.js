(function installSaltCaptureBridge() {
    const channel = "salt-bo-browser-capture.v1";
    const appSource = "salt-template-generator";
    const extensionSource = "salt-bo-capture-extension";
    const allowedCommands = new Set([
        "salt.capture.status.request.v1",
        "salt.capture.start.v1",
        "salt.capture.alo.start.v1",
        "salt.capture.alex.start.v1"
    ]);

    function isValidAppCommand(message) {
        return Boolean(
            message
            && message.channel === channel
            && message.source === appSource
            && allowedCommands.has(message.type)
            && typeof message.requestId === "string"
            && message.requestId.length > 0
        );
    }

    function forwardToApplication(message) {
        if (!message || typeof message.type !== "string") return;
        window.postMessage({
            ...message,
            channel,
            source: extensionSource
        }, window.location.origin);
    }

    function forwardRuntimeFailure(requestId, error) {
        forwardToApplication({
            type: "salt.capture.failed.v1",
            requestId,
            error: String(error?.message || error || "Extension unavailable.")
        });
    }

    window.addEventListener("message", (event) => {
        if (event.source !== window || event.origin !== window.location.origin) return;
        if (!isValidAppCommand(event.data)) return;

        try {
            chrome.runtime.sendMessage(event.data, (response) => {
                try {
                    if (chrome.runtime.lastError) {
                        forwardRuntimeFailure(event.data.requestId, chrome.runtime.lastError);
                        return;
                    }
                    if (!response) {
                        forwardRuntimeFailure(
                            event.data.requestId,
                            "The extension background service returned no response."
                        );
                        return;
                    }
                    forwardToApplication(response);
                } catch (error) {
                    forwardRuntimeFailure(event.data.requestId, error);
                }
            });
        } catch (error) {
            forwardRuntimeFailure(event.data.requestId, error);
        }
    });

    chrome.runtime.onMessage.addListener((message) => {
        if (message?.channel !== channel || message?.source !== extensionSource) return;
        forwardToApplication(message);
    });

    forwardToApplication({
        type: "salt.capture.ready.v1",
        requestId: `ready-${Date.now()}`,
        installed: true,
        version: chrome.runtime.getManifest().version
    });
})();

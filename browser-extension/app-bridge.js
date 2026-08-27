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

    window.addEventListener("message", (event) => {
        if (event.source !== window || event.origin !== window.location.origin) return;
        if (!isValidAppCommand(event.data)) return;

        chrome.runtime.sendMessage(event.data, (response) => {
            if (chrome.runtime.lastError) {
                forwardToApplication({
                    type: "salt.capture.failed.v1",
                    requestId: event.data.requestId,
                    error: chrome.runtime.lastError.message || "Extension unavailable."
                });
                return;
            }
            forwardToApplication(response);
        });
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

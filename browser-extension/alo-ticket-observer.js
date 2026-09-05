(function observeAloTicketPage() {
    let isSending = false;
    let isCaptured = false;
    let retryTimer = null;
    let deliveryAttempts = 0;

    function send(type, result) {
        return chrome.runtime.sendMessage({ type, result }).catch(() => null);
    }

    function recordSubmission(event) {
        if (!event.isTrusted || !location.pathname.endsWith("/assurance/create.do")) return;
        if (event.type === "click") {
            const button = event.target.closest('button, input[type="submit"], input[type="button"]');
            if (!button || (button.type !== "submit" && !/^submit$/i.test(button.value || button.textContent.trim()))) return;
        }
        const field = (id) => document.getElementById(id)?.value?.trim() || "";
        send("salt.alo.submitted.v1", {
            socketId: field("ticket.socketId"),
            externalReference: field("ticket.extRef")
        });
    }

    async function checkResult() {
        if (isSending || isCaptured) return;
        const result = extractAloTicketResult(document, location.href);
        if (!result) return;
        isSending = true;
        deliveryAttempts += 1;
        const response = await send("salt.alo.result.v1", result);
        isSending = false;
        if (response?.captured) {
            isCaptured = true;
            observer.disconnect();
            clearTimeout(retryTimer);
        } else if (deliveryAttempts < 5) {
            // Retry delivery across background startup and the submission/navigation race.
            clearTimeout(retryTimer);
            retryTimer = setTimeout(checkResult, 2000);
        } else {
            observer.disconnect();
        }
    }

    document.addEventListener("submit", recordSubmission, true);
    document.addEventListener("click", recordSubmission, true);
    const observer = new MutationObserver(checkResult);
    observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
    window.addEventListener("pageshow", checkResult);
    checkResult();
})();

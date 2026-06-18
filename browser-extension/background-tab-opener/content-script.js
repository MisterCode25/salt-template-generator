const APP_SOURCE = "template-generator";
const EXTENSION_SOURCE = "template-generator-background-tab-opener";

function postToPage(message) {
  window.postMessage({
    source: EXTENSION_SOURCE,
    ...message
  }, "*");
}

postToPage({ type: "ready" });

window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  const data = event.data || {};
  if (data.source !== APP_SOURCE) return;

  if (data.type === "background-tab-ping") {
    postToPage({ type: "ready" });
    return;
  }

  if (data.type !== "open-background-tab") return;

  chrome.runtime.sendMessage({
    type: "open-background-tab",
    requestId: data.requestId || "",
    url: data.url || ""
  }, (response = {}) => {
    const runtimeError = chrome.runtime.lastError?.message || "";
    postToPage({
      type: "open-result",
      requestId: data.requestId || "",
      ok: Boolean(response.ok) && !runtimeError,
      error: runtimeError || response.error || ""
    });
  });
});

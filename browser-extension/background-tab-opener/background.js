const ALLOWED_APP_ORIGINS = [
  /^http:\/\/localhost(?::\d+)?$/,
  /^http:\/\/127\.0\.0\.1(?::\d+)?$/,
  /^https:\/\/localhost(?::\d+)?$/,
  /^https:\/\/127\.0\.0\.1(?::\d+)?$/
];

function isAllowedSender(sender) {
  try {
    const senderUrl = new URL(sender?.url || "");
    if (senderUrl.protocol === "file:") return true;
    return ALLOWED_APP_ORIGINS.some((pattern) => pattern.test(senderUrl.origin));
  } catch {
    return false;
  }
}

function normalizeTargetUrl(rawUrl) {
  try {
    const targetUrl = new URL(String(rawUrl || "").trim());
    if (targetUrl.protocol !== "http:" && targetUrl.protocol !== "https:") return "";
    return targetUrl.href;
  } catch {
    return "";
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== "open-background-tab") return false;

  if (!isAllowedSender(sender)) {
    sendResponse({ ok: false, error: "Template Generator origin is not allowed." });
    return false;
  }

  const url = normalizeTargetUrl(message.url);
  if (!url) {
    sendResponse({ ok: false, error: "Only http and https links can be opened in background tabs." });
    return false;
  }

  chrome.tabs.create({ url, active: false }, () => {
    const error = chrome.runtime.lastError?.message || "";
    sendResponse({ ok: !error, error });
  });

  return true;
});

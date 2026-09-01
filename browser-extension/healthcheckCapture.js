const VTI_HEALTHCHECK_FIELD_LABELS = [
    "fllRecordId",
    "otoId",
    "otoPortId",
    "routerSerialNumber",
    "oldRouterSerialNumber",
    "lexId",
    "oltName",
    "oltBoard",
    "ponPort",
    "breakoutCableId",
    "fiberNumber",
    "lineState",
    "crossConnexion",
    "customerId"
];

function getVtiHealthcheckValue(label, source) {
    const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return (source.match(new RegExp(`${escapedLabel}\\s+([^\\n]+)`, "i"))?.[1] || "").trim();
}

function hasUsableVtiHealthcheckData(source) {
    const filledFieldCount = VTI_HEALTHCHECK_FIELD_LABELS.reduce(
        (total, label) => total + (getVtiHealthcheckValue(label, source) ? 1 : 0),
        /No data on the router|CPE found/i.test(source) ? 1 : 0
    );
    const hasCriticalData = [
        "routerSerialNumber",
        "breakoutCableId",
        "fiberNumber",
        "lineState",
        "otoId"
    ].some((label) => Boolean(getVtiHealthcheckValue(label, source)))
        || /No data on the router|CPE found/i.test(source);

    return (filledFieldCount >= 3 || hasCriticalData) && source.length > 500;
}

export function normalizeVtiHealthcheckResponseText(source) {
    return String(source || "")
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/(?:address|article|aside|div|dl|dt|dd|fieldset|footer|form|h[1-6]|header|li|main|nav|ol|p|pre|section|table|tbody|td|tfoot|th|thead|tr|ul)>/gi, "\n")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;|&#160;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;|&apos;/gi, "'")
        .replace(/&#x([0-9a-f]+);/gi, (_match, code) => String.fromCodePoint(Number.parseInt(code, 16)))
        .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number(code)))
        .split(/\r?\n/)
        .map((line) => line.replace(/[\t ]+/g, " ").trim())
        .filter(Boolean)
        .join("\n");
}

export function extractUsableVtiHealthcheckText(source) {
    const normalizedSource = normalizeVtiHealthcheckResponseText(source);
    return hasUsableVtiHealthcheckData(normalizedSource) ? normalizedSource : "";
}

export async function fetchVtiHealthcheckSource(url, timeoutMs = 1800) {
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);
    try {
        const requestedUrl = new URL(url, location.href);
        if (requestedUrl.origin !== location.origin) return "";
        const response = await fetch(requestedUrl.href, {
            credentials: "include",
            cache: "no-store",
            redirect: "follow",
            signal: abortController.signal
        });
        if (!response.ok) return "";
        return await response.text();
    } catch {
        return "";
    } finally {
        clearTimeout(timeoutId);
    }
}

export async function captureVtiHealthcheckPage() {
    const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
    const fieldLabels = [
        "fllRecordId",
        "otoId",
        "otoPortId",
        "routerSerialNumber",
        "oldRouterSerialNumber",
        "lexId",
        "oltName",
        "oltBoard",
        "ponPort",
        "breakoutCableId",
        "fiberNumber",
        "lineState",
        "crossConnexion",
        "customerId"
    ];
    const getAfter = (label, source) => {
        const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return (source.match(new RegExp(`${escapedLabel}\\s+([^\\n]+)`, "i"))?.[1] || "").trim();
    };
    const countFilledFields = (source) => {
        let count = fieldLabels.reduce((total, label) => total + (getAfter(label, source) ? 1 : 0), 0);
        if (/No data on the router|CPE found/i.test(source)) count += 1;
        return count;
    };
    const hasCriticalData = (source) => (
        Boolean(getAfter("routerSerialNumber", source))
        || Boolean(getAfter("breakoutCableId", source))
        || Boolean(getAfter("fiberNumber", source))
        || Boolean(getAfter("lineState", source))
        || Boolean(getAfter("otoId", source))
        || /No data on the router|CPE found/i.test(source)
    );
    const assertAuthenticatedSession = () => {
        if (document.querySelector(
            'input[type="password"], input[name="user_name"], form[action*="Login" i]'
        )) {
            throw new Error("La session VTI a expiré. Reconnecte-toi dans l’onglet VTI puis réessaie.");
        }
    };

    let lastText = "";
    let bestText = "";
    let bestFieldCount = 0;
    const startedAt = Date.now();

    while (Date.now() - startedAt < 45000) {
        assertAuthenticatedSession();
        const pageText = document.body?.innerText || "";
        if (pageText) {
            lastText = pageText;
            const fieldCount = countFilledFields(pageText);
            if (fieldCount > bestFieldCount) {
                bestFieldCount = fieldCount;
                bestText = pageText;
            }
            if ((fieldCount >= 3 || hasCriticalData(pageText)) && pageText.length > 500) {
                return pageText;
            }
        }
        await sleep(500);
    }

    return bestText || lastText;
}

const REQUEST_LINE_RE = /request\s*[:#-]?\s*(\d{5,12})/i;
const MOBILE_PREFIX_RE = /^0(76|77|78|79)/;

function stripDiacritics(value) {
    return value.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

export function normalizeKey(value) {
    return stripDiacritics(String(value || ""))
        .toLowerCase()
        .replace(/[{}]/g, "")
        .replace(/[_\s-]+/g, " ")
        .replace(/[^a-z0-9 ]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function buildLogicalLines(text) {
    const rawLines = String(text || "").replace(/\r\n?/g, "\n").split("\n");
    const lines = [];
    for (let i = 0; i < rawLines.length; i++) {
        const current = rawLines[i].trim();
        if (!current) continue;
        const labelOnly = current.match(/^(.{2,60}):\s*$/);
        if (labelOnly && i + 1 < rawLines.length) {
            const next = rawLines[i + 1].trim();
            if (next && !next.includes(":")) {
                lines.push(`${labelOnly[1]}: ${next}`);
                i++;
                continue;
            }
        }
        lines.push(current);
    }
    return lines;
}

function normalizePhone(raw) {
    if (!raw) return "";
    let s = String(raw).trim().replace(/[^\d+]/g, "");
    if (s.startsWith("00")) s = "+" + s.slice(2);
    if (s.startsWith("+41")) s = "0" + s.slice(3);
    return s;
}

function isSwissMobile(num) {
    return /^0(76|77|78|79)\d{7}$/.test(num);
}

function extractPhoneFromValue(value) {
    const match = String(value || "").match(/(\+?\d[\d\s()./-]{6,})/);
    return match ? match[1] : "";
}

function coerceTicket(value) {
    const m = String(value || "").match(/\b(\d{5,12})\b/);
    return m ? m[1] : String(value || "").trim();
}

export function parseClipboard(text) {
    const lines = buildLogicalLines(text);
    const keyValues = [];
    let ticketNumber = "";
    let mobileNumber = "";

    for (const line of lines) {
        const requestMatch = line.match(REQUEST_LINE_RE);
        if (requestMatch) {
            ticketNumber = requestMatch[1];
            keyValues.push({ rawKey: "Request", key: "request", value: ticketNumber, sourceLine: line });
            break;
        }
    }

    for (const line of lines) {
        const idx = line.indexOf(":");
        if (idx === -1) continue;
        const rawKey = line.slice(0, idx).trim();
        const rawValue = line.slice(idx + 1).trim();
        if (!rawKey || !rawValue) continue;
        const key = normalizeKey(rawKey);
        if (!key) continue;
        keyValues.push({ rawKey, key, value: rawValue, sourceLine: line });

        if (!mobileNumber && /(mobile|msisdn|gsm|sms)/i.test(rawKey)) {
            const normalized = normalizePhone(extractPhoneFromValue(rawValue));
            if (isSwissMobile(normalized)) mobileNumber = normalized;
        }
    }

    if (!mobileNumber) {
        const candidates = String(text || "").match(/(\+41[\d\s()./-]{8,}|0\d{2}[\d\s()./-]{7,})/g) || [];
        for (const raw of candidates) {
            const normalized = normalizePhone(raw);
            if (isSwissMobile(normalized)) {
                mobileNumber = normalized;
                break;
            }
        }
    }

    return { keyValues, ticketNumber, mobileNumber };
}

export function applyParsedToTokenValues(parsed, tokens, currentValues = {}) {
    const tokenKeyMap = new Map();
    (tokens || []).forEach(t => {
        if (!t?.key) return;
        tokenKeyMap.set(normalizeKey(t.key), t);
    });

    const nextValues = { ...currentValues };
    const applied = [];
    const unmapped = [];

    (parsed.keyValues || []).forEach(kv => {
        const target = tokenKeyMap.get(kv.key);
        if (!target) {
            unmapped.push(kv);
            return;
        }
        if (nextValues[target.token]) return;

        let valueToApply = kv.value;
        if (target.token === "{contact_num}") {
            const normalized = normalizePhone(extractPhoneFromValue(kv.value));
            if (!isSwissMobile(normalized)) {
                unmapped.push(kv);
                return;
            }
            valueToApply = normalized;
        }
        if (target.token === "{ticket_num}") {
            valueToApply = coerceTicket(kv.value);
        }

        nextValues[target.token] = valueToApply;
        applied.push({ token: target.token, key: kv.rawKey });
    });

    if (parsed.ticketNumber) {
        const ticketToken = (tokens || []).find(t => t.token === "{ticket_num}");
        if (ticketToken && !nextValues[ticketToken.token]) {
            nextValues[ticketToken.token] = parsed.ticketNumber;
            applied.push({ token: ticketToken.token, key: "Request" });
        }
    }

    if (parsed.mobileNumber) {
        const mobileToken = (tokens || []).find(t => t.token === "{contact_num}");
        if (mobileToken && !nextValues[mobileToken.token]) {
            nextValues[mobileToken.token] = parsed.mobileNumber;
            applied.push({ token: mobileToken.token, key: "Mobile" });
        }
    }

    return { nextValues, applied, unmapped };
}


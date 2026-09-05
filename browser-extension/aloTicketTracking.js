const PREFIX = "alo-ticket:";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

function swissWallTime(timestamp) {
    const parts = Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Zurich", year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
    }).formatToParts(timestamp).map(({ type, value }) => [type, value]));
    return Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
}

function isNewIncident(createdAt, submittedAt, now) {
    const match = String(createdAt || "").match(/^(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/);
    if (!match) return false;
    const [, day, month, year, hour, minute, second] = match;
    const created = Date.UTC(+year, +month - 1, +day, +hour, +minute, +second);
    // Swisscom displays Swiss local time. Allow small clock differences, not old incidents.
    const clockTolerance = 2 * 60 * 1000;
    return created >= swissWallTime(submittedAt) - clockTolerance && created <= swissWallTime(now) + clockTolerance;
}

export function createAloTicketTracker({ storage, sendResult, now = Date.now }) {
    let queue = Promise.resolve();
    const serialize = (operation) => {
        const result = queue.then(operation);
        queue = result.catch(() => {});
        return result;
    };
    async function entries() {
        const records = Object.entries(await storage.get(null)).filter(([key]) => key.startsWith(PREFIX));
        const expired = records.filter(([, record]) => now() - record.startedAt > MAX_AGE_MS);
        if (expired.length) await storage.remove(expired.map(([key]) => key));
        return records.filter(([, record]) => now() - record.startedAt <= MAX_AGE_MS);
    }
    function isAloSender(sender) {
        if (!sender.tab?.id || sender.frameId !== 0) return false;
        try {
            const url = new URL(sender.url);
            return url.origin === "https://wholesale.swisscom.com"
                && url.pathname.startsWith("/wsg/prod/alo/ass/web/alo-web/assurance/");
        } catch { return false; }
    }
    return {
        start(record) {
            return serialize(async () => {
                for (const [key, previous] of await entries()) {
                    if (previous.aloTabId === record.aloTabId && !previous.result) await storage.remove(key);
                }
                await storage.set({ [PREFIX + record.requestId]: { ...record, startedAt: now() } });
            });
        },
        observe(message, sender) {
            return serialize(async () => {
                if (!isAloSender(sender)) return { captured: false };
                const entry = (await entries()).find(([, record]) => record.aloTabId === sender.tab.id && !record.result);
                if (!entry) return { captured: false };
                const [key, record] = entry;
                const result = message.result;
                if (!record.socketId || result?.socketId !== record.socketId) return { captured: false };
                if (record.externalReference && result.externalReference !== record.externalReference) return { captured: false };
                if (message.type === "salt.alo.submitted.v1") {
                    if (!new URL(sender.url).pathname.endsWith("/assurance/create.do")) return { captured: false };
                    await storage.set({ [key]: {
                        ...record, submittedAt: now(), externalReference: result.externalReference
                    } });
                    return { submitted: true };
                }
                if (!record.submittedAt || !/^\d+$/.test(result.incidentId || "")) return { captured: false };
                if (!isNewIncident(result.createdAt, record.submittedAt, now())) return { captured: false };
                const next = { ...record, result, capturedAt: now() };
                await storage.set({ [key]: next });
                await sendResult(next);
                return { captured: true };
            });
        },
        replay(requestIds, appTabId, appOrigin) {
            return serialize(async () => {
                for (const [key, record] of await entries()) {
                    if (!requestIds.includes(record.requestId) || record.appOrigin !== appOrigin || !record.result) continue;
                    const next = { ...record, appTabId };
                    await storage.set({ [key]: next });
                    await sendResult(next);
                }
            });
        },
        acknowledge(requestId, appOrigin) {
            return serialize(async () => {
                const key = PREFIX + requestId;
                const record = (await storage.get(key))[key];
                if (record?.appOrigin === appOrigin && record.result) await storage.remove(key);
            });
        },
        removeTab(tabId) {
            return serialize(async () => {
                for (const [key, record] of await entries()) {
                    if (record.aloTabId === tabId && !record.result) await storage.remove(key);
                }
            });
        }
    };
}

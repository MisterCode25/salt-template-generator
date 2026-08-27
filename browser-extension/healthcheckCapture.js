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

    let lastText = "";
    let bestText = "";
    let bestFieldCount = 0;
    const startedAt = Date.now();

    while (Date.now() - startedAt < 45000) {
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

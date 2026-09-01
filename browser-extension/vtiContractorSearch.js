export async function findVtiContractorRecord(contractorNumber) {
    const normalizeNumber = (value) => {
        const normalizedValue = String(value ?? "").trim().replace(/\s+/g, "");
        return /^\d+$/.test(normalizedValue) ? normalizedValue : "";
    };
    const findRecordInDocument = (sourceDocument, requestedContractorNumber) => {
        const loginField = sourceDocument.querySelector(
            'input[type="password"], input[name="user_name"], form[action*="Login" i]'
        );
        if (loginField) {
            return {
                ok: false,
                code: "VTI_SESSION_REQUIRED",
                error: "The VTI session has expired. Sign in again in the VTI tab, then retry."
            };
        }

        const rows = [...sourceDocument.querySelectorAll("tr.listViewEntries")];
        const matchingRows = rows.filter((row) => (
            [...row.querySelectorAll(".listViewEntryValue")]
                .some((cell) => normalizeNumber(cell.textContent) === requestedContractorNumber)
        ));

        if (matchingRows.length === 0) {
            return {
                ok: false,
                code: "VTI_CONTRACTOR_NOT_FOUND",
                error: `No exact VTI result was found for contractor ${requestedContractorNumber}.`
            };
        }
        if (matchingRows.length > 1) {
            return {
                ok: false,
                code: "VTI_CONTRACTOR_AMBIGUOUS",
                error: `Multiple VTI results match contractor ${requestedContractorNumber}.`
            };
        }

        const row = matchingRows[0];
        const recordUrl = row.getAttribute("data-recordurl") || row.getAttribute("data-recordUrl") || "";
        const recordId = normalizeNumber(row.getAttribute("data-id"))
            || normalizeNumber(row.querySelector(".listViewEntriesCheckBox")?.value)
            || String(recordUrl).match(/[?&]record=(\d+)/i)?.[1]
            || "";
        if (!recordId) {
            return {
                ok: false,
                code: "VTI_RECORD_ID_MISSING",
                error: `The VTI result for contractor ${requestedContractorNumber} has no recordId.`
            };
        }

        return {
            ok: true,
            contractorNumber: requestedContractorNumber,
            recordId
        };
    };
    const requestedContractorNumber = normalizeNumber(contractorNumber);
    if (!requestedContractorNumber) {
        return {
            ok: false,
            code: "VTI_CONTRACTOR_INVALID",
            error: "The VTI contractor number is invalid."
        };
    }

    return findRecordInDocument(document, requestedContractorNumber);
}

export function verifyLoadedVtiContractorPage(expectedRecordId, expectedContractorNumber) {
    const normalizeNumber = (value) => {
        const normalizedValue = String(value ?? "").trim().replace(/\s+/g, "");
        return /^\d+$/.test(normalizedValue) ? normalizedValue : "";
    };
    const hasLoginForm = Boolean(document.querySelector(
        'input[type="password"], input[name="user_name"], form[action*="Login" i]'
    ));
    if (hasLoginForm) {
        return {
            ok: false,
            code: "VTI_SESSION_REQUIRED",
            error: "The VTI session has expired. Sign in again in the VTI tab, then retry."
        };
    }

    const requestedRecordId = normalizeNumber(expectedRecordId);
    const recordIdFromDocument = normalizeNumber(
        document.querySelector("#recordId")?.value
            || document.querySelector("#recordId")?.getAttribute?.("value")
    );
    let recordIdFromUrl = "";
    try {
        recordIdFromUrl = normalizeNumber(new URL(location.href).searchParams.get("record"));
    } catch {
        // The hidden VTI record field remains the primary source.
    }
    const loadedRecordId = recordIdFromDocument || recordIdFromUrl;
    if (!requestedRecordId || loadedRecordId !== requestedRecordId) {
        return {
            ok: false,
            code: "VTI_RECORD_MISMATCH",
            error: "The loaded VTI record does not match the requested contractor."
        };
    }

    const contractorNumber = normalizeNumber(expectedContractorNumber);
    const pageText = String(document.body?.innerText || document.body?.textContent || "");
    const escapedContractorNumber = contractorNumber.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const isContractorNumberVisible = contractorNumber
        && new RegExp(`(^|\\D)${escapedContractorNumber}(?=\\D|$)`).test(pageText);

    return {
        ok: true,
        contractorNumber: isContractorNumberVisible ? contractorNumber : "",
        recordId: loadedRecordId
    };
}

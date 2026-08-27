export function findVtiContractorRecord(contractorNumber) {
    const normalizeNumber = (value) => {
        const normalizedValue = String(value ?? "").trim().replace(/\s+/g, "");
        return /^\d+$/.test(normalizedValue) ? normalizedValue : "";
    };
    const requestedContractorNumber = normalizeNumber(contractorNumber);
    if (!requestedContractorNumber) {
        return {
            ok: false,
            code: "VTI_CONTRACTOR_INVALID",
            error: "Le numéro de contractor VTI est invalide."
        };
    }

    const loginField = document.querySelector(
        'input[type="password"], input[name="user_name"], form[action*="Login" i]'
    );
    if (loginField) {
        return {
            ok: false,
            code: "VTI_SESSION_REQUIRED",
            error: "La session VTI a expiré. Reconnecte-toi dans l’onglet VTI puis réessaie."
        };
    }

    const rows = [...document.querySelectorAll("tr.listViewEntries")];
    const matchingRows = rows.filter((row) => (
        [...row.querySelectorAll(".listViewEntryValue")]
            .some((cell) => normalizeNumber(cell.textContent) === requestedContractorNumber)
    ));

    if (matchingRows.length === 0) {
        return {
            ok: false,
            code: "VTI_CONTRACTOR_NOT_FOUND",
            error: `Aucun résultat VTI exact pour le contractor ${requestedContractorNumber}.`
        };
    }
    if (matchingRows.length > 1) {
        return {
            ok: false,
            code: "VTI_CONTRACTOR_AMBIGUOUS",
            error: `Plusieurs résultats VTI correspondent au contractor ${requestedContractorNumber}.`
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
            error: `Le résultat VTI du contractor ${requestedContractorNumber} ne contient aucun recordId.`
        };
    }

    return {
        ok: true,
        contractorNumber: requestedContractorNumber,
        recordId
    };
}

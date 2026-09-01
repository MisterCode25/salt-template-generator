function normalizeText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
}

function getValueAfterLabel(label, source) {
    const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return (String(source || "").match(new RegExp(`${escapedLabel}\\s+([^\\n]+)`, "i"))?.[1] || "").trim();
}

function normalizePhone(value) {
    const digits = String(value || "").replace(/\D/g, "");
    if (digits.startsWith("41") && digits.length === 11) {
        return `0${digits.slice(2, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}`;
    }
    if (digits.startsWith("0") && digits.length === 10) {
        return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`;
    }
    return String(value || "");
}

export function buildVtiCapturePayload({ staticCapture, offerCapture, healthText }) {
    const contact = staticCapture?.contactInfo || {};
    const offer = offerCapture?.offerInfo || {};
    const sourceText = [
        staticCapture?.billingAccountText,
        staticCapture?.billingInformationText,
        healthText
    ].filter(Boolean).join("\n\n");
    const lines = sourceText.split(/\n+/).map((line) => line.trim()).filter(Boolean);
    const contractorNumber = normalizeText(staticCapture?.contractorNumber)
        || (sourceText.match(/\n(\d{8})\n(?:Mr\.|Ms\.|Mrs\.)/i)?.[1] || "")
        || lines.find((line) => /^\d{8}$/.test(line))
        || "";
    const denomination = (sourceText.match(/\b(Mr\.|Ms\.|Mrs\.)\s+[^\n]+/)?.[0] || "").trim();
    const billingTitle = denomination.match(/^(Mr\.|Ms\.|Mrs\.)/i)?.[1] || "";
    const title = contact.title || billingTitle;
    const normalizedTitle = title.toLowerCase();
    const sex = normalizedTitle === "mr."
        ? "Male"
        : ["ms.", "mrs."].includes(normalizedTitle) ? "Female" : "";
    const nameOnly = denomination.replace(/^(Mr\.|Ms\.|Mrs\.)\s*/i, "").trim();
    const nameParts = nameOnly.split(/\s+/).filter(Boolean);
    const hasUppercaseLastName = nameParts.length > 1 && nameParts[0] === nameParts[0].toUpperCase();
    const fallbackFirstName = hasUppercaseLastName
        ? nameParts.slice(1).join(" ")
        : nameParts[0] || "";
    const fallbackLastName = hasUppercaseLastName
        ? nameParts[0]
        : nameParts.slice(1).join(" ");
    const mobileRaw = contact.mobileRaw || getValueAfterLabel("Mobile", sourceText);
    const crossConnectionSource = getValueAfterLabel("crossConnexion", sourceText);
    let crossConnexion = { raw: crossConnectionSource };
    try {
        if (crossConnectionSource.startsWith("{")) {
            crossConnexion = JSON.parse(crossConnectionSource);
        }
    } catch {
        // Keep the raw VTI value when it is not valid JSON.
    }

    return {
        client: {
            contractorNumber,
            title,
            firstName: contact.firstName || fallbackFirstName,
            lastName: contact.lastName || fallbackLastName,
            sex,
            mobileRaw,
            mobile: normalizePhone(mobileRaw),
            address: getValueAfterLabel("Address", sourceText),
            email: contact.email || getValueAfterLabel("Email", sourceText),
            communicationLanguage: contact.communicationLanguage || "",
            eligibilitySource: contact.eligibilitySource || "",
            contactRecordId: contact.contactRecordId || ""
        },
        offer: {
            activationDate: offer.activationDate || ""
        },
        contact: {
            communicationLanguage: contact.communicationLanguage || "",
            eligibilitySource: contact.eligibilitySource || "",
            contactRecordId: contact.contactRecordId || "",
            eligibilityOrdering: contact.eligibilityOrdering || "",
            publicId: contact.publicId || "",
            fixedNumber: contact.fixedNumber || "",
            providerOrderRef: contact.providerOrderRef || "",
            error: contact.error || ""
        },
        healthcheck: {
            fllRecordId: getValueAfterLabel("fllRecordId", sourceText),
            otoId: getValueAfterLabel("otoId", sourceText) || getValueAfterLabel("OTO-ID:", sourceText),
            otoPortId: getValueAfterLabel("otoPortId", sourceText),
            routerSerialNumber: getValueAfterLabel("routerSerialNumber", sourceText),
            oldRouterSerialNumber: getValueAfterLabel("oldRouterSerialNumber", sourceText),
            lexId: getValueAfterLabel("lexId", sourceText),
            oltName: getValueAfterLabel("oltName", sourceText),
            oltBoard: getValueAfterLabel("oltBoard", sourceText),
            ponPort: getValueAfterLabel("ponPort", sourceText),
            breakoutCableId: getValueAfterLabel("breakoutCableId", sourceText),
            fiberNumber: getValueAfterLabel("fiberNumber", sourceText),
            status: getValueAfterLabel("status", sourceText),
            odfId: getValueAfterLabel("odfId", sourceText),
            option82: getValueAfterLabel("option82", sourceText) || getValueAfterLabel("Option 82:", sourceText),
            oltObject: getValueAfterLabel("oltObject", sourceText),
            ontConfigurationFilename: getValueAfterLabel("ontConfigurationFilename", sourceText),
            svlan: getValueAfterLabel("svlan", sourceText),
            customerId: getValueAfterLabel("customerId", sourceText) || getValueAfterLabel("Public ID:", sourceText),
            lineState: getValueAfterLabel("lineState", sourceText),
            crossConnexion,
            routerStatus: /No data on the router/i.test(sourceText)
                ? "No data on the router / CPE found"
                : ""
        }
    };
}

export async function captureVtiBackgroundPages(recordId, expectedContractorNumber, pageUrls) {
    const clean = (value) => String(value || "").replace(/\s+/g, " ").trim();
    const textOf = (element) => clean(element?.innerText || element?.textContent || "");
    const documentText = (sourceDocument) => (
        sourceDocument.body?.innerText || sourceDocument.body?.textContent || ""
    );
    const hasLoginForm = (sourceDocument) => Boolean(sourceDocument.querySelector(
        'input[type="password"], input[name="user_name"], form[action*="Login" i]'
    ));
    const readRecordId = (sourceDocument) => clean(
        sourceDocument.querySelector("#recordId")?.value
            || sourceDocument.querySelector("#recordId")?.getAttribute?.("value")
    );
    const fieldValue = (sourceDocument, id) => textOf(
        sourceDocument.querySelector(`#${id} .value`)
            || sourceDocument.querySelector(`#${id}`)
    );
    const fetchDocument = async (rawUrl, label) => {
        const requestedUrl = new URL(rawUrl, location.href);
        if (requestedUrl.origin !== location.origin) {
            throw new Error(`${label} doit rester sur le domaine VTI courant.`);
        }
        const response = await fetch(requestedUrl.href, {
            credentials: "include",
            cache: "no-store",
            redirect: "follow"
        });
        if (!response.ok) throw new Error(`${label} a retourné une réponse invalide.`);
        if (response.url && new URL(response.url, requestedUrl.href).origin !== location.origin) {
            throw new Error(`${label} a été redirigé hors de VTI.`);
        }
        const source = await response.text();
        const sourceDocument = new DOMParser().parseFromString(source, "text/html");
        if (hasLoginForm(sourceDocument)) {
            const sessionError = new Error("La session VTI a expiré. Reconnecte-toi dans l’onglet VTI puis réessaie.");
            sessionError.code = "VTI_SESSION_REQUIRED";
            throw sessionError;
        }
        return { source, sourceDocument };
    };
    const getContactRecordId = (sourceDocument, source) => {
        const html = String(sourceDocument.body?.innerHTML || source || "").replaceAll("&amp;", "&");
        return html.match(/module=Contacts[^"']*record=(\d+)/i)?.[1] || "";
    };
    const contractorNumberFromText = (source) => {
        const lines = String(source || "").split(/\n+/).map((line) => line.trim()).filter(Boolean);
        return String(source || "").match(/\n(\d{8})\n(?:Mr\.|Ms\.|Mrs\.)/i)?.[1]
            || lines.find((line) => /^\d{8}$/.test(line))
            || "";
    };

    try {
        const infoPromise = fetchDocument(pageUrls.info, "Billing Account Information");
        const billingPromise = fetchDocument(pageUrls.billing, "Billing Information");
        const contactPromise = infoPromise.then(async ({ source, sourceDocument }) => {
            const contactRecordId = getContactRecordId(sourceDocument, source);
            if (!/^\d+$/.test(contactRecordId)) {
                throw new Error("Le contactRecordId VTI est introuvable.");
            }
            const contactUrl = new URL("index.php", location.origin);
            contactUrl.searchParams.set("module", "Contacts");
            contactUrl.searchParams.set("view", "Detail");
            contactUrl.searchParams.set("record", contactRecordId);
            contactUrl.searchParams.set("mode", "showDetailViewByMode");
            contactUrl.searchParams.set("requestMode", "full");
            contactUrl.searchParams.set("tab_label", "Contact Details");
            const contactResult = await fetchDocument(contactUrl.href, "Contact Details");
            if (readRecordId(contactResult.sourceDocument) !== contactRecordId) {
                throw new Error("La page Contact Details ne correspond pas au contact demandé.");
            }
            return {
                contactRecordId,
                sourceDocument: contactResult.sourceDocument
            };
        });
        const [infoResult, billingResult, contactResult] = await Promise.all([
            infoPromise,
            billingPromise,
            contactPromise
        ]);
        if (readRecordId(infoResult.sourceDocument) !== String(recordId)) {
            throw new Error("La page Billing Account Information ne correspond pas au contractor demandé.");
        }
        if (readRecordId(billingResult.sourceDocument) !== String(recordId)) {
            throw new Error("La page Billing Information ne correspond pas au contractor demandé.");
        }
        const billingAccountText = documentText(infoResult.sourceDocument);
        const contractorNumber = contractorNumberFromText(billingAccountText);
        if (contractorNumber !== String(expectedContractorNumber)) {
            throw new Error("Le contractor chargé en arrière-plan ne correspond pas au contractor demandé.");
        }
        const contactDocument = contactResult.sourceDocument;

        return {
            ok: true,
            contractorNumber,
            billingAccountText,
            billingInformationText: documentText(billingResult.sourceDocument),
            contactInfo: {
                contactRecordId: contactResult.contactRecordId,
                title: textOf(contactDocument.querySelector(".recordLabel .salutation")),
                firstName: fieldValue(contactDocument, "Contacts_detailView_fieldValue_firstname")
                    || textOf(contactDocument.querySelector(".recordLabel .firstname")),
                lastName: fieldValue(contactDocument, "Contacts_detailView_fieldValue_lastname")
                    || textOf(contactDocument.querySelector(".recordLabel .lastname")),
                email: fieldValue(contactDocument, "Contacts_detailView_fieldValue_email"),
                communicationLanguage: fieldValue(
                    contactDocument,
                    "Contacts_detailView_fieldValue_communication_language"
                ),
                eligibilitySource: fieldValue(
                    contactDocument,
                    "Contacts_detailView_fieldValue_eligibility_source"
                ),
                eligibilityOrdering: fieldValue(
                    contactDocument,
                    "Contacts_detailView_fieldValue_eligibility_ordering"
                ),
                publicId: fieldValue(contactDocument, "Contacts_detailView_fieldValue_cf_public_id"),
                fixedNumber: fieldValue(contactDocument, "Contacts_detailView_fieldValue_cf_798"),
                mobileRaw: fieldValue(contactDocument, "Contacts_detailView_fieldValue_cf_800"),
                providerOrderRef: fieldValue(
                    contactDocument,
                    "Contacts_detailView_fieldValue_provider_order_ref"
                )
            }
        };
    } catch (error) {
        return {
            ok: false,
            code: String(error?.code || ""),
            error: String(error?.message || error || "Capture VTI en arrière-plan impossible.")
        };
    }
}

export async function captureVtiOfferPage(expectedRecordId, timeoutMs = 45000) {
    const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
    const clean = (value) => String(value || "").replace(/\s+/g, " ").trim();
    const textOf = (element) => clean(element?.innerText || element?.textContent || "");
    const readRecordId = () => clean(
        document.querySelector("#recordId")?.value
            || document.querySelector("#recordId")?.getAttribute?.("value")
    );
    const offerValue = (label) => {
        const requestedLabel = clean(label).toLowerCase();
        for (const row of [...document.querySelectorAll(".myrow")]) {
            const rowLabel = textOf(row.querySelector(".partieGauche")).toLowerCase();
            if (rowLabel === requestedLabel) {
                return textOf(row.querySelector(".partieDroite .value"));
            }
        }
        return "";
    };

    try {
        if (document.querySelector(
            'input[type="password"], input[name="user_name"], form[action*="Login" i]'
        )) {
            return {
                ok: false,
                code: "VTI_SESSION_REQUIRED",
                error: "La session VTI a expiré. Reconnecte-toi dans l’onglet VTI puis réessaie."
            };
        }
        if (readRecordId() !== String(expectedRecordId)) {
            throw new Error("Offer Management ne correspond pas au contractor demandé.");
        }
        const startedAt = Date.now();
        while (Date.now() - startedAt < timeoutMs) {
            const healthLink = document.querySelector('a[href*="mode=healthCheck"]')
                || [...document.querySelectorAll("a")].find((link) => (
                    /Health ?check|Healtcheck/i.test(textOf(link))
                ));
            if (healthLink) {
                const rawUrl = healthLink.getAttribute("href") || healthLink.href || "";
                const healthUrl = new URL(String(rawUrl).replaceAll("&amp;", "&"), location.href);
                const serviceId = healthUrl.searchParams.get("serviceId") || "";
                if (healthUrl.origin !== location.origin
                    || healthUrl.searchParams.get("record") !== String(expectedRecordId)
                    || !/^\d+$/.test(serviceId)) {
                    throw new Error("Le lien HealthCheck VTI est invalide.");
                }
                return {
                    ok: true,
                    healthUrl: healthUrl.href,
                    serviceId,
                    offerInfo: { activationDate: offerValue("Activation date") }
                };
            }
            await sleep(200);
        }
        return { ok: false, error: "HealthCheck introuvable après le chargement des offres." };
    } catch (error) {
        return {
            ok: false,
            code: String(error?.code || ""),
            error: String(error?.message || error || "Offer Management inaccessible.")
        };
    }
}

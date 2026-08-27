function assertBookmarkletSource(source, label) {
    const text = String(source || "").trim();
    if (!text.startsWith("javascript:(async()=>{") || !text.endsWith("})();")) {
        throw new Error(`${label} bookmarklet format is not supported.`);
    }
    return text;
}

function replaceRequired(source, searchValue, replacement, label) {
    if (!source.includes(searchValue)) {
        throw new Error(`Unable to build the extension: ${label} was not found.`);
    }
    return source.replace(searchValue, replacement);
}

function replaceSection(source, startMarker, endMarker, replacement, label) {
    const start = source.indexOf(startMarker);
    const end = source.indexOf(endMarker, start + startMarker.length);
    if (start < 0 || end < 0) {
        throw new Error(`Unable to build the extension: ${label} section was not found.`);
    }
    return `${source.slice(0, start)}${replacement}${source.slice(end)}`;
}

function wrapBookmarkletExpression(functionName, source) {
    const expression = source.replace(/^javascript:/, "").replace(/;$/, "");
    return `export async function ${functionName}() {\n    return await ${expression};\n}\n`;
}

export function buildSuperOfficeCaptureModule(bookmarkletSource) {
    let source = assertBookmarkletSource(bookmarkletSource, "SuperOffice");
    source = replaceSection(
        source,
        "const showToast=",
        "const all=",
        "const showToast=()=>{};",
        "SuperOffice visual feedback"
    );
    source = replaceRequired(
        source,
        "const firstPostAt=",
        "const contractorFromFirstPost=()=>{const message=messageDataList()[0];const messageRoot=all(\".HtmlMessages2_message,.HtmlMessage,[id*='HtmlMessages2_message'],article\").filter(el=>!isNoiseControl(el))[0];const raw=message?.text||message?.plainText||message?.bodyText||message?.body||message?.message||message?.content||message?.html||message?.bodyHtml||message?.messageHtml||message?.htmlBody||messageRoot?.innerText||\"\";let readable=String(raw);try{readable=new DOMParser().parseFromString(readable,\"text/html\").body?.textContent||readable}catch{}return readable.match(/\\bMSISDN\\s*:\\s*([0-9]+)\\b/i)?.[1]||null};const firstPostAt=",
        "SuperOffice first-post contractor extraction"
    );
    source = replaceRequired(
        source,
        "const data={ticketId,createdAt,firstPostAt:firstPostAt(),externalTicketId,attachments};",
        "const data={ticketId,createdAt,firstPostAt:firstPostAt(),externalTicketId,contractorNumber:contractorFromFirstPost(),attachments};",
        "SuperOffice contractor output"
    );
    const clipboardTail = "navigator.clipboard.writeText(JSON.stringify(data,null,2)).then(()=>showToast(\"JSON copié dans le presse-papiers\")).catch(()=>showToast(\"Erreur copie clipboard\"));";
    const transformed = replaceRequired(
        source,
        clipboardTail,
        "return data;",
        "SuperOffice clipboard output"
    );
    return wrapBookmarkletExpression("captureSuperOfficePage", transformed);
}

export function buildVtiCaptureModule(bookmarkletSource) {
    let source = assertBookmarkletSource(bookmarkletSource, "VTI");

    source = source.replace("let popup=null;", "");
    source = replaceSection(
        source,
        "function openPopupNow",
        "function setBar",
        "function openPopupNow(){}",
        "VTI popup"
    );
    source = replaceSection(
        source,
        "function setBar",
        "function fail",
        "function setBar(){}function show(){}function hide(){}function toast(){}",
        "VTI visual feedback"
    );
    source = replaceSection(
        source,
        "function fail",
        "function isBilling",
        "function fail(msg){hide();toast(\"Erreur : \"+msg);throw new Error(msg)}",
        "VTI failure handler"
    );
    source = replaceSection(
        source,
        "async function copyTextStrong",
        "async function readHealthFast",
        "",
        "VTI clipboard output"
    );
    source = replaceSection(
        source,
        "async function readHealthFast",
        "async function backToBilling",
        "async function readHealthFast(url){show(\"Analyse Healthcheck\",\"Chargement en arrière-plan…\",60);const response=await chrome.runtime.sendMessage({type:\"salt.capture.healthcheck.v1\",url});if(!response?.ok)throw new Error(response?.error||\"Healthcheck inaccessible.\");return response.text||\"\"}",
        "VTI Healthcheck reader"
    );

    const outputTail = "const json=JSON.stringify(parseJson(billingText+\"\\n\\n\"+healthText,contactInfo,offerInfo),null,2);show(\"Finalisation\",\"Copie du JSON dans le presse-papiers…\",88);const ok=await copyTextStrong(json);await backToBilling();hide();toast(ok?\"JSON copié dans le presse-papiers.\":\"Clipboard bloqué : copie manuelle requise.\");if(!ok)prompt(\"Copie le JSON ici :\",json)}catch(e){fail(e.message);console.error(e)}})();";
    const extensionTail = "const payload=parseJson(billingText+\"\\n\\n\"+healthText,contactInfo,offerInfo);show(\"Finalisation\",\"Transmission des données à l’application…\",88);await backToBilling();hide();toast(\"Données VTI capturées\");return payload}catch(e){hide();toast(\"Erreur : \"+(e?.message||e));console.error(e);throw e}})();";
    source = replaceRequired(source, outputTail, extensionTail, "VTI clipboard output tail");

    return wrapBookmarkletExpression("captureVtiPage", source);
}

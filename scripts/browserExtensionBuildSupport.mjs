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

const superOfficeDataExtraction = String.raw`
const readablePostText=value=>{let readable=String(value??"");try{readable=new DOMParser().parseFromString(readable,"text/html").body?.textContent||readable}catch{}return readable.replace(/\u00a0/g," ").trim()};
const superOfficePostTimestamp=value=>{const raw=String(value??"").trim();if(!raw)return null;const localDate=raw.match(/^(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{2,4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?/);if(localDate){let year=Number(localDate[3]);if(year<100)year+=2000;const month=Number(localDate[2]);const day=Number(localDate[1]);const hour=Number(localDate[4]||0);const minute=Number(localDate[5]||0);const second=Number(localDate[6]||0);const timestamp=Date.UTC(year,month-1,day,hour,minute,second);const parsed=new Date(timestamp);if(parsed.getUTCFullYear()===year&&parsed.getUTCMonth()===month-1&&parsed.getUTCDate()===day&&parsed.getUTCHours()===hour&&parsed.getUTCMinutes()===minute&&parsed.getUTCSeconds()===second)return timestamp}const timestamp=Date.parse(raw);return Number.isFinite(timestamp)?timestamp:null};
const orderedSuperOfficePostEntries=()=>messageDataList().map((message,index)=>{const date=msgDate(message);return{message,index,date,timestamp:superOfficePostTimestamp(date)}}).sort((left,right)=>{if(left.timestamp===null&&right.timestamp===null)return left.index-right.index;if(left.timestamp===null)return 1;if(right.timestamp===null)return-1;return left.timestamp-right.timestamp||left.index-right.index});
const firstSuperOfficePostEntry=()=>orderedSuperOfficePostEntries()[0]||{message:null,index:0,date:null,timestamp:null};
const superOfficeMessageValues=message=>[message?.text,message?.plainText,message?.bodyText,message?.body,message?.message,message?.content,message?.html,message?.bodyHtml,message?.messageHtml,message?.htmlBody].filter(value=>typeof value==="string"&&value.trim());
const findSuperOfficeMsisdn=messages=>{for(const message of messages){for(const value of superOfficeMessageValues(message)){const match=readablePostText(value).match(/\bMSISDN\s*:\s*(\d{8})(?!\d)/i);if(match)return match[1]}}return null};
const isSuperOfficeMessageDataReady=messages=>messages.length>0&&messages.every(message=>message?.bodyNotLoaded!==true&&superOfficeMessageValues(message).length>0);
const expandFirstSuperOfficePost=()=>{const ticketBlocks=window.HtmlMessages2_data;if(!ticketBlocks||typeof window.HtmlMessages2_buildHtml!=="function")return false;for(const [blockId,ticketData]of Object.entries(ticketBlocks)){const messages=Array.isArray(ticketData?.messages)?ticketData.messages:[];if(messages.length===0)continue;try{ticketData.numExpandedMessages=1;window.HtmlMessages2_buildHtml(blockId);return true}catch{return false}}return false};
const waitForSuperOfficeMsisdn=async()=>{let didRequestExpansion=false;for(let attempt=0;attempt<20;attempt+=1){const messages=messageDataList();const msisdn=findSuperOfficeMsisdn(messages);if(msisdn)return msisdn;if(isSuperOfficeMessageDataReady(messages))return null;if(!didRequestExpansion)didRequestExpansion=expandFirstSuperOfficePost();if(attempt<19)await sleep(100)}return null};
`;

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
        "const firstPostAt=()=>messageDataList().map(msgDate).find(Boolean)||null;",
        `${superOfficeDataExtraction}const firstPostAt=()=>firstSuperOfficePostEntry().date||null;`,
        "SuperOffice message-data extraction"
    );
    source = replaceRequired(
        source,
        "const data={ticketId,createdAt,firstPostAt:firstPostAt(),externalTicketId,attachments};",
        "const data={ticketId,createdAt,firstPostAt:firstPostAt(),externalTicketId,contractorNumber,attachments};",
        "SuperOffice contractor output"
    );
    source = replaceRequired(
        source,
        "await expandTicketPosts();const text=document.body.innerText;",
        "const contractorNumber=await waitForSuperOfficeMsisdn();const text=document.body.innerText;",
        "SuperOffice direct MSISDN lookup"
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

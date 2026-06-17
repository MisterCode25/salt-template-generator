import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseSuperOfficeInfoPayload } from "../src/utils/superOfficeImport.js";

const bookmarklet = readFileSync(new URL("../src/data/superOfficeBookmarklet.txt", import.meta.url), "utf8").trim();

function readAttributes(rawAttributes = "") {
  const attributes = {};
  for (const match of rawAttributes.matchAll(/([:\w-]+)=["']([^"']*)["']/g)) {
    attributes[match[1]] = match[2];
  }
  return attributes;
}

class FakeImageElement {
  constructor(attributes) {
    this.attributes = attributes;
    this.naturalWidth = Number(attributes.width || 160);
    this.naturalHeight = Number(attributes.height || 120);
  }

  getAttribute(name) {
    return this.attributes[name] ?? null;
  }
}

class FakeDOMParser {
  parseFromString(html) {
    const images = Array.from(String(html).matchAll(/<img\b([^>]*)>/gi))
      .map((match) => new FakeImageElement(readAttributes(match[1])))
      .filter((image) => image.getAttribute("src"));

    return {
      querySelectorAll(selector) {
        return selector === "img[src]" ? images : [];
      }
    };
  }
}

function withGlobal(name, value) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, name);
  Object.defineProperty(globalThis, name, {
    configurable: true,
    writable: true,
    value
  });

  return () => {
    if (descriptor) {
      Object.defineProperty(globalThis, name, descriptor);
    } else {
      delete globalThis[name];
    }
  };
}

{
  let copiedText = "";
  const restoreGlobals = [
    withGlobal("window", {
      HtmlMessages2_data: {
        ticketMessages: {
          messages: [
            {
              id: "message-1",
              createdAt: "13.06.2026 14:45",
              bodyHtml: '<p>Client photo <img src="/inline/image?id=42" alt="Inline OTO photo"></p>',
              attachments: [
                {
                  name: "regular-attachment.jpg",
                  url: "/download/regular-attachment.jpg",
                  size: "1.2 MB"
                }
              ]
            }
          ]
        }
      }
    }),
    withGlobal("document", {
      body: {
        innerText: "REQUEST 31436062\nExternal ticket ID:\n",
        appendChild() {}
      },
      createElement() {
        return {
          style: {},
          remove() {}
        };
      },
      querySelectorAll() {
        return [];
      }
    }),
    withGlobal("location", { origin: "https://superoffice.example.test" }),
    withGlobal("navigator", {
      clipboard: {
        async writeText(text) {
          copiedText = text;
        }
      }
    }),
    withGlobal("requestAnimationFrame", (callback) => callback()),
    withGlobal("setTimeout", () => 0),
    withGlobal("DOMParser", FakeDOMParser)
  ];

  try {
    assert.ok(bookmarklet.startsWith("javascript:"));
    Function(bookmarklet.replace(/^javascript:/, ""))();
    await Promise.resolve();

    const payload = JSON.parse(copiedText);
    assert.equal(payload.ticketId, "31436062");
    assert.equal(payload.attachments.length, 2);

    const inlineImage = payload.attachments.find((attachment) => attachment.name === "Inline OTO photo");
    assert.ok(inlineImage);
    assert.equal(inlineImage.url, "https://superoffice.example.test/inline/image?id=42");
    assert.equal(inlineImage.type, "image");
    assert.equal(inlineImage.messageId, "message-1");
    assert.equal(inlineImage.date, "13.06.2026 14:45");

    const parsed = parseSuperOfficeInfoPayload(payload);
    assert.equal(parsed.ok, true);
    assert.equal(parsed.imageAttachments.length, 2);
  } finally {
    restoreGlobals.reverse().forEach((restore) => restore());
  }
}

console.log("superOfficeBookmarklet tests passed");

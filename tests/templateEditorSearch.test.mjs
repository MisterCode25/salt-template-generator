import assert from "node:assert/strict";
import {
    buildTemplateEditorSearchText,
    filterTemplateEditorTree
} from "../src/utils/templateEditorSearch.js";

const nodes = [
    { id: "root", parentId: null, title: "Internet" },
    { id: "fiber", parentId: "root", title: "Fibre" },
    { id: "mobile", parentId: null, title: "Mobile" }
];
const templates = [
    {
        id: "lost",
        nodeIds: ["fiber"],
        title: "Connexion perdue",
        description: "Diagnostic fibre",
        contentByChannel: { email: { text_fr: "Vérifier le signal optique" } }
    },
    {
        id: "sms",
        nodeIds: ["mobile"],
        title: "Rappel client",
        contentByChannel: { sms: { text_fr: "Nous vous rappelons demain" } }
    }
];

assert.match(buildTemplateEditorSearchText(templates[0]), /verifier le signal optique/);

{
    const result = filterTemplateEditorTree(nodes, templates, "connexion");
    assert.deepEqual(result.templates.map((template) => template.id), ["lost"]);
    assert.deepEqual(result.nodes.map((node) => node.id), ["root", "fiber"]);
    assert.equal(result.matchCount, 1);
}

{
    const result = filterTemplateEditorTree(nodes, templates, "VÉRIFIER");
    assert.deepEqual(result.templates.map((template) => template.id), ["lost"]);
}

{
    const result = filterTemplateEditorTree(nodes, templates, "inexistant");
    assert.deepEqual(result.nodes, []);
    assert.deepEqual(result.templates, []);
    assert.equal(result.matchCount, 0);
}

{
    const result = filterTemplateEditorTree(nodes, templates, "  ");
    assert.equal(result.nodes, nodes);
    assert.equal(result.templates, templates);
}

console.log("templateEditorSearch tests passed");

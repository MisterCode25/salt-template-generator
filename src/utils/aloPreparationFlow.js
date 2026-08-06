export const ALO_TYPE_OPTIONS = Object.freeze([
    { value: "noSignal", label: "No signal" },
    { value: "lowBadRxTx", label: "Low / bad RX TX" }
]);

export const ALO_SIGNAL_OPTIONS = Object.freeze([
    { value: "lost", label: "Lost" },
    { value: "never", label: "Never" }
]);

export function buildAloPreparationSteps({
    signalState = "",
    hasTemplates = false
} = {}) {
    const steps = [
        { key: "aloType", kind: "choice", title: "Type", options: ALO_TYPE_OPTIONS },
        {
            key: "selectedTemplateId",
            kind: "template",
            title: "Import template",
            hasTemplates
        },
        { key: "signalState", kind: "choice", title: "Signal state", options: ALO_SIGNAL_OPTIONS }
    ];

    steps.push({
        key: signalState === "never" ? "activationDate" : "disconnectionDate",
        kind: "input",
        title: signalState === "never" ? "Activation date" : "Disconnection date",
        inputType: "date"
    });

    return steps;
}

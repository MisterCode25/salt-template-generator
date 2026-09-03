async function restoreAutoDiscardable(tabsApi, tabId, autoDiscardable) {
    try {
        await tabsApi.update(tabId, { autoDiscardable });
    } catch {
        // The capture tab may have been closed while the workflow was running.
    }
}

async function restorePreviouslyActiveTab(tabsApi, targetTabId, previousActiveTab) {
    if (!previousActiveTab?.id || previousActiveTab.id === targetTabId) return;

    try {
        const [currentActiveTab] = await tabsApi.query({
            active: true,
            windowId: previousActiveTab.windowId
        });
        if (currentActiveTab?.id === targetTabId) {
            await tabsApi.update(previousActiveTab.id, { active: true });
        }
    } catch {
        // Respect a closed tab or window without hiding the capture result.
    }
}

export async function withTemporarilyActiveTab(tabsApi, tabId, action) {
    if (!tabsApi || typeof action !== "function") {
        throw new TypeError("A tabs API and capture action are required.");
    }

    const targetTab = await tabsApi.get(tabId);
    const [previousActiveTab] = await tabsApi.query({
        active: true,
        windowId: targetTab.windowId
    });
    const previousAutoDiscardable = targetTab.autoDiscardable !== false;
    let isCaptureTabPrepared = false;

    try {
        await tabsApi.update(tabId, {
            active: true,
            autoDiscardable: false
        });
        isCaptureTabPrepared = true;
        return await action();
    } finally {
        if (isCaptureTabPrepared) {
            await restoreAutoDiscardable(
                tabsApi,
                tabId,
                previousAutoDiscardable
            );
            await restorePreviouslyActiveTab(
                tabsApi,
                tabId,
                previousActiveTab
            );
        }
    }
}

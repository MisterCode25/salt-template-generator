import { lazy, Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import PageHeader from "./components/PageHeader.jsx";
import { applyTheme, loadThemePreference, watchSystemThemePreference } from "./utils/theme.js";

const Templates = lazy(() => import("./pages/Templates.jsx"));
const ManageNodes = lazy(() => import("./pages/ManageNodes.jsx"));
const ManageTokens = lazy(() => import("./pages/ManageTokens.jsx"));
const ManageTools = lazy(() => import("./pages/ManageTools.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));
const ExternalGenerator = lazy(() => import("./pages/ExternalGenerator.jsx"));

function ManageNodesPage() {
    return <ManageNodes />;
}

function ManageTokensPage() {
    return (
        <>
            <PageHeader title="Custom Tokens" />
            <ManageTokens customOnly />
        </>
    );
}

function ExternalGeneratorPage() {
    return (
        <>
            <PageHeader title="Generate external ID" />
            <ExternalGenerator />
        </>
    );
}

function VtiBookmarkletPage() {
    return (
        <>
            <PageHeader title="Tools + Shortcuts" />
            <ManageTools initialSection="shortcuts" />
        </>
    );
}

function ManageToolsPage() {
    return (
        <>
            <PageHeader title="Tools + Shortcuts" />
            <ManageTools />
        </>
    );
}

export default function App() {
    useEffect(() => {
        let cancelled = false;
        const applyStoredTheme = async () => {
            const preference = await loadThemePreference();
            if (!cancelled) applyTheme(preference, { persist: false });
        };
        applyStoredTheme();
        const unsubscribe = watchSystemThemePreference(applyStoredTheme);
        return () => {
            cancelled = true;
            unsubscribe();
        };
    }, []);

    return (
        <Suspense fallback={null}>
            <Routes>
                <Route path="/" element={<Templates />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/nodes" element={<ManageNodesPage />} />
                <Route path="/tokens" element={<ManageTokensPage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/external-generator" element={<ExternalGeneratorPage />} />
                <Route path="/vti-bookmarklet" element={<VtiBookmarkletPage />} />
                <Route path="/tools" element={<ManageToolsPage />} />
            </Routes>
        </Suspense>
    );
}

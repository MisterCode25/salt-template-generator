import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
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

function AppLoading() {
    return (
        <main className="app-recovery-page">
            <section className="app-recovery-card">
                <p className="eyebrow">Loading</p>
                <h1>Opening workspace...</h1>
            </section>
        </main>
    );
}

function AppErrorFallback({ error, reset }) {
    const message = error?.message || "Unexpected interface error.";

    return (
        <main className="app-recovery-page">
            <section className="app-recovery-card">
                <p className="eyebrow">Interface error</p>
                <h1>The app view could not be rendered.</h1>
                <p>{message}</p>
                <div className="app-recovery-actions">
                    <button type="button" className="secondary-btn" onClick={reset}>Try again</button>
                    <button type="button" className="primary-btn" onClick={() => window.location.reload()}>Reload app</button>
                </div>
            </section>
        </main>
    );
}

export default function App() {
    const location = useLocation();

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
        <ErrorBoundary
            resetKey={location.pathname}
            fallback={({ error, reset }) => <AppErrorFallback error={error} reset={reset} />}
        >
            <Suspense fallback={<AppLoading />}>
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
        </ErrorBoundary>
    );
}

import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import ManageNodes from "./pages/ManageNodes.jsx";
import ManageTokens from "./pages/ManageTokens.jsx";
import ManageTools from "./pages/ManageTools.jsx";
import Templates from "./pages/Templates.jsx";
import Settings from "./pages/Settings.jsx";
import ExternalGenerator from "./pages/ExternalGenerator.jsx";
import VtiBookmarklet from "./pages/VtiBookmarklet.jsx";
import PageHeader from "./components/PageHeader.jsx";
import { applyTheme, getInitialTheme } from "./utils/theme.js";

function ManageNodesPage() {
    return <ManageNodes />;
}

function ManageTokensPage() {
    return (
        <>
            <PageHeader title="Manage Tokens" />
            <ManageTokens />
        </>
    );
}

function ExternalGeneratorPage() {
    return (
        <>
            <PageHeader title="External Generator" />
            <ExternalGenerator />
        </>
    );
}

function VtiBookmarkletPage() {
    return (
        <>
            <PageHeader title="VTI Shortcut" />
            <VtiBookmarklet />
        </>
    );
}

function ManageToolsPage() {
    return (
        <>
            <PageHeader title="Manage Tools" />
            <ManageTools />
        </>
    );
}

export default function App() {
    useEffect(() => {
        applyTheme(getInitialTheme());
    }, []);

    return (
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
    );
}

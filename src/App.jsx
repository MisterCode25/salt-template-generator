import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ManageTemplates from "./pages/ManageTemplates.jsx";
import ManageTokens from "./pages/ManageTokens.jsx";
import Settings from "./pages/Settings.jsx";
import ExternalGenerator from "./pages/ExternalGenerator.jsx";
import VtiBookmarklet from "./pages/VtiBookmarklet.jsx";
import PageHeader from "./components/PageHeader.jsx";
import { applyTheme, getInitialTheme } from "./utils/theme.js";

function ManageTemplatesPage() {
    return (
        <>
            <PageHeader title="Manage Templates" />
            <ManageTemplates />
        </>
    );
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

export default function App() {
    useEffect(() => {
        applyTheme(getInitialTheme());
    }, []);

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/templates" element={<ManageTemplatesPage />} />
            <Route path="/tokens" element={<ManageTokensPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/external-generator" element={<ExternalGeneratorPage />} />
            <Route path="/vti-bookmarklet" element={<VtiBookmarkletPage />} />
        </Routes>
    );
}

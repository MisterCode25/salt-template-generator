import { Link } from "react-router-dom";

export default function PageHeader({ title }) {
    return (
        <header className="app-header">
            <nav className="top-menu">
                <Link to="/" className="back-link">← Back</Link>
            </nav>
            <div className="app-title">{title}</div>
        </header>
    );
}

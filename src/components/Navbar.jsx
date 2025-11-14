import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
    const { pathname } = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const active = (path) => {
        if (path === "/") {
            return pathname === "/" ? "active" : "";
        }
        // For /games, only match exactly /games, not /games/easy or /games/normal
        if (path === "/games") {
            return pathname === "/games" ? "active" : "";
        }
        return pathname === path || pathname.startsWith(path + "/") ? "active" : "";
    };

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="site-header">
            <div className="container header-inner">
                <Link to="/" className="brand">Sudoku Arcade</Link>

                <button
                    type="button"
                    className="nav-toggle"
                    aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
                    aria-expanded={isMenuOpen}
                    onClick={toggleMenu}
                >
                    <span />
                    <span />
                    <span />
                </button>

                <nav className={`site-nav ${isMenuOpen ? "is-open" : ""}`} aria-label="Primary">
                    <button
                        type="button"
                        className="nav-close"
                        aria-label="Close navigation"
                        onClick={closeMenu}
                    >
                        ×
                    </button>
                    <ul className="nav-list">
                        <li><Link to="/" className={active("/")}>Home</Link></li>
                        <li><Link to="/games" className={active("/games")}>Selection</Link></li>
                        <li><Link to="/games/normal" className={active("/games/normal")}>Normal</Link></li>
                        <li><Link to="/games/easy" className={active("/games/easy")}>Easy</Link></li>
                        <li><Link to="/rules" className={active("/rules")}>Rules</Link></li>
                        <li><Link to="/scores" className={active("/scores")}>High Scores</Link></li>
                        <li><Link to="/login" className={active("/login")}>Login</Link></li>
                        <li><Link to="/register" className={active("/register")}>Register</Link></li>
                    </ul>
                </nav>
            </div>
            <div
                className={`nav-overlay ${isMenuOpen ? "visible" : ""}`}
                role="presentation"
                onClick={closeMenu}
            />
        </header>
    );
}

import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
    const { pathname } = useLocation();
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

    return (
        <header className="site-header">
            <div className="container header-inner">
                <Link to="/" className="brand">Sudoku Arcade</Link>
                <nav className="site-nav" aria-label="Primary">
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
        </header>
    );
}

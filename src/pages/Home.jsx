import { Link } from "react-router-dom";
import "../styles/common.css";
import "../styles/home.css";

export default function Home() {
    return (
        <>
            <main className="container">
                <section className="hero">
                    <div className="hero-text">
                        <h1 className="page-title">Welcome to <span className="brand-mark">Sudoku Arcade</span></h1>
                        <p className="lead">A simple puzzle hub — pick a mode and start exploring.</p>
                    </div>
                    <div className="hero-media">
                        <img src="/assets/img/Sudoku.svg" alt="A simple Sudoku Arcade illustration" />
                    </div>
                </section>

                <section className="links">
                    <h2 className="section-title">Explore</h2>
                    <ul className="link-grid">
                        <li>
                            <h3>Selection</h3>
                            <p>Browse game titles and authors.</p>
                            <Link to="/games">Go to Selection</Link>
                        </li>

                        <li>
                            <h3>Normal 9×9</h3>
                            <p>Try a classic 9×9 board.</p>
                            <Link to="/games/normal">Open Normal</Link>
                        </li>

                        <li>
                            <h3>Easy 6×6</h3>
                            <p>Warm up with a 6×6 grid.</p>
                            <Link to="/games/easy">Open Easy</Link>
                        </li>

                        <li>
                            <h3>Rules &amp; Credits</h3>
                            <p>How it works and who made it.</p>
                            <Link to="/rules">See Rules</Link>
                        </li>

                        <li>
                            <h3>High Scores</h3>
                            <p>Check the high score board.</p>
                            <Link to="/scores">View Scores</Link>
                        </li>

                        <li>
                            <h3>Login / Register</h3>
                            <p>Sign in or create an account.</p>
                            <Link to="/login">Login</Link> · <Link to="/register">Register</Link>
                        </li>
                    </ul>
                </section>
            </main>

            <footer className="site-footer">
                <div className="container">
                    <p>© 2025 Sudoku Arcade · CS5610 Web Development · by Xihao Liu</p>
                </div>
            </footer>
        </>
    );
}
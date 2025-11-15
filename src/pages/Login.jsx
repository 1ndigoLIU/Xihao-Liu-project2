import { Link } from "react-router-dom";
import "../styles/common.css";
import "../styles/login.css";

export default function Login() {
    return (
        <>
            <main className="container">
                <section className="page-head">
                    <h1 className="page-title">Login</h1>
                    <p className="lead">Sign in to continue.</p>
                </section>

                <section className="auth">
                    <form 
                        className="form" 
                        onSubmit={(e) => {
                            e.preventDefault();
                            // Mock form submission, no actual functionality
                        }}
                        aria-label="Login form"
                    >
                        <div className="field">
                            <label htmlFor="username">Username</label>
                            <input id="username" name="username" type="text" placeholder="yourname" />
                        </div>

                        <div className="field">
                            <label htmlFor="password">Password</label>
                            <input id="password" name="password" type="password" placeholder="••••••••" />
                        </div>

                        <button type="submit" className="btn-submit">Sign In</button>
                    </form>

                    <p className="hint">
                        Don't have an account?{" "}
                        <Link to="/register">Create one</Link>.
                    </p>
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

import { Link } from "react-router-dom";
import "../styles/common.css";
import "../styles/register.css";

export default function Register() {
    return (
        <>
            <main className="container">
                <section className="page-head">
                    <h1 className="page-title">Create an account</h1>
                    <p className="lead">Create your Sudoku Arcade account to enjoy the game and save your records.</p>
                </section>

                <section className="auth">
                    <form 
                        className="form" 
                        onSubmit={(e) => {
                            e.preventDefault();
                            // Mock form submission - no actual functionality
                        }}
                        aria-label="Register form"
                    >
                        <div className="field">
                            <label htmlFor="reg-username">Username</label>
                            <input id="reg-username" name="username" type="text" placeholder="yourname" />
                        </div>

                        <div className="field">
                            <label htmlFor="reg-password">Password</label>
                            <input id="reg-password" name="password" type="password" placeholder="••••••••" />
                        </div>

                        <div className="field">
                            <label htmlFor="reg-password2">Verify password</label>
                            <input id="reg-password2" name="password_verify" type="password" placeholder="••••••••" />
                        </div>

                        <button type="submit" className="btn-submit">Create Account</button>
                    </form>

                    <p className="hint">
                        Already have an account?{" "}
                        <Link to="/login">Sign in</Link>.
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

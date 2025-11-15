import "../styles/common.css";
import "../styles/rules.css";

export default function Rules() {
    return (
        <>
            <main className="container">
                <section className="page-head">
                    <h1 className="page-title">Rules</h1>
                    <p className="lead">How to play a standard Sudoku-style puzzle.</p>
                </section>

                <section className="rules">
                    <h2>Basic rules</h2>
                    <ol className="rule-list">
                        <li>Fill the grid so that each <strong>row</strong> contains the allowed digits without repetition.</li>
                        <li>Each <strong>column</strong> must also contain the allowed digits without repetition.</li>
                        <li>Each outlined <strong>subgrid</strong> (3×3 on 9×9, 2×3 on 6×6) must contain the allowed digits without repetition.</li>
                        <li><strong>Given cells</strong> (prefilled numbers) are fixed and cannot be changed.</li>
                        <li>Use logic and deduction—no guessing required for a valid puzzle.</li>
                    </ol>
                </section>

                <section className="tips">
                    <h2>Tips</h2>
                    <ul>
                        <li>Scan rows, columns, and subgrids to find unique candidates.</li>
                        <li>Start with cells that have the fewest possibilities.</li>
                        <li>Keep notes on paper if you like—this site shows only a static mock.</li>
                    </ul>
                </section>

                <section className="credits">
                    <h2>Made by</h2>
                    <p>
                        Sudoku Arcade · CS5610 Web Development · by <strong>Xihao Liu</strong>
                    </p>
                    <ul className="credit-links">
                        <li>Email: <a href="mailto:liu.xiha@northeastern.edu">liu.xiha@northeastern.edu</a></li>
                        <li>GitHub: <a href="https://github.com/1ndigoLIU" target="_blank" rel="noopener noreferrer">github.com/1ndigoLIU</a></li>
                        <li>LinkedIn: <a href="https://www.linkedin.com/in/xihao-liu" target="_blank" rel="noopener noreferrer">linkedin.com/in/xihao-liu</a></li>
                    </ul>

                    <h3>Credits</h3>
                    <p>
                        <a href="https://www.northeastern.edu/" target="_blank" rel="noopener noreferrer">
                            <img src="/assets/img/neu-logo.png" alt="Northeastern University logo" className="school-logo" />
                        </a>
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

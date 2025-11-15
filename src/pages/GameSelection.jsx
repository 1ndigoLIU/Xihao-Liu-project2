import { Link } from "react-router-dom";
import "../styles/common.css";
import "../styles/selection.css";

export default function GameSelection() {
    const games = [
        { title: "Midnight Grid", author: "Aria Bennett", link: "/games/normal" },
        { title: "Ninefold Echo", author: "Leo Chambers", link: "/games/normal" },
        { title: "Cobalt Squares", author: "Mina Park", link: "/games/normal" },
        { title: "Silent Logic", author: "Owen Patel", link: "/games/normal" },
        { title: "Ivory Lattice", author: "Sienna Brooks", link: "/games/normal" },
        { title: "Polar Night", author: "Noah Zhang", link: "/games/normal" },
        { title: "Golden Ratio", author: "Lara Ortega", link: "/games/normal" },
        { title: "Zen Nine", author: "Kai Nakamura", link: "/games/normal" },
        { title: "Seaside Puzzle", author: "Riley Carter", link: "/games/normal" },
        { title: "Starlit Board", author: "June Morales", link: "/games/normal" },
    ];

    return (
        <>
            <main className="container">
                <section className="page-head">
                    <h1 className="page-title">Game Selection</h1>
                    <p className="lead">Pick a title below to open game.</p>
                </section>

                <div className="table-wrap">
                    <table className="game-table">
                        <thead>
                            <tr>
                                <th scope="col">Title</th>
                                <th scope="col">Author</th>
                            </tr>
                        </thead>
                        <tbody>
                            {games.map((game, index) => (
                                <tr key={index}>
                                    <td><Link to={game.link}>{game.title}</Link></td>
                                    <td>{game.author}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            <footer className="site-footer">
                <div className="container">
                    <p>© 2025 Sudoku Arcade · CS5610 Web Development · by Xihao Liu</p>
                </div>
            </footer>
        </>
    );
}

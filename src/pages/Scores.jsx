import "../styles/common.css";
import "../styles/high-scores.css";

export default function Scores() {
    const scores = [
        { rank: 1, username: "1ndiGO", completed: 128 },
        { rank: 2, username: "AokiUmi", completed: 117 },
        { rank: 3, username: "erre", completed: 109 },
        { rank: 4, username: "Cong", completed: 98 },
        { rank: 5, username: "MrSiri", completed: 92 },
        { rank: 6, username: "TAY", completed: 87 },
        { rank: 7, username: "icey", completed: 80 },
        { rank: 8, username: "BlackKnife", completed: 74 },
        { rank: 9, username: "iris", completed: 69 },
        { rank: 10, username: "ogidni", completed: 66 },
    ];

    return (
        <>
            <main className="container">
                <section className="page-head">
                    <h1 className="page-title">High Scores</h1>
                    <p className="lead">Top players and their completed sudokus.</p>
                </section>

                <div className="table-wrap">
                    <table className="score-table" aria-label="High score leaderboard">
                        <thead>
                            <tr>
                                <th scope="col">Rank</th>
                                <th scope="col">Username</th>
                                <th scope="col">Completed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scores.map((score) => (
                                <tr key={score.rank}>
                                    <td>{score.rank}</td>
                                    <td>{score.username}</td>
                                    <td>{score.completed}</td>
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

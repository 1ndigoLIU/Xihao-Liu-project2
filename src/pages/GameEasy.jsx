import GamePage from "../components/GamePage";
import "../styles/common.css";
import "../styles/game-easy.css";

export default function GameEasy() {
    return (
        <GamePage
            size={6}
            title="Sudoku Easy — 6×6"
            cssFile="game-easy.css"
        />
    );
}

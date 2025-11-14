import GamePage from "../components/GamePage";
import "../styles/common.css";
import "../styles/game-hard.css";

export default function GameNormal() {
    return (
        <GamePage
            size={9}
            title="Sudoku Normal — 9×9"
            cssFile="game-hard.css"
        />
    );
}

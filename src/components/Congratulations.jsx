import { formatTime } from '../utils/timeFormatter';

/**
 * Congratulations message component
 * Displayed when the game is completed
 */
export default function Congratulations({ time }) {
    return (
        <div className="congratulations">
            <h2>🎉 Congratulations! 🎉</h2>
            <p>You completed the Sudoku puzzle in <strong>{formatTime(time)}</strong>!</p>
        </div>
    );
}


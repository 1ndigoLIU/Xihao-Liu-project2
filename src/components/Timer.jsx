import { formatTime } from '../utils/timeFormatter';

/**
 * Timer component
 * Displays elapsed time in MM:SS format
 */
export default function Timer({ seconds }) {
    return (
        <div className="timer" aria-label="Timer">
            Time: <strong>{formatTime(seconds)}</strong>
        </div>
    );
}


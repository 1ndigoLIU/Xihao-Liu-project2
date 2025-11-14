/**
 * Game control buttons component
 * Hint, New Game and Reset buttons
 */
export default function GameControls({ onHint, onNewGame, onReset, isComplete }) {
    return (
        <div className="game-controls">
            <button 
                type="button" 
                className="btn-hint"
                onClick={onHint}
                disabled={isComplete}
            >
                Hint
            </button>
            <button 
                type="button" 
                className="btn-new-game"
                onClick={onNewGame}
            >
                New Game
            </button>
            <button 
                type="button" 
                className="btn-reset"
                onClick={onReset}
            >
                Reset
            </button>
        </div>
    );
}


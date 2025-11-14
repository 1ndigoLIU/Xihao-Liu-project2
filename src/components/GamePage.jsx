import { useEffect, useRef } from "react";
import { useSudoku } from "../context/SudokuContext";
import SudokuBoard from "./SudokuBoard";
import Timer from "./Timer";
import GameControls from "./GameControls";
import Congratulations from "./Congratulations";
import { hasSavedGameState } from "../utils/localStorageUtils";
import "../styles/common.css";

/**
 * Reusable game page component
 * Used by both Easy and Normal game pages
 * @param {number} size - Game board size (6 or 9)
 * @param {string} title - Page title to display
 */
export default function GamePage({ size, title }) {
    const {
        board,
        size: gameSize,
        givenCells,
        selectedCell,
        invalidCells,
        hintCell,
        timer,
        isComplete,
        setGameSize,
        newGame,
        resetGame,
        updateCell,
        setSelectedCell,
        showHint,
        clearHint,
    } = useSudoku();

    const hasInitializedRef = useRef(false);

    // Initialize game size on mount - this must happen first and synchronously
    useEffect(() => {
        // Set size immediately to prevent Context from loading wrong state
        setGameSize(size);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Generate new game when size is set, but only if there's no saved game state
    useEffect(() => {
        // Skip if we've already initialized
        if (hasInitializedRef.current) {
            return;
        }

        // Only proceed if gameSize matches the page size (ensures correct size is set)
        if (gameSize === size && (size === 6 || size === 9)) {
            // Check if there's a saved game state for THIS specific size
            const hasSavedState = hasSavedGameState(size);
            
            if (!hasSavedState) {
                // Only generate new game if there's no saved state
                hasInitializedRef.current = true;
                newGame();
            } else {
                // If there's a saved state, just mark as initialized
                // The saved state will be loaded by the Context (which validates size)
                hasInitializedRef.current = true;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameSize, size]);

    const handleCellSelect = (row, col) => {
        if (!isComplete) {
            setSelectedCell([row, col]);
        }
    };

    const handleCellChange = (row, col, value) => {
        if (!isComplete) {
            updateCell(row, col, value);
            // Clear hint when user makes a change
            if (hintCell) {
                clearHint();
            }
        }
    };

    const handleHint = () => {
        if (!isComplete) {
            showHint();
        }
    };

    if (!board) {
        return <div>Loading...</div>;
    }

    // Determine game type class based on size
    const gameTypeClass = size === 6 ? 'game-easy' : 'game-normal';

    return (
        <>
            <main className={`container ${gameTypeClass}`}>
                <div className="game-content">
                    <section className="page-head">
                        <h1 className="page-title">{title}</h1>
                        <Timer seconds={timer} />
                    </section>

                    {isComplete && <Congratulations time={timer} />}

                    <SudokuBoard
                        board={board}
                        size={gameSize}
                        givenCells={givenCells}
                        selectedCell={selectedCell}
                        invalidCells={invalidCells}
                        hintCell={hintCell}
                        onCellSelect={handleCellSelect}
                        onCellChange={handleCellChange}
                    />

                    <GameControls
                        onHint={handleHint}
                        onNewGame={newGame}
                        onReset={resetGame}
                        isComplete={isComplete}
                    />
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


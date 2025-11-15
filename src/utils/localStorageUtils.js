/**
 * Local Storage utilities for Sudoku game state persistence
 * Handles saving and loading game state for Easy (6x6) and Normal (9x9) games separately
 */
const STORAGE_KEYS = {
    EASY: 'sudoku_game_state_easy',
    NORMAL: 'sudoku_game_state_normal',
};

/**
 * Get storage key based on game size
 * @param {number} size - Game board size (6 for easy, 9 for normal)
 * @returns {string} Storage key
 */
function getStorageKey(size) {
    return size === 6 ? STORAGE_KEYS.EASY : STORAGE_KEYS.NORMAL;
}

/**
 * Save game state to localStorage
 * @param {Object} state - Game state object
 * @param {number} size - Game board size
 */
export function saveGameState(state, size) {
    try {
        const storageKey = getStorageKey(size);
        const stateToSave = {
            board: state.board,
            solution: state.solution,
            givenCells: state.givenCells,
            size: state.size,
            selectedCell: state.selectedCell,
            invalidCells: state.invalidCells,
            isComplete: state.isComplete,
            timer: state.timer,
            isTimerRunning: state.isTimerRunning,
            // hintCell is not saved - hints should not persist across sessions
        };
        localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (error) {
        console.error('Failed to save game state to localStorage:', error);
    }
}

/**
 * Load game state from localStorage
 * @param {number} size - Game board size
 * @returns {Object|null} Saved game state or null if not found
 */
export function loadGameState(size) {
    try {
        // Validate size parameter
        if (size !== 6 && size !== 9) {
            return null;
        }
        
        const storageKey = getStorageKey(size);
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
            const parsed = JSON.parse(savedData);
            // Validate that the loaded state matches the requested size
            // Also validate board dimensions match
            if (parsed.size === size && parsed.board && parsed.board.length === size) {
                return parsed;
            }
        }
        return null;
    } catch (error) {
        console.error('Failed to load game state from localStorage:', error);
        return null;
    }
}

/**
 * Clear game state from localStorage
 * @param {number} size - Game board size
 */
export function clearGameState(size) {
    try {
        const storageKey = getStorageKey(size);
        localStorage.removeItem(storageKey);
    } catch (error) {
        console.error('Failed to clear game state from localStorage:', error);
    }
}

/**
 * Check if there's a saved game state
 * @param {number} size - Game board size
 * @returns {boolean} True if saved state exists
 */
export function hasSavedGameState(size) {
    try {
        const storageKey = getStorageKey(size);
        return localStorage.getItem(storageKey) !== null;
    } catch (error) {
        console.error('Failed to check saved game state:', error);
        return false;
    }
}


import { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { generatePuzzle, isBoardComplete, getInvalidCells } from '../utils/sudokuGenerator';
import { findHintCell } from '../utils/hintUtils';
import { saveGameState, loadGameState, clearGameState } from '../utils/localStorageUtils';

const SudokuContext = createContext();

// Action types
const ACTIONS = {
    SET_BOARD: 'SET_BOARD',
    UPDATE_CELL: 'UPDATE_CELL',
    SET_SELECTED_CELL: 'SET_SELECTED_CELL',
    NEW_GAME: 'NEW_GAME',
    RESET_GAME: 'RESET_GAME',
    SET_GAME_SIZE: 'SET_GAME_SIZE',
    TICK_TIMER: 'TICK_TIMER',
    RESET_TIMER: 'RESET_TIMER',
    SET_GAME_COMPLETE: 'SET_GAME_COMPLETE',
    SHOW_HINT: 'SHOW_HINT',
    CLEAR_HINT: 'CLEAR_HINT',
    LOAD_GAME_STATE: 'LOAD_GAME_STATE',
};

// Initial state
const initialState = {
    board: null,
    solution: null,
    givenCells: [],
    size: 9,
    selectedCell: null,
    invalidCells: [],
    isComplete: false,
    timer: 0, // in seconds
    isTimerRunning: false,
    hintCell: null, // [row, col] or null
};

// Reducer
function sudokuReducer(state, action) {
    switch (action.type) {
        case ACTIONS.SET_GAME_SIZE:
            return {
                ...state,
                size: action.payload,
            };

        case ACTIONS.NEW_GAME: {
            const { puzzle, solution, givenCells } = generatePuzzle(state.size);
            return {
                ...state,
                board: puzzle,
                solution,
                givenCells,
                selectedCell: null,
                invalidCells: [],
                isComplete: false,
                timer: 0,
                isTimerRunning: true,
                hintCell: null,
            };
        }

        case ACTIONS.RESET_GAME: {
            // Reset board to initial puzzle state (only given cells filled)
            const resetBoard = state.board.map(row => row.map(() => null));
            if (state.solution) {
                state.givenCells.forEach(([r, c]) => {
                    resetBoard[r][c] = state.solution[r][c];
                });
            }
            
            return {
                ...state,
                board: resetBoard,
                selectedCell: null,
                invalidCells: [],
                isComplete: false,
                timer: 0,
                isTimerRunning: true,
                hintCell: null,
            };
        }

        case ACTIONS.SET_BOARD:
            return {
                ...state,
                board: action.payload,
            };

        case ACTIONS.UPDATE_CELL: {
            const { row, col, value } = action.payload;
            const newBoard = state.board.map(r => [...r]);
            
            // Only allow numbers in valid range
            if (value === '' || value === null) {
                newBoard[row][col] = null;
            } else {
                const num = parseInt(value, 10);
                if (!isNaN(num) && num >= 1 && num <= state.size) {
                    newBoard[row][col] = num;
                } else {
                    // Invalid number, don't update
                    return state;
                }
            }

            // Check for invalid cells (only player-input cells, not given cells)
            const invalidCells = getInvalidCells(newBoard, state.size, state.givenCells);
            
            // Check if complete
            const isComplete = isBoardComplete(newBoard, state.size);

            return {
                ...state,
                board: newBoard,
                invalidCells,
                isComplete,
                isTimerRunning: !isComplete, // Stop timer when complete
            };
        }

        case ACTIONS.SET_SELECTED_CELL:
            return {
                ...state,
                selectedCell: action.payload,
            };

        case ACTIONS.TICK_TIMER:
            return {
                ...state,
                timer: state.timer + 1,
            };

        case ACTIONS.RESET_TIMER:
            return {
                ...state,
                timer: 0,
            };

        case ACTIONS.SET_GAME_COMPLETE:
            return {
                ...state,
                isComplete: true,
                isTimerRunning: false,
            };

        case ACTIONS.SHOW_HINT:
            return {
                ...state,
                hintCell: action.payload,
            };

        case ACTIONS.CLEAR_HINT:
            return {
                ...state,
                hintCell: null,
            };

        case ACTIONS.LOAD_GAME_STATE:
            return {
                ...state,
                ...action.payload,
                hintCell: null, // Always clear hint when loading saved state
            };

        default:
            return state;
    }
}

// Provider component
export function SudokuProvider({ children }) {
    const [state, dispatch] = useReducer(sudokuReducer, initialState);
    const location = useLocation();
    const timerIntervalRef = useRef(null);
    const isInitialMount = useRef(true);
    const lastSaveTimeRef = useRef(0);
    const justLoadedRef = useRef(false); // Track if we just loaded state to prevent immediate save
    const SAVE_DEBOUNCE_MS = 500; // Save at most once per 500ms to avoid excessive writes
    
    // Check if we're on a game page and determine expected size
    const isGamePage = location.pathname === '/games/easy' || location.pathname === '/games/normal';
    const expectedSize = location.pathname === '/games/easy' ? 6 : location.pathname === '/games/normal' ? 9 : null;

    // Clear game state when leaving game pages
    useEffect(() => {
        if (!isGamePage && state.board) {
            // Clear board state when leaving game pages
            dispatch({ type: ACTIONS.SET_BOARD, payload: null });
            dispatch({ type: ACTIONS.SET_SELECTED_CELL, payload: null });
            dispatch({ type: ACTIONS.CLEAR_HINT });
        }
    }, [isGamePage, state.board]);

    // Load saved game state when route or size changes
    useEffect(() => {
        // Only load if we're on a game page and have an expected size
        if (!isGamePage || !expectedSize) {
            return;
        }
        
        // Use expectedSize from route instead of state.size to avoid loading wrong state on refresh
        // Try to load saved state for the expected size (based on route)
        const savedState = loadGameState(expectedSize);
        if (savedState && savedState.board) {
            // Validate that the saved board dimensions match the expected size
            const savedBoardSize = savedState.board.length;
            if (savedBoardSize !== expectedSize) {
                // Saved state doesn't match expected size, don't load it
                return;
            }
            
            // Only load if:
            // 1. We don't have a board yet, OR
            // 2. The current board's dimensions don't match the expected size (switching modes or refresh)
            const currentBoardSize = state.board ? state.board.length : 0;
            const shouldLoad = !state.board || currentBoardSize !== expectedSize;
            
            if (shouldLoad) {
                // Mark that we're about to load state
                justLoadedRef.current = true;
                dispatch({
                    type: ACTIONS.LOAD_GAME_STATE,
                    payload: savedState,
                });
                // Clear the flag after a short delay to allow state to update
                setTimeout(() => {
                    justLoadedRef.current = false;
                }, 100);
            }
        }
        
        // Mark initial mount as complete after checking for saved state
        // This allows subsequent saves to work
        if (isInitialMount.current) {
            // Use setTimeout to ensure this runs after state updates
            setTimeout(() => {
                isInitialMount.current = false;
            }, 0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname, expectedSize, isGamePage]);

    // Timer effect
    useEffect(() => {
        if (state.isTimerRunning && !state.isComplete) {
            timerIntervalRef.current = setInterval(() => {
                dispatch({ type: ACTIONS.TICK_TIMER });
            }, 1000);
        } else {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }
        }

        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        };
    }, [state.isTimerRunning, state.isComplete]);

    // Save game state to localStorage after each action
    // Skip saving on initial mount to avoid overwriting with default state
    useEffect(() => {
        // Only save if we're on a game page
        if (!isGamePage) {
            return;
        }

        // Don't save if we just loaded state (to prevent immediate re-save)
        if (justLoadedRef.current) {
            return;
        }

        // Don't save if this is the initial mount and we haven't loaded a saved state yet
        if (isInitialMount.current) {
            // If we have a board, mark initial mount as complete so future saves work
            if (state.board) {
                isInitialMount.current = false;
            } else {
                return;
            }
        }

        // Only save if size is valid (6 or 9) - prevents saving when not on game pages
        if (state.size !== 6 && state.size !== 9) {
            return;
        }

        // Clear localStorage when game is complete
        if (state.isComplete && state.board) {
            clearGameState(state.size);
            return;
        }

        // Save game state if board exists
        if (state.board) {
            saveGameState(state, state.size);
        }
    }, [
        state.board,
        state.solution,
        state.givenCells,
        state.size,
        state.selectedCell,
        state.invalidCells,
        state.isComplete,
        // hintCell is not saved - hints should not persist across sessions
        // Timer is handled separately with debouncing
    ]);

    // Save timer separately with debouncing (to avoid excessive localStorage writes)
    useEffect(() => {
        // Only save if we're on a game page
        if (!isGamePage) {
            return;
        }

        // Don't save if we just loaded state
        if (justLoadedRef.current || isInitialMount.current || !state.board || state.isComplete) {
            return;
        }

        // Only save if size is valid (6 or 9)
        if (state.size !== 6 && state.size !== 9) {
            return;
        }

        const now = Date.now();
        // Only save timer if enough time has passed since last save
        if ((now - lastSaveTimeRef.current) >= SAVE_DEBOUNCE_MS) {
            saveGameState(state, state.size);
            lastSaveTimeRef.current = now;
        }
    }, [state.timer, state.board, state.isComplete, state.size, isGamePage]);

    // Actions
    const actions = {
        setGameSize: (size) => {
            dispatch({ type: ACTIONS.SET_GAME_SIZE, payload: size });
        },

        newGame: () => {
            // Clear localStorage when starting a new game
            clearGameState(state.size);
            dispatch({ type: ACTIONS.NEW_GAME });
        },

        resetGame: () => {
            // Clear localStorage when resetting game
            clearGameState(state.size);
            dispatch({ type: ACTIONS.RESET_GAME });
        },

        updateCell: (row, col, value) => {
            dispatch({ type: ACTIONS.UPDATE_CELL, payload: { row, col, value } });
        },

        setSelectedCell: (cell) => {
            dispatch({ type: ACTIONS.SET_SELECTED_CELL, payload: cell });
        },

        showHint: () => {
            if (!state.board || state.isComplete) {
                return;
            }
            const hint = findHintCell(state.board, state.size, state.givenCells);
            if (hint) {
                dispatch({ 
                    type: ACTIONS.SHOW_HINT, 
                    payload: [hint.row, hint.col] 
                });
            }
        },

        clearHint: () => {
            dispatch({ type: ACTIONS.CLEAR_HINT });
        },
    };

    return (
        <SudokuContext.Provider value={{ ...state, ...actions }}>
            {children}
        </SudokuContext.Provider>
    );
}

// Custom hook
export function useSudoku() {
    const context = useContext(SudokuContext);
    if (!context) {
        throw new Error('useSudoku must be used within SudokuProvider');
    }
    return context;
}


# CS5610 — Project 2 Writeup

> Xihao — CS5610 Web Development

## 1. What were some challenges you faced while making this app?

One main challenge was saving game state to localStorage while keeping React Context working properly. At first, when I refreshed the page, it would load the wrong game state (like loading a 9×9 board when on the `/games/easy` page). I fixed this by getting the game size from the URL path and checking it before loading saved state. Another challenge was making the hint system find cells that lead to the correct answer, even when a cell has more than one valid number. I solved this with a two-step process: first check for cells with only one valid number, then use backtracking to find cells where only one number leads to the right answer. Also, I had to make sure localStorage only worked through React Context and prevent endless save/load loops by using refs and useEffect carefully.

## 2. Given more time, what additional features, functional or design changes would you make?

If I had more time, I would add several improvements. First, I would add a system where players unlock harder puzzles as they finish easier ones. Second, I would add a scoring system that tracks how fast players finish, how many hints they use, and how accurate they are, with a leaderboard that saves between sessions. Third, I would add undo and redo buttons so players can go back on their moves. Fourth, I would add a "notes" feature where players can mark possible numbers in cells, like in professional Sudoku apps. Finally, I would add animations when cells update, when players win, and smoother changes between game states. I would also add sound effects for better user experience.

## 3. What assumptions did you make while working on this assignment?

I made several assumptions while building this app. First, I assumed users would use a keyboard and mouse, so I focused on keyboard and click controls instead of touch controls. Second, I assumed localStorage would always be available, so I didn't add backup plans for browsers with localStorage turned off. Third, I assumed the game would be played on one device at a time, so I didn't add cloud saving or multi-device support. Fourth, I assumed the Sudoku puzzles would always have one correct answer after checking, so I only added one retry instead of stronger error handling. Finally, I assumed players would want separate saves for Easy and Normal modes, which is why I used different localStorage keys for each mode.

## 4. How long did this assignment take to complete?

This assignment took about 40 hours to complete.

## 5. What bonus points did you accomplish? Please link to code where relevant and add any required details.

I completed all three bonus features: Local Storage (3 points), Backtracking (3 points), and Hint System (5 points), for a total of 11 bonus points.

### a. Local Storage

**Implementation:** All localStorage work is done only through React Context code, as required. The code is in `src/utils/localStorageUtils.js` and used in `src/context/SudokuContext.jsx`.

**Key Features:**

- **Checking localStorage when app opens:** When the app first opens or when going to a game page, the Context checks for saved game state using `loadGameState()`. This is done in `SudokuContext.jsx` with a `useEffect` hook that loads saved state based on the current page (`/games/easy` or `/games/normal`).

```javascript
// src/context/SudokuContext.jsx lines 196-243
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
}, [location.pathname, expectedSize, isGamePage]);
```

- **Updating localStorage after each action:** After every game action (like updating a cell or timer ticking), the game state is saved to localStorage. This is done with two `useEffect` hooks in `SudokuContext.jsx`: one for general state changes and one for timer updates with debouncing.

```javascript
// src/context/SudokuContext.jsx lines 267-313
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
```

```javascript
// src/context/SudokuContext.jsx lines 315-338
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
```

- **localStorage accessed ONLY through React Context:** All localStorage work is done through helper functions in `localStorageUtils.js` (`saveGameState`, `loadGameState`, `clearGameState`, `hasSavedGameState`), and these functions are only called from `SudokuContext.jsx`. No components directly use `window.localStorage`.

```javascript
// src/utils/localStorageUtils.js
const STORAGE_KEYS = {
    EASY: 'sudoku_game_state_easy',
    NORMAL: 'sudoku_game_state_normal',
};

function getStorageKey(size) {
    return size === 6 ? STORAGE_KEYS.EASY : STORAGE_KEYS.NORMAL;
}

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

export function clearGameState(size) {
    try {
        const storageKey = getStorageKey(size);
        localStorage.removeItem(storageKey);
    } catch (error) {
        console.error('Failed to clear game state from localStorage:', error);
    }
}

export function hasSavedGameState(size) {
    try {
        const storageKey = getStorageKey(size);
        return localStorage.getItem(storageKey) !== null;
    } catch (error) {
        console.error('Failed to check saved game state:', error);
        return false;
    }
}
```

- **Clearing localStorage after game completion:** When the game is finished (either by solving the puzzle or clicking Reset), localStorage is cleared. This happens in two places: (1) when `isComplete` becomes true, and (2) when `newGame()` or `resetGame()` actions are called.

```javascript
// src/context/SudokuContext.jsx lines 293-296
// Clear localStorage when game is complete
if (state.isComplete && state.board) {
    clearGameState(state.size);
    return;
}
```

```javascript
// src/context/SudokuContext.jsx lines 346-356
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
```

**Additional Details:**
- Different storage keys for Easy (`sudoku_game_state_easy`) and Normal (`sudoku_game_state_normal`) modes keep game states separate.
- The code checks that loaded state matches the expected game size to prevent loading the wrong mode.
- Timer updates are debounced to avoid too many localStorage writes (saves at most once per 500ms).
- Hint cell state is NOT saved to localStorage, because hints should not stay after closing the browser.

### b. Backtracking

**Implementation:** The backtracking algorithm makes sure each generated Sudoku puzzle has exactly one correct answer. The code is in `src/utils/sudokuGenerator.js`.

**How it works:**

- **Solution Counting:** The `countSolutions()` function uses a recursive backtracking algorithm to count how many solutions a puzzle has. It tries each valid number (1 to size) in empty cells, solves the rest of the board, and counts solutions. It stops early if it finds more than one solution.

```javascript
// src/utils/sudokuGenerator.js lines 134-165
export function countSolutions(board, size, maxSolutions = 2) {
    let solutionCount = 0;

    function solve() {
        // Find first empty cell
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (board[row][col] === null) {
                    // Try each possible number
                    for (let num = 1; num <= size; num++) {
                        if (isValidPlacement(board, row, col, num, size)) {
                            board[row][col] = num;
                            solve();
                            board[row][col] = null; // Backtrack

                            // Early exit optimization: stop if we found multiple solutions
                            if (solutionCount >= maxSolutions) {
                                return;
                            }
                        }
                    }
                    return; // No valid number found, backtrack
                }
            }
        }
        // Board is completely filled - found a solution
        solutionCount++;
    }

    solve();
    return solutionCount;
}
```

- **Puzzle Generation with Uniqueness Guarantee:** The `generatePuzzleWithBacktracking()` function starts with a complete solved Sudoku board and removes cells one by one. For each cell removal, it checks if the puzzle still has exactly one solution using `countSolutions()`. If removing a cell would cause multiple solutions or no solution, the cell is put back. This continues until the target number of filled cells is reached.

```javascript
// src/utils/sudokuGenerator.js lines 175-216
function generatePuzzleWithBacktracking(solvedSudoku, size, filledCellsNumber) {
    const total = size * size;
    const targetRemoved = Math.max(0, total - filledCellsNumber);
    
    // Start with a copy of the solved board
    const puzzleBoard = deepCopy2DArray(solvedSudoku);
    
    // Generate and shuffle coordinates
    const coordinates = generateCoordinates(size);
    const shuffledCoords = shuffle(coordinates);
    
    let removed = 0;
    let attempts = 0;
    const maxAttempts = shuffledCoords.length * 3; // Prevent infinite loops

    // Try to remove cells while maintaining unique solution
    for (const [row, col] of shuffledCoords) {
        if (removed >= targetRemoved) break;
        if (attempts >= maxAttempts) break;

        // Store original value
        const originalValue = puzzleBoard[row][col];
        
        // Try removing this cell
        puzzleBoard[row][col] = null;
        
        // Check if puzzle still has unique solution
        const solutions = countSolutions(deepCopy2DArray(puzzleBoard), size, 2);
        
        if (solutions === 1) {
            // Unique solution maintained, keep it removed
            removed++;
        } else {
            // Multiple solutions or no solution, restore the cell
            puzzleBoard[row][col] = originalValue;
        }
        
        attempts++;
    }

    return puzzleBoard;
}
```

- **Verification:** The `verifyUniqueSolution()` function checks that the generated puzzle has exactly one solution. This is called in `generatePuzzle()` after puzzle generation, with a retry if verification fails.

```javascript
// src/utils/sudokuGenerator.js lines 284-287
export function verifyUniqueSolution(puzzle, size) {
    const solutions = countSolutions(deepCopy2DArray(puzzle), size, 2);
    return solutions === 1;
}
```

```javascript
// src/utils/sudokuGenerator.js lines 310-320
// Verify unique solution (safety check)
if (!verifyUniqueSolution(puzzle, size)) {
    console.warn('Generated puzzle does not have unique solution, regenerating...');
    // Retry once
    const retryPuzzle = generatePuzzleWithBacktracking(solved, size, filledCellsNumber);
    if (verifyUniqueSolution(retryPuzzle, size)) {
        const givenCells = extractGivenCells(retryPuzzle, size);
        return { puzzle: retryPuzzle, solution: solved, givenCells };
    }
    // If still fails, return original (shouldn't happen with correct implementation)
    console.error('Failed to generate puzzle with unique solution after retry');
}
```

**Integration:** The backtracking algorithm is used in the main `generatePuzzle()` function, which is called when a new game starts through the `NEW_GAME` action in `SudokuContext.jsx`.

```javascript
// src/utils/sudokuGenerator.js lines 294-326
export function generatePuzzle(size) {
    const config = getGameConfig(size);
    const { height, width } = config;
    
    // Calculate filled cells number
    const filledCellsNumber = size === 6
        ? config.filledCells
        : config.filledCellsMin + Math.floor(Math.random() * (config.filledCellsMax - config.filledCellsMin + 1));

    // Build solved Sudoku using formula pattern method
    const solved = buildSolvedSudoku(size, height, width);

    // Generate puzzle using backtracking to ensure unique solution
    const puzzle = generatePuzzleWithBacktracking(solved, size, filledCellsNumber);

    // Verify unique solution (safety check)
    if (!verifyUniqueSolution(puzzle, size)) {
        console.warn('Generated puzzle does not have unique solution, regenerating...');
        // Retry once
        const retryPuzzle = generatePuzzleWithBacktracking(solved, size, filledCellsNumber);
        if (verifyUniqueSolution(retryPuzzle, size)) {
            const givenCells = extractGivenCells(retryPuzzle, size);
            return { puzzle: retryPuzzle, solution: solved, givenCells };
        }
        // If still fails, return original (shouldn't happen with correct implementation)
        console.error('Failed to generate puzzle with unique solution after retry');
    }

    // Track which cells are given (pre-filled)
    const givenCells = extractGivenCells(puzzle, size);

    return { puzzle, solution: solved, givenCells };
}
```

### c. Hint System

**Implementation:** The hint system finds and highlights a single empty square that has exactly one valid answer. It uses a two-step process to find hint cells. The code is in `src/utils/hintUtils.js` and used in `src/context/SudokuContext.jsx`.

**How it works:**

- **Step 1 - Simple Check:** The algorithm first checks all empty cells (not given cells) to find cells with exactly one valid number according to basic Sudoku rules (row, column, and subgrid rules). This is a fast check for the common case.

```javascript
// src/utils/hintUtils.js lines 31-67
// First pass: Check for cells with exactly one valid number (simple case)
for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
        // Skip filled cells
        if (board[row][col] !== null && board[row][col] !== '') {
            continue;
        }
        
        // Skip if this is a given cell
        if (givenCells.some(([r, c]) => r === row && c === col)) {
            continue;
        }
        
        // Find all valid numbers for this cell
        const validNumbers = [];
        for (let num = 1; num <= size; num++) {
            if (isValidPlacement(board, row, col, num, size)) {
                validNumbers.push(num);
            }
        }
        
        // If exactly one valid number, this is a hint cell
        if (validNumbers.length === 1) {
            hintCells.push({
                row,
                col,
                value: validNumbers[0],
            });
        }
    }
}

// If we found simple hints, return one randomly
if (hintCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * hintCells.length);
    return hintCells[randomIndex];
}
```

- **Step 2 - Backtracking Check:** If no cells are found in Step 1, the algorithm uses backtracking to find "forced" cells. For each empty cell, it tries each valid number and checks if placing that number leads to a unique solution using `countSolutions()`. If exactly one number leads to a unique solution (even though multiple numbers might be valid by basic rules), that cell is a hint cell.

```javascript
// src/utils/hintUtils.js lines 69-128
// Second pass: Use backtracking to find "forced" cells
// This is more expensive but can find hints even when cells have multiple valid numbers
for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
        // Skip filled cells
        if (board[row][col] !== null && board[row][col] !== '') {
            continue;
        }
        
        // Skip if this is a given cell
        if (givenCells.some(([r, c]) => r === row && c === col)) {
            continue;
        }
        
        // Find all valid numbers for this cell
        const validNumbers = [];
        for (let num = 1; num <= size; num++) {
            if (isValidPlacement(board, row, col, num, size)) {
                validNumbers.push(num);
            }
        }
        
        // If no valid numbers, skip
        if (validNumbers.length === 0) {
            continue;
        }
        
        // Try each valid number and check if it leads to a unique solution
        let forcedNumber = null;
        let foundUnique = false;
        
        for (const num of validNumbers) {
            // Create a copy of the board with this number placed
            const testBoard = deepCopy2DArray(board);
            testBoard[row][col] = num;
            
            // Check if this leads to a unique solution
            const solutions = countSolutions(testBoard, size, 2);
            if (solutions === 1) {
                if (forcedNumber === null) {
                    forcedNumber = num;
                    foundUnique = true;
                } else {
                    // Multiple numbers lead to unique solutions - not a forced cell
                    foundUnique = false;
                    break;
                }
            }
        }
        
        // If exactly one number leads to a unique solution, this is a hint cell
        if (foundUnique && forcedNumber !== null) {
            hintCells.push({
                row,
                col,
                value: forcedNumber,
            });
        }
    }
}
```

- **Highlighting:** When a hint cell is found, it is highlighted on the board. The hint cell coordinates are stored in the Context state (`hintCell`) and passed to the `SudokuBoard` component, which uses CSS to highlight the cell with a background color animation.

```javascript
// src/context/SudokuContext.jsx lines 366-377
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
```

**Key Requirements Met:**
- Highlights a single empty square (not a given cell)
- The highlighted square can accept a single, valid answer (doesn't break Sudoku rules)
- There is only one valid input for that specific cell (checked through backtracking)

**Additional Details:**
- The hint button is in `GameControls.jsx` and calls the `showHint()` function from Context.
- If multiple hint cells are found, one is picked randomly.
- The hint is cleared when the user makes a cell change.
- Hint state is NOT saved to localStorage, because hints should not stay after closing the browser.
- The code works for both Easy (6×6) and Normal (9×9) game modes.

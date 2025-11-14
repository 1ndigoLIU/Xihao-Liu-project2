/**
 * Fisher–Yates shuffle
 * Algorithm Reference: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 */
function shuffle(array) {
    const tempArr = array.slice();
    for (let i = tempArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tempArr[i], tempArr[j]] = [tempArr[j], tempArr[i]];
    }
    return tempArr;
}

/**
 * Deep copy a 2D array
 */
function deepCopy2DArray(array) {
    return array.map((row) => [...row]);
}

/**
 * Game configuration constants
 */
const GAME_CONFIG = {
    6: { height: 2, width: 3, filledCells: 18 },
    9: { height: 3, width: 3, filledCellsMin: 28, filledCellsMax: 30 },
};

/**
 * Get game configuration for a given size
 */
function getGameConfig(size) {
    const config = GAME_CONFIG[size];
    if (!config) {
        throw new Error(`Unsupported size: ${size}. Only 6 and 9 are supported.`);
    }
    return config;
}

/**
 * Build standard solved grid using formula pattern
 * Formula: ((row % height) * width + Math.floor(row / height) + col) % size + 1
 */
function buildStandardGrid(size, height, width) {
    return Array.from({ length: size }, (_, row) =>
        Array.from(
            { length: size },
            (_, col) =>
                (((row % height) * width + Math.floor(row / height) + col) % size) + 1
        )
    );
}

/**
 * Shuffle rows within row groups
 */
function shuffleRows(size, height, width) {
    const rowGroups = shuffle(Array.from({ length: width }, (_, group) => group));
    const rowsOrder = [];
    for (const group of rowGroups) {
        const rowsInGroup = shuffle(
            Array.from({ length: height }, (_, i) => group * height + i)
        );
        rowsOrder.push(...rowsInGroup);
    }
    return rowsOrder;
}

/**
 * Shuffle columns within column groups
 */
function shuffleColumns(size, height, width) {
    const colGroups = shuffle(Array.from({ length: height }, (_, group) => group));
    const colsOrder = [];
    for (const group of colGroups) {
        const colsInGroup = shuffle(
            Array.from({ length: width }, (_, j) => group * width + j)
        );
        colsOrder.push(...colsInGroup);
    }
    return colsOrder;
}

/**
 * Sudoku Generation Method (row/column shifting + group randomization)
 * Principle: Based on the formula pattern with row/column group shuffling
 * 
 * Step 1: Construct a standard solved grid using formula pattern
 * Step 2: Randomly shuffle the order of "row groups" (each group has height rows)
 * Step 3: Randomly shuffle rows within each row group
 * Step 4: Do the same for columns (column groups of size width)
 */
function buildSolvedSudoku(size, height, width) {
    const standardGrid = buildStandardGrid(size, height, width);
    const rowsOrder = shuffleRows(size, height, width);
    const colsOrder = shuffleColumns(size, height, width);

    // Apply row and column shuffling
    return rowsOrder.map((row) =>
        colsOrder.map((col) => standardGrid[row][col])
    );
}

/**
 * Generate all cell coordinates for a board
 */
function generateCoordinates(size) {
    const coordinates = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            coordinates.push([i, j]);
        }
    }
    return coordinates;
}

/**
 * Solve Sudoku using backtracking algorithm
 * Returns the number of solutions found (stops at 2 to optimize performance)
 * 
 * Algorithm:
 * 1. Find the first empty cell
 * 2. Try each valid number (1 to size)
 * 3. Recursively solve the rest of the board
 * 4. If a solution is found, increment counter
 * 5. Backtrack by removing the number and try next
 * 6. Stop early if we find more than one solution
 * 
 * @param {Array} board - The Sudoku board (will be modified during solving)
 * @param {number} size - Board size (6 or 9)
 * @param {number} maxSolutions - Maximum number of solutions to find (default: 2)
 * @returns {number} Number of solutions found (0, 1, or 2+)
 */
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

/**
 * Generate puzzle using backtracking to ensure unique solution
 * Removes cells one by one, checking that the puzzle still has exactly one solution
 * @param {Array} solvedSudoku - Complete solved Sudoku board
 * @param {number} size - Board size
 * @param {number} filledCellsNumber - Target number of filled cells
 * @returns {Array} Puzzle board with unique solution
 */
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

/**
 * Check if a number can be placed at a given position
 */
export function isValidPlacement(board, row, col, num, size) {
    const { height: subgridRows, width: subgridCols } = getGameConfig(size);

    // Check row
    for (let c = 0; c < size; c++) {
        if (board[row][c] === num && c !== col) {
            return false;
        }
    }

    // Check column
    for (let r = 0; r < size; r++) {
        if (board[r][col] === num && r !== row) {
            return false;
        }
    }

    // Check subgrid
    const subgridRow = Math.floor(row / subgridRows) * subgridRows;
    const subgridCol = Math.floor(col / subgridCols) * subgridCols;

    for (let r = subgridRow; r < subgridRow + subgridRows; r++) {
        for (let c = subgridCol; c < subgridCol + subgridCols; c++) {
            if (board[r][c] === num && (r !== row || c !== col)) {
                return false;
            }
        }
    }

    return true;
}

/**
 * Check if a cell value violates Sudoku rules
 */
function isCellValid(board, row, col, size) {
    const value = board[row][col];
    if (value === null || value === '') {
        return true; // Empty cells are valid
    }
    return isValidPlacement(board, row, col, value, size);
}

/**
 * Extract given cells from puzzle board
 */
function extractGivenCells(puzzle, size) {
    const givenCells = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (puzzle[r][c] !== null) {
                givenCells.push([r, c]);
            }
        }
    }
    return givenCells;
}

/**
 * Verify that a puzzle has exactly one solution
 * @param {Array} puzzle - The puzzle board
 * @param {number} size - Board size
 * @returns {boolean} True if puzzle has exactly one solution
 */
export function verifyUniqueSolution(puzzle, size) {
    const solutions = countSolutions(deepCopy2DArray(puzzle), size, 2);
    return solutions === 1;
}

/**
 * Generate a new Sudoku puzzle using backtracking to ensure unique solution
 * @param {number} size - 6 for easy, 9 for normal
 * @returns {Object} { puzzle, solution, givenCells }
 */
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

/**
 * Check if the board is completely filled and valid
 */
export function isBoardComplete(board, size) {
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (board[r][c] === null || board[r][c] === '') {
                return false;
            }
            if (!isCellValid(board, r, c, size)) {
                return false;
            }
        }
    }
    return true;
}

/**
 * Get all invalid cells (for highlighting)
 * Only returns cells that are NOT given cells (i.e., only player-input cells)
 * @param {Array} board - The Sudoku board
 * @param {number} size - Board size (6 or 9)
 * @param {Array} givenCells - Array of [row, col] coordinates for given cells (pre-filled cells)
 * @returns {Array} Array of [row, col] coordinates for invalid player-input cells
 */
export function getInvalidCells(board, size, givenCells = []) {
    const invalid = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            // Skip given cells - only check player-input cells
            if (givenCells.some(([gr, gc]) => gr === r && gc === c)) {
                continue;
            }
            
            // Check if this player-input cell is invalid
            if (board[r][c] !== null && board[r][c] !== '' && !isCellValid(board, r, c, size)) {
                invalid.push([r, c]);
            }
        }
    }
    return invalid;
}

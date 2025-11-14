import { isValidPlacement } from './sudokuGenerator';

/**
 * Find a cell that has exactly one valid number (hint cell)
 * Returns null if no such cell exists
 * 
 * Algorithm:
 * 1. Check all empty cells (not given cells, not filled)
 * 2. For each empty cell, find all valid numbers (1 to size)
 * 3. If exactly one valid number exists, this is a hint cell
 * 4. If multiple hint cells exist, randomly select one
 * 
 * @param {Array} board - The current Sudoku board
 * @param {number} size - Board size (6 or 9)
 * @param {Array} givenCells - Array of [row, col] coordinates for given cells
 * @returns {Object|null} { row, col, value } or null
 */
export function findHintCell(board, size, givenCells) {
    const hintCells = [];
    
    // Check all empty cells
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
    
    // If no hint cells found, return null
    if (hintCells.length === 0) {
        return null;
    }
    
    // If multiple hint cells, randomly select one
    const randomIndex = Math.floor(Math.random() * hintCells.length);
    return hintCells[randomIndex];
}


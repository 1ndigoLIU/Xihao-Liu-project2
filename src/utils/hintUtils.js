import { isValidPlacement } from './sudokuGenerator';
import { countSolutions } from './sudokuGenerator';

/**
 * Deep copy a 2D array
 */
function deepCopy2DArray(array) {
    return array.map((row) => [...row]);
}

/**
 * Find a cell that has exactly one valid number (hint cell)
 * Uses backtracking to find "forced" cells even if they have multiple valid numbers
 * Returns null if no such cell exists
 * 
 * Algorithm:
 * 1. First, check for cells with exactly one valid number (simple case)
 * 2. If none found, use backtracking to find "forced" cells:
 *    - For each empty cell, try each valid number
 *    - Check if placing that number leads to a unique solution
 *    - If only one number leads to a solution, that's a hint cell
 * 
 * @param {Array} board - The current Sudoku board
 * @param {number} size - Board size (6 or 9)
 * @param {Array} givenCells - Array of [row, col] coordinates for given cells
 * @returns {Object|null} { row, col, value } or null
 */
export function findHintCell(board, size, givenCells) {
    const hintCells = [];
    
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
    
    // If no hint cells found, return null
    if (hintCells.length === 0) {
        return null;
    }
    
    // If multiple hint cells, randomly select one
    const randomIndex = Math.floor(Math.random() * hintCells.length);
    return hintCells[randomIndex];
}


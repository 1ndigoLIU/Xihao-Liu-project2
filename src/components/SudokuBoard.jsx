import SudokuCell from './SudokuCell';

/**
 * Reusable Sudoku Board component
 * Receives board state and callbacks as props from parent
 */
export default function SudokuBoard({
    board,
    size,
    givenCells,
    selectedCell,
    invalidCells,
    hintCell,
    onCellSelect,
    onCellChange,
}) {
    // Helper functions to check cell states
    const isGiven = (row, col) => 
        givenCells.some(([r, c]) => r === row && c === col);

    const isSelected = (row, col) => 
        selectedCell?.[0] === row && selectedCell?.[1] === col;

    const isInvalid = (row, col) => 
        invalidCells.some(([r, c]) => r === row && c === col);

    const isHint = (row, col) => 
        hintCell?.[0] === row && hintCell?.[1] === col;

    return (
        <div className="board-wrap">
            <table className="board" role="grid" aria-label={`Sudoku ${size} by ${size} board`}>
                <tbody>
                    {board.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, colIndex) => (
                                <SudokuCell
                                    key={`${rowIndex}-${colIndex}`}
                                    row={rowIndex}
                                    col={colIndex}
                                    value={cell}
                                    isGiven={isGiven(rowIndex, colIndex)}
                                    isSelected={isSelected(rowIndex, colIndex)}
                                    isInvalid={isInvalid(rowIndex, colIndex)}
                                    isHint={isHint(rowIndex, colIndex)}
                                    onSelect={onCellSelect}
                                    onChange={onCellChange}
                                    size={size}
                                />
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


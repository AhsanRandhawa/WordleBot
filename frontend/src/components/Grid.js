import React from 'react';

const colorStates = [
  { color: 'grey', label: 'Incorrect', code: 'B' },
  { color: 'orange', label: 'Wrong Position', code: 'O' },
  { color: 'green', label: 'Correct', code: 'G' }
];

/**
 * Grid component to display the Wordle grid.
 * @param {Object} props - Component props
 * @param {Array} props.rows - The rows of the grid, where each row is an array of cell states
 * @param {boolean} props.isInteractive - Whether the grid cells are interactive (clickable)
 * @param {Function} [props.handleCellClick] - Function to handle cell click events (only needed if isInteractive is true)
 * @param {Array} [props.letters] - The letters to display in each cell
 * @returns {JSX.Element}
 */

function Grid ({ rows, isInteractive, handleCellClick, letters })
{
  return (
    <div style={{ display: 'grid', gap: '2px' }}>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex', gap: '2px' }}>
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className="no-select"
              style={{
                backgroundColor: colorStates[cell].color,
                color: 'white',
                padding: '10px 15px',
                border: 'none',
                fontSize: '16px',
                width: '40px',
                textAlign: 'center',
                cursor: isInteractive ? 'pointer' : 'default'
              }}
              onClick={() => isInteractive && handleCellClick(cellIndex)}
            >
              {letters ? letters[rowIndex][cellIndex].toUpperCase() : ''}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Grid;


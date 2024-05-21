import React from 'react';
import './App.css';

const colorStates = [
  { color: 'grey', label: 'Incorrect', code: 'B' },
  { color: 'orange', label: 'Wrong Position', code: 'O' },
  { color: 'green', label: 'Correct', code: 'G' }
];

export const Grid = ({ rows, isInteractive, handleCellClick, letters }) => {
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
};

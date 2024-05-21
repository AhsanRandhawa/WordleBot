import React from 'react';
import PropTypes from 'prop-types';

/**
 * GuessChangeOverlay component to change the guess.
 * @param {Object} props - Component props
 * @param {string} props.newGuess - The new guess entered by the user
 * @param {Function} props.handleNewGuessChange - Function to handle new guess input change
 * @param {Function} props.handleNewGuessSubmit - Function to handle new guess submission
 * @param {Function} props.toggleGuessChangeOverlayVisibility - Function to toggle the overlay visibility
 * @returns {JSX.Element}
 */
function GuessChangeOverlay({ newGuess, handleNewGuessChange, handleNewGuessSubmit, toggleGuessChangeOverlayVisibility }) {
  return (
    <div className="overlay">
      <div className="overlay-content">
        <h2>Change Guess</h2>
        <div>
          <input 
            type="text" 
            value={newGuess} 
            onChange={handleNewGuessChange} 
            placeholder="Enter new guess" 
            maxLength="5"
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', paddingTop: "10px" }}>
          <button onClick={handleNewGuessSubmit} style={{ fontSize: '10px', padding: '10px 20px', marginTop: '10px' }}>Submit New Guess</button>
          <button onClick={toggleGuessChangeOverlayVisibility} style={{ fontSize: '10px', padding: '10px 20px', marginTop: '10px' }}>Close</button>
        </div>
      </div>
    </div>
  );
}

GuessChangeOverlay.propTypes = {
  newGuess: PropTypes.string.isRequired,
  handleNewGuessChange: PropTypes.func.isRequired,
  handleNewGuessSubmit: PropTypes.func.isRequired,
  toggleGuessChangeOverlayVisibility: PropTypes.func.isRequired
};

export default GuessChangeOverlay;

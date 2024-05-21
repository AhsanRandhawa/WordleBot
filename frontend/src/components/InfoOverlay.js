import React from 'react';
import PropTypes from 'prop-types';

/**
 * InfoOverlay component to show instructions.
 * @param {Object} props - Component props
 * @param {Function} props.toggleOverlayVisibility - Function to toggle the overlay visibility
 * @returns {JSX.Element}
 */
function InfoOverlay({ toggleOverlayVisibility }) {
  return (
    <div className="overlay">
      <div className="overlay-content">
        <h2>Instructions for the Wordle Bot</h2>
        <p>
          This is a bot that helps you find the next optimal guess for the popular word game <a href="https://www.nytimes.com/games/wordle/index.html" target="_blank" rel="noopener noreferrer">Wordle</a>.
          <br />
          - Initially, the optimal guess is provided for you.
          <br />
          - If you wish to use your own guess instead, click "Change Guess".
          <br />
          - Enter the pattern from Wordle by clicking on the letter box to change its color.
          <br />
          - Finally, Click "Submit Pattern" to get the next guess.
          <br />
          - Or, Click "Reset All" to start a new session with the bot.
        </p>
        <button onClick={toggleOverlayVisibility}>Close</button>
      </div>
    </div>
  );
}

InfoOverlay.propTypes = {
  toggleOverlayVisibility: PropTypes.func.isRequired
};

export default InfoOverlay;

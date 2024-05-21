import React, { useState } from 'react';
import axios from 'axios';
import Grid from './components/Grid';
import InfoOverlay from './components/InfoOverlay';
import GuessChangeOverlay from './components/GuessChangeOverlay';
import ActionButton from './components/ActionButton';
import './App.css';

const colorStates = [
  { color: 'grey', label: 'Incorrect', code: 'B' },
  { color: 'yellow', label: 'Wrong Position', code: 'Y' },
  { color: 'green', label: 'Correct', code: 'G' }
];

function App() {
  const [guess, setGuess] = useState("raise");
  const [buttonStates, setButtonStates] = useState(Array(5).fill(0)); // Storing index of colorStates
  const [history, setHistory] = useState([]);
  const [buttonStatesVisible, setButtonStatesVisible] = useState(true);
  const [submitButtonVisible, setSubmitButtonVisible] = useState(true);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isGuessChangeOverlayVisible, setIsGuessChangeOverlayVisible] = useState(false);
  const [newGuess, setNewGuess] = useState("");

  /**
   * Cycle color state of a specific button
   * @param {number} index - Index of the button to cycle color
   */
  const handleColorCycle = (index) => {
    const newState = buttonStates.map((state, i) => {
      if (i === index) {
        return (state + 1) % colorStates.length; // Correctly cycle through indices
      }
      return state;
    });
    setButtonStates(newState);
  };

  /**
   * Submit the feedback and get a new guess from the API
   */
  const handleSubmit = () => {
    const feedback = buttonStates.map(state => colorStates[state].code).join('');
    const newHistory = [...history, { guess, feedback }];

    if (feedback === "GGGGG") {
      setHistory(newHistory);
      setButtonStatesVisible(false);
      setSubmitButtonVisible(false);
      alert("Thank you for using the bot! Press the reset button to try a different word.");
    } else {
      fetchNextGuess(newHistory);
    }
  };

  /**
   * Reset the component to its initial state
   */
  const handleReset = () => {
    setGuess("raise");
    setButtonStates(Array(5).fill(0));
    setHistory([]);
    setButtonStatesVisible(true);
    setSubmitButtonVisible(true);
    setIsGuessChangeOverlayVisible(false);
    setNewGuess("");
  };

  /**
   * Fetch the next guess from the API
   * @param {Array} newHistory - The history of guesses and feedback
   */
  const fetchNextGuess = async (newHistory) => {
    try {
      const response = await axios.post('/api/next-guess', newHistory);
      const fetchedGuess = response.data.nextGuess;
      if (fetchedGuess === "NA") {
        alert("There are no possible words left with this pattern. Try Again.");
      } else if (fetchedGuess === "NOTW") {
        alert("The guess you entered is not a valid 5 letter word.");
      } else {
        setHistory(newHistory);
        setGuess(fetchedGuess);
        setButtonStates(Array(5).fill(0)); // Reset button states to initial color
      }
    } catch (error) {
      console.error('Error fetching next guess:', error);
    }
  };

  /**
   * Toggle the visibility of the info overlay
   */
  const toggleOverlayVisibility = () => {
    setIsOverlayVisible(!isOverlayVisible);
  };

  /**
   * Toggle the visibility of the guess change overlay
   */
  const toggleGuessChangeOverlayVisibility = () => {
    setIsGuessChangeOverlayVisible(!isGuessChangeOverlayVisible);
  };

  /**
   * Handle change of the new guess input
   * @param {Event} event - The input change event
   */
  const handleNewGuessChange = (event) => {
    const value = event.target.value;
    const alphabeticValue = value.replace(/[^a-zA-Z]/g, '').toUpperCase(); // Remove non-alphabetic characters and convert to uppercase
    setNewGuess(alphabeticValue);
  };

  /**
   * Submit the new guess
   */
  const handleNewGuessSubmit = () => {
    if (history.some(item => item.guess === newGuess)) {
      alert("This guess has already been used. Please enter a different guess.");
    } else if (newGuess.length !== 5) {
      alert("Please enter a 5-letter word.");
    } else {
      setGuess(newGuess.toLowerCase());
      setButtonStates(Array(5).fill(0)); // Reset button states to initial color
      setIsGuessChangeOverlayVisible(false);
      setNewGuess("");
    }
  };

  const historyRows = history.map(item => item.feedback.split('').map(code => colorStates.findIndex(state => state.code === code)));
  const historyLetters = history.map(item => item.guess.split(''));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Wordle Bot</h1>
      {/* Info button */}
      <button className="info-button" onClick={toggleOverlayVisibility}>
        ℹ️
      </button>

      {/* Overlay for instructions */}
      {isOverlayVisible && (
        <InfoOverlay toggleOverlayVisibility={toggleOverlayVisibility} />
      )}

      {/* Overlay for changing guess */}
      {isGuessChangeOverlayVisible && (
        <GuessChangeOverlay
          newGuess={newGuess}
          handleNewGuessChange={handleNewGuessChange}
          handleNewGuessSubmit={handleNewGuessSubmit}
          toggleGuessChangeOverlayVisibility={toggleGuessChangeOverlayVisibility}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <Grid rows={historyRows} isInteractive={false} letters={historyLetters} />
        {
          buttonStatesVisible &&
          (<Grid rows={[buttonStates]} isInteractive={true} handleCellClick={handleColorCycle} letters={[guess.split('')]} />)
        }

        <div style={{ display: 'flex', flexDirection: 'row', gap: '28px', paddingTop: "8px" }}>
          <ActionButton onClick={toggleGuessChangeOverlayVisibility} style={{ visibility: submitButtonVisible ? 'visible' : 'hidden' }}>Change Guess</ActionButton>
          <ActionButton onClick={handleReset}>Reset All</ActionButton>
          <ActionButton onClick={handleSubmit} style={{ visibility: submitButtonVisible ? 'visible' : 'hidden' }}>Submit Pattern</ActionButton>
        </div>
      </div>
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import axios from 'axios';
import { Grid } from './Grid';
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

  // Cycle color state of a specific button
  const handleColorCycle = (index) => {
    const newState = buttonStates.map((state, i) => {
      if (i === index) {
        return (state + 1) % colorStates.length; // Correctly cycle through indices
      }
      return state;
    });
    setButtonStates(newState);
  };

  // Submit the feedback and get new guess from the API
  const handleSubmit = () => {
    const feedback = buttonStates.map(state => colorStates[state].code).join('');
    const newHistory = [...history, { guess, feedback }];
    fetchNextGuess(newHistory);
  };

  // Reset the component to its initial state
  const handleReset = () => {
    setGuess("raise");
    setButtonStates(Array(5).fill(0));
    setHistory([]);
  };

  // Fetch the next guess from the API
  const fetchNextGuess = async (newHistory) => {
    try {
      const response = await axios.post('/api/next-guess', newHistory);
      const newGuess = response.data.nextGuess;
      if (newGuess === "NA") {
        alert("There are no possible words left with this pattern. Try Again.");
      }
      else
      {
        setHistory(newHistory);
        setGuess(newGuess);
        setButtonStates(Array(5).fill(0)); // Reset button states to initial color
      }
     
    } catch (error) {
      console.error('Error fetching next guess:', error);
    }
  };

  const historyRows = history.map(item => item.feedback.split('').map(code => colorStates.findIndex(state => state.code === code)));
  const historyLetters = history.map(item => item.guess.split(''));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Wordle Bot Assistant</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <Grid rows={historyRows} isInteractive={false} letters={historyLetters} />
        <Grid rows={[buttonStates]} isInteractive={true} handleCellClick={handleColorCycle} letters={[guess.split('')]} />
        <div style={{ display: 'flex', flexDirection: 'row', gap: '58px', paddingTop: "8px" }}>
          <button onClick={handleSubmit} style={{ fontSize: '16px', padding: '10px 20px', width: '150px' }}>Submit Pattern</button>
          <button onClick={handleReset} style={{ fontSize: '16px', padding: '10px 20px', width: '150px' }}>Reset All</button>
        </div>
      </div>
    </div>
  );
}

export default App;

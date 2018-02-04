import React from 'react';

import MusePanel from './MusePanel.js';
import AudioPanel from './AudioPanel.js';

import './App.css';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Eyeris</h1>
        </header>
        
        <img className="App-waves" src="" alt="wave" />
        
        <MusePanel />
        <AudioPanel />
      </div>
    );
  }
}

export default App;

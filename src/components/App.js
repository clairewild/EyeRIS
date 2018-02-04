import React from 'react';
import { MuseClient } from 'muse-js';

import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: false
    };
    this.connect = this.connect.bind(this);
  }
  
  async connect() {
    let client = new MuseClient();
    await client.connect();
    await client.start();
    
    client.eegReadings.subscribe(reading => {
      console.log(reading);
    });
    
    this.setState({
      connected: true
    });
  }
  
  render() {
    const message = this.state.connected ? "We're listening to your brain activity!" : "Click the button to connect.";
    
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Eyeris</h1>
        </header>
        
        <p className="App-intro">{ message }</p>
        
        <button onClick={ this.connect }>CONNECT MUSE</button>
      </div>
    );
  }
}

export default App;

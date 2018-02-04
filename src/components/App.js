import React from 'react';
import { MuseClient } from 'muse-js';
import { ReactMic } from 'react-mic';

import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      audioRecord: false
    };
    this.museConnect = this.museConnect.bind(this);
    this.startAudioRecording = this.startAudioRecording.bind(this);
    this.stopAudioRecording = this.stopAudioRecording.bind(this);
  }
  
  async museConnect() {
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
  
  async startAudioRecording() {
    this.setState({
      audioRecord: true
    });
  }
  
  async stopAudioRecording() {
    this.setState({
      audioRecord: false
    });  
  }
  
  async saveAudioFile(recordedBlob) {
    console.log('recordedBlob is: ', recordedBlob);
    const a = document.createElement('a');
    const file = new Blob([recordedBlob.blobURL], { type: "text/csv" });
    a.href = URL.createObjectURL(file);
    document.body.appendChild(a);
    a.download = "audioRecording.csv";
    a.click();
    document.body.removeChild(a);
  }
  
  render() {
    const message = this.state.connected ? "We're listening to your brain activity!" : "Click the button to connect.";
    
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Eyeris</h1>
        </header>
        
        <p className="App-intro">{ message }</p>
        
        <button onClick={ this.museConnect }>Start brain recording</button>
        <br/>
        <br/>
        <br/>
        
        <ReactMic
          record={this.state.audioRecord}         
          className={"mic"}      
          onStop={this.saveAudioFile}       
          strokeColor={"red"}    
          backgroundColor={"black"}
        />
        <button onClick={ this.startAudioRecording }>Start audio recording</button>
        <button onClick={ this.stopAudioRecording }>Stop audio recording</button>

      </div>
    );
  }
}

export default App;

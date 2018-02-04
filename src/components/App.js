import React from 'react';
import { MuseClient } from 'muse-js';
import { ReactMic } from 'react-mic';

import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      recordingMuse: false,
      recordingAudio: false,
      client: null
    };
    this.connect = this.connect.bind(this);
    this.recordMuse = this.recordMuse.bind(this);
    this.saveCSV = this.saveCSV.bind(this);
    
    this.startAudioRecording = this.startAudioRecording.bind(this);
    this.stopAudioRecording = this.stopAudioRecording.bind(this);
  }
  
  async connect() {
    let client = new MuseClient();
    await client.connect();
    await client.start();
    
    this.setState({
      connected: true,
      client: client
    });
  }
  
  async recordMuse() {
    this.setState({ recordingMuse: true });
    
    let samples = [];
    let client = this.state.client;
    await client.eegReadings.subscribe(reading => {
      reading.samples.forEach(s => {
        samples.push([reading.timestamp, reading.electrode, s]);
      });  
    });
    await window.setInterval(() => this.saveCSV(samples), 5000);
  }
  
  async saveCSV(samples) {
    this.setState({ recordingMuse: false });
    
    const a = document.createElement('a');
    const headers = ["time", "electrode", "microvolts"].join(",");
    const csvData = headers + "\n" + samples.map(item => item.join(",")).join("\n");
    const file = new Blob([csvData], { type: "text/csv" });
    a.href = URL.createObjectURL(file);
    document.body.appendChild(a);
    a.download = "museRecording.csv";
    a.click();
    document.body.removeChild(a);
  }
  
  async startAudioRecording() {
    this.setState({ recordingAudio: true });
  }
  
  async stopAudioRecording() {
    this.setState({ recordingAudio: false });  
  }
  
  async saveAudioFile(recordedBlob) {
    const a = document.createElement('a');
    const file = new Blob([recordedBlob.blobURL], { type: "text/csv" });
    a.href = URL.createObjectURL(file);
    document.body.appendChild(a);
    a.download = "audioRecording.csv";
    a.click();
    document.body.removeChild(a);
  }
  
  render() {
    const button = (this.state.connected) ? 
      <button onClick={ this.recordMuse }>START RECORDING</button> :
      <button onClick={ this.connect }>CONNECT MUSE</button>;
    
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Eyeris</h1>
        </header>
        
        { (this.state.recordingMuse) ? <p>We are recording your brain activity</p> : button }
        
        <br/>
        <br/>
        <br/>
        
        <ReactMic
          record={ this.state.recordingAudio }         
          className={ "mic" }      
          onStop={ this.saveAudioFile }       
          strokeColor={ "red" }    
          backgroundColor={ "black" }
        />
        <button onClick={ this.startAudioRecording }>Start audio recording</button>
        <button onClick={ this.stopAudioRecording }>Stop audio recording</button>
      </div>
    );
  }
}

export default App;

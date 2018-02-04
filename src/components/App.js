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
      this.plot(reading)
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
  
  async plot(reading: EEGReading) {
    const channelNames = [
      'TP9',
      'AF7',
      'AF8',
      'TP10',
      'AUX',
    ];
    const graphTitles = Array.from(document.querySelectorAll('.electrode-item h3'));
    const canvases = Array.from(document.querySelectorAll('.electrode-item canvas'));
    const canvasCtx = canvases.map((canvas) => canvas.getContext('2d'));
  
    graphTitles.forEach((item, index) => {
        item.textContent = channelNames[index];
    });
    
    const canvas = canvases[reading.electrode];
    const context = canvasCtx[reading.electrode];
    if (!context) {
        return;
    }
    const width = canvas.width / 12.0;
    const height = canvas.height / 2.0;
    context.fillStyle = 'green';
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < reading.samples.length; i++) {
        const sample = reading.samples[i] / 15.;
        if (sample > 0) {
            context.fillRect(i * 25, height - sample, width, sample);
        } else {
            context.fillRect(i * 25, height, width, -sample);
        }
    }
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
        
        <div className="electrode-set">
          <div className="electrode-item">
  	        <h3>Electrode 1</h3>
  	        <canvas id="electrode1"></canvas>
          </div>
          
          <div className="electrode-item">
  	        <h3>Electrode 2</h3>
  	        <canvas id="electrode2"></canvas>
          </div>
        </div>
        
        <div className="electrode-set">
          <div className="electrode-item">
  	        <h3>Electrode 3</h3>
  	        <canvas id="electrode3"></canvas>
          </div>
          
          <div className="electrode-item">
  	        <h3>Electrode 4</h3>
  	        <canvas id="electrode4"></canvas>
          </div>
        </div>
        
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
        <br/>
        <br/>
        <button onClick={ this.startAudioRecording }>Start audio recording</button>
        <button onClick={ this.stopAudioRecording }>Stop audio recording</button>

      </div>
    );
  }
}

export default App;

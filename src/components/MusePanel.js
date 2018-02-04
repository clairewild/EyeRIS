import React from 'react';
import { MuseClient, channelNames } from 'muse-js';

import './MusePanel.css';

class MusePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      recordingMuse: false,
      client: null
    };
    this.connect = this.connect.bind(this);
    this.recordMuse = this.recordMuse.bind(this);
    this.saveCSV = this.saveCSV.bind(this);
  }
  
  async connect() {
    let client = new MuseClient();
    await client.connect();
    await client.start();
    
    client.eegReadings.subscribe(reading => {
      this.plot(reading)
    });
    
    this.setState({
      connected: true,
      client: client
    });
  }
  
  recordMuse() {
    this.setState({ recordingMuse: true });
    
    let samples = [];
    let client = this.state.client;

    client.eegReadings.subscribe(reading => {
      reading.samples.forEach(s => {
        samples.push([reading.timestamp, reading.electrode, s]);
      });  
    });
    window.setTimeout(() => this.saveCSV(samples), 5000);
  }
  
  saveCSV(samples) {
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
  
  plot(reading: EEGReading) {
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
  
  renderAnnimation() {
    return ( <p>We are recording your brain activity</p> )
  }
  
  render() {
    const museButton = (this.state.connected) ? 
      <button onClick={ this.recordMuse }>START RECORDING</button> :
      <button onClick={ this.connect }>CONNECT MUSE</button>;
    
    return (
      <div className="MusePanel-div">     
        { (this.state.recordingMuse) ? this.renderAnnimation() : museButton } 
        
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
      </div>
    );
  }
}

export default MusePanel;
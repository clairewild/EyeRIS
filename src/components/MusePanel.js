import React from 'react';
import { MuseClient } from 'muse-js';

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
    await window.setTimeout(() => this.saveCSV(samples), 5000);
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
  
  renderAnnimation() {
    return ( <p>We are recording your brain activity</p> )
  }
  
  render() {
    const museButton = (this.state.connected) ? 
      <button onClick={ this.recordMuse }>START RECORDING</button> :
      <button onClick={ this.connect }>CONNECT MUSE</button>;
    
    return (
      <div className="">     
        { (this.state.recordingMuse) ? this.renderAnnimation() : museButton }      
      </div>
    );
  }
}

export default MusePanel;

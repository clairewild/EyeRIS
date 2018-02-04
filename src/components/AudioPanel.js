import React from 'react';
import { ReactMic } from 'react-mic';

import './AudioPanel.css';

class AudioPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recordingAudio: false
    };  
    this.recordAudio = this.recordAudio.bind(this);
    this.stopAudio = this.stopAudio.bind(this);
    this.saveAudioFile = this.saveAudioFile.bind(this);
  }
  
  recordAudio() {
    this.setState({ recordingAudio: true });
  }
  
  stopAudio() {
    this.setState({ recordingAudio: false });
  }
  
  saveAudioFile(recordedBlob) {
    const a = document.createElement('a');
    const file = new Blob([recordedBlob.blobURL], { type: "text/csv" });
    a.href = URL.createObjectURL(file);
    document.body.appendChild(a);
    a.download = "audioRecording.csv";
    a.click();
    document.body.removeChild(a);
  }
  
  render() {    
    const audioButton = (this.state.recordingAudio) ?
      <button onClick={ this.stopAudio }>STOP AUDIO</button> :
      <button onClick={ this.recordAudio }>RECORD AUDIO</button>;
    
    return (
      <div className="AudioPanel-div">    
        { audioButton }
        
        <ReactMic record={ this.state.recordingAudio }         
                  className="mic"      
                  onStop={ this.saveAudioFile }       
                  strokeColor="red" 
                  backgroundColor="black" />
      </div>
    );
  }
}

export default AudioPanel;

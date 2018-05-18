import React, { Component } from 'react';
import logo from '../assets/logo.svg';
import '../css/App.css';
import AudioBufferLoader from "./audio-buffer-loader";
import Pads from './pads';
import PadParams from './pad-params';
import Screen from "./screen";
import Transport from "./transport";
import BGImg from "../assets/img/background.png";

class App extends Component {
    constructor(props)
    {
        super(props);
        this.clipsReady = false;
        this.clipTags = [];
        try 
        {
            this._audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this._audioClipEngine = new AudioBufferLoader(this._audioContext, (inClipTags) => {
                this.clipTags = inClipTags;
                this.clipsReady = true;
            });
        }
        catch (err) 
        {
            alert("This app doesn't seem to be availible for your browser. Sorry about that. We recommend Firefox or Chrome")
        }
    }

    ctrlChanged = (e) => {

    }

    render() 
    {
        const style = {
            backgroundImage: 'url(' + BGImg + ')'
        };
        const waveform = this.clipsReady ? this._audioClipEngine.getClip("kick1") : null;
        return (
          <div className="App">
            <div className="panel-bg" style={ style }>
                <Screen waveform={waveform}></Screen>
                {this.clipsReady ? <Pads className="pads" clips={this.clipTags} onChange={this.ctrlChanged}></Pads> : null}
            </div>
          </div>
        );
    }
}

export default App;

import React, { Component } from 'react';
import logo from '../assets/logo.svg';
import '../css/App.css';
import AudioClipEngine from "./audio-clip-engine";
import Pads from './pads';
import Screen from "./screen";
import BGImg from "../assets/img/bg-rough.png";

class App extends Component {
    constructor(props)
    {
        super(props);
        this.clipsReady = false;
        this.clipTags = [];
        try 
        {
            this._audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this._audioClipEngine = new AudioClipEngine(this._audioContext, (inClipTags) => {
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
        return (
          <div className="App">
            <div className="panel-bg" style={ style }>
                <Screen></Screen>
                {this.clipsReady ? <Pads className="pads1 pads" clips={this.clipTags} onChange={this.ctrlChanged}></Pads> : null}
                {this.clipsReady ? <Pads className="pads2 pads" clips={this.clipTags} onChange={this.ctrlChanged}></Pads> : null}
            </div>
          </div>
        );
    }
}

export default App;

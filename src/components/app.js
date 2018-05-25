import React, { Component } from 'react';
import logo from '../assets/logo.svg';
import '../css/App.css';
import AudioBufferLoader from "../audio-buffer-loader";
import Controls from './controls';
import Screen from "./screen";
import Transport from "./transport";
import BGImg from "../assets/img/background.png";

class App extends Component {
    constructor(props)
    {
        super(props);
        this.clipsReady = false;
        // this._audioClips = {};
        this._audioContext =  new AudioContext();
        this._audioClipEngine = new AudioBufferLoader(this._audioContext);
        this._audioClipEngine.loadClips().then((clips) => {
             this._audioClips = clips;
             this.clipsReady = true;
        });
        this.state = {tag: ""};
    }

    clipsLoaded()
    {

    }

    onChange(e)
    {
        if(this.clipsReady)
        {
            const type = e.type;
            if(type === "play")
            {
                const tag = Object.keys(this._audioClips)[e.id];
                // this._audioClips[tag].play();
                this.setState(prevState => ({
                  tag: tag
                }));
                this.screen.play(this._audioClips[tag], e.color);
            }
        }
    }

    render() 
    {
        const style = {
            backgroundImage: 'url(' + BGImg + ')'
        };
        const clip = this.clipsReady ? this.state.tag : null;
        return (
          <div className="App">
            <div className="panel-bg" style={ style }>
                <div className="panel-top">
                    <Screen
                    className="screen" 
                    context={this._audioContext}
                    clip={this.clipsReady ? this._audioClips[clip] : null}
                    ref={node => this.screen = node}
                    ></Screen>
                </div>
                <Controls 
                className="pads" 
                onChange={e => this.onChange(e)}
                ></Controls>
            </div>
          </div>
        );
    }
}

export default App;

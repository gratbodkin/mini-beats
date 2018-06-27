import React, { Component } from 'react';
import logo from '../assets/logo.svg';
import '../css/App.css';
import AudioBufferLoader from "../audio-buffer-loader";
import ChannelNode from "../channel-node";
import Controls from './controls';
import Screen from "./screen";
import Transport from "./transport";
import MenuControls from "./menu-controls";
import BGImg from "../assets/img/background.png";

const numChannels = 8;

class App extends Component {
    constructor(props)
    {
        super(props);
        this.state = {tag: ""};
        this.clipsReady = false;
        this._audioClips = {};
        this._channels = [];
        //Create audio graph components
        this._audioContext =  new AudioContext();
        this._masterGain = this._audioContext.createGain();
        this._channelMerger = this._audioContext.createChannelMerger(8);
        this._analyser = this._audioContext.createAnalyser();
        this._compressor = this._audioContext.createDynamicsCompressor();
        this._analyser.smoothingTimeConstant = 0.4;
        this._analyser.fftSize = 1024;
        this._bufferLength = this._analyser.frequencyBinCount;
        // this._freqDataArray = new Float32Array(this._bufferLength);
        // this._timeDataArray = new Float32Array(this._bufferLength);
        //Import audio clips
        this._audioClipEngine = new AudioBufferLoader(this._audioContext);
        this._audioClipEngine.loadClips().then((clips) => {
        this._audioClips = clips;
        this.clipsReady = true;
        const keys = Object.keys(this._audioClips);
        //Connect audio graph components
        for(let i = 0; i < 8; i++)
        {
            this._channels[i] = new ChannelNode(this._audioContext);
            this._channels[i].getGain().connect(this._channelMerger);
            this._channels[i].setClip(this._audioClips[keys[i]]);
        }

        this._channelMerger.connect(this._analyser);
        this._analyser.connect(this._compressor);
        this._compressor.connect(this._masterGain);
        this._masterGain.connect(this._audioContext.destination);

        });
    }

    onChange(e)
    {
        if(this.clipsReady)
        {
            const action = e.action;
            if(action === "play")
            {
                this._channels[e.tag].play();
                // this._screen.setBuffer(this._channels[e.tag].getBuffer().getChannelData(0));
                // this._analyser.getFloatFrequencyData(this._freqDataArray);
                this.setState(prevState => ({
                  tag: e.tag
                }));
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
                    <Transport
                        ref={node => this._transport = node}
                        onChange={e => this.onChange(e)}
                    ></Transport>
                    <Screen
                    ref={node => this._screen = node}
                    className="screen"
                    audioContext={this._audioContext}
                    ></Screen>
                    <MenuControls
                        onChange={e => this.onChange(e)}
                    ></MenuControls>
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

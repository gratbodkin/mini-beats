import React, { Component } from 'react';
import logo from '../assets/logo.svg';
import '../css/App.css';
import AudioBufferLoader from "../audio-buffer-loader";
import ChannelNode from "../channel-node";
import Controls from './controls';
import Screen from "./screen";
import Transport from "./transport";
import MenuControls from "./menu-controls";
import BGImg from "../assets/img/bg-new3.png";

const numChannels = 8;

class App extends Component {
    constructor(props)
    {
        super(props);
        this.state = {deck1: "", deck2: ""};
        this.clipsReady = false;
        this._audioClips = {};
        this._channels = [];
        //Create audio graph components
        this.audioContext =  new AudioContext();
        this._masterGain = this.audioContext.createGain();
        this._channelMerger = this.audioContext.createChannelMerger(8);
        this._analyser = this.audioContext.createAnalyser();
        this._compressor = this.audioContext.createDynamicsCompressor();
        this._analyser.smoothingTimeConstant = 0.4;
        this._analyser.fftSize = 1024;
        this._bufferLength = this._analyser.frequencyBinCount;
        this._audioClipEngine = new AudioBufferLoader(this.audioContext);
        this._audioClipEngine.loadClips().then((clips) => {
            this._audioClips = clips;
            const keys = Object.keys(this._audioClips);
            this._channels[0] = new ChannelNode(this.audioContext);
            this._channels[0].getGain().connect(this._channelMerger);
            this._channels[0].setClip(this._audioClips["loop1"]);

            this._channels[1] = new ChannelNode(this.audioContext);
            this._channels[1].getGain().connect(this._channelMerger);
            this._channels[1].setClip(this._audioClips["loop2"]);
            //Connect audio graph components
            // for(let i = 1; i < 8; i++)
            // {
            //     this._channels[i] = new ChannelNode(this.audioContext);
            //     this._channels[i].getGain().connect(this._channelMerger);
            //     this._channels[i].setClip(this._audioClips[keys[i]]);
            // }

            this._channelMerger.connect(this._analyser);
            this._analyser.connect(this._compressor);
            this._compressor.connect(this._masterGain);
            this._masterGain.connect(this.audioContext.destination);
            this.clipsReady = true;
        });
    }

    onChange(e)
    {
        if(this.clipsReady)
        {
            const action = e.action;
            let cmdObj = {};
            if(action === "play")
            {
                let clip = this._channels[e.tag].getClip();
                cmdObj = {clip: clip, deck: e.deck, action :action};
                if(clip.isPlaying())
                {
                    cmdObj.action = "pause";
                    clip.pause(this.audioContext.currentTime);
                }
                else
                {
                    // this.setState(prevState => ({
                    //   deck1: e.tag
                    // }));
                    clip.play(this._channels[e.deck].getGain(), 1.0);
                }
            }
            if(action === "stop")
            {
                let clip = this._channels[e.tag].getClip();
                clip.stop(this.audioContext.destination);
            }
            this._screen.setCmd(cmdObj);
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
                    ref={node => this._screen = node}
                    className="screen"
                    audioContext={this.audioContext}
                    ></Screen>
                </div>
                <Controls 
                className="controls"
                onChange={e => this.onChange(e)}
                ></Controls>
            </div>
          </div>
        );
    }
}

export default App;

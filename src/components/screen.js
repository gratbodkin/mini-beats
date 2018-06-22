import React, { Component } from 'react';
import WaveSurfer from "wavesurfer.js";
import Waveform from "./waveform";

export default class Screen extends Component {
    constructor(props)
    {
        super(props);
        this.state = {tag: ""};
    }

    componentDidMount() 
    {   
        this.wavesurfer = WaveSurfer.create({
          container: this.waveformEl,
          waveColor: "#aaaaaa",
          progressColor: "#888888",
          height: "75"
        });
         
        this.wavesurfer.on('ready', (e) => {
            this.wavesurfer.params.container.style.opacity = 0.9;
        });
    }

    componentWillUnmount() 
    {

    }  

    render() {
        return (
                <div className="screen" 
                ref={node => this.el = node}
                >
                    <div className="sample-info-display">
                        {this.state.tag}
                    </div>
                    <Waveform freqData={this.props.freqData} bufferLength={this.props.bufferLength}></Waveform>
                    <div className="waveform-display" ref={node => this.waveformEl = node}></div>
                    <div className="fn-info-display">
                    </div>
                </div> 
        );
    }
}
import React, { Component } from 'react';
import WaveSurfer from "wavesurfer.js";
import Waveform from "./waveform";

export default class Screen extends Component {
    constructor(props)
    {
        super(props);
        // this.state = {freqData: null};
    }

    componentDidMount() 
    {   
        this._waveform = new Waveform(this.canvas, this.props.audioContext);
    }

    componentWillUnmount() 
    {

    }  

    setBuffer(inData)
    {
        this._waveform.setBuffer(inData);
    }

    render() {
        return (
                <div className="screen" ref={node => this.containerEl = node}>
                    <div className="sample-info-display"></div>
                    <canvas width="397" height="194" ref={node => this.canvas = node}></canvas>
                    <div className="fn-info-display"></div>
                </div> 
        );
    }
}
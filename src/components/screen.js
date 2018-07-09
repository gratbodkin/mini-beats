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
        this.context = this.canvas.getContext("2d");
    }

    componentWillUnmount() 
    {

    }  

    setClip(inClip)
    {
        this._waveform.setClip(inClip);
    }

    getHeight(){ return this.canvas.height;}
    getWidth(){ return this.canvas.width;}

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
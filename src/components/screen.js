import React, { Component } from 'react';
import WaveSurfer from "wavesurfer.js";
import Waveform from "./waveform";
// import Waveform from "./waveform2";

export default class Screen extends Component {
    constructor(props)
    {
        super(props);
    }

    componentDidMount() 
    {   
        this.decks = {
            0: new Waveform(this.canvasA, this.props.audioContext),
            1: new Waveform(this.canvasB, this.props.audioContext),
        }
    }

    componentWillUnmount() 
    {

    }  

    setCmd(inObj)
    {
        if(inObj.deck in this.decks)
        {
            this.decks[inObj.deck].setClip(inObj);
        }

    }

    getHeight(){ return this.canvas.height;}
    getWidth(){ return this.canvas.width;}

    render() {
        return (
                <div className="screen" ref={node => this.containerEl = node}>
                    <canvas width="874" height="190" ref={node => this.canvasA = node}></canvas>
                     <canvas width="874" height="190" ref={node => this.canvasB = node}></canvas>
                </div> 
        );
    }
}
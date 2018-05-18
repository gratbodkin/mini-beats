import React, { Component } from 'react';
import WaveSurfer from "wavesurfer.js";

export default class Pads extends Component {
    constructor(props)
    {
        super(props);
    }  

    render() {
        // const style = {
        //     backgroundImage: 'url(' + ScreenBG + ')'
        // };
        if(this.props.waveform)
        {
            var wavesurfer = WaveSurfer.create({
              container: '#waveform',
              waveColor: 'red',
              progressColor: 'purple'
            });
        }
        return (
            <div className="screen-container">
                
            <div className="screen" 
            ref={node => this.el = node}
            ></div>  
            </div>
        );
    }
}
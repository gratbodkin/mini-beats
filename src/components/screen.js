import React, { Component } from 'react';
import WaveSurfer from "wavesurfer.js";

export default class Pads extends Component {
    constructor(props)
    {
        super(props);
    }

    componentDidMount() 
    {   
        this.wavesurfer = WaveSurfer.create({
          container: this.el,
          waveColor: 'red',
          progressColor: 'purple'
        });
    }

    componentWillUnmount() 
    {

    }  

    render() {

        if(this.props.clip)
        {
            this.wavesurfer.loadDecodedBuffer(this.props.clip._buffer)
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
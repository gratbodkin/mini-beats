import React, { Component } from 'react';
import WaveSurfer from "wavesurfer.js";

export default class Screen extends Component {
    constructor(props)
    {
        super(props);
        this.state = {tag: "foo"};
    }

    componentDidMount() 
    {   
        this.wavesurfer = WaveSurfer.create({
          container: this.waveformEl,
          waveColor: "#aaaaaa",
          progressColor: "#888888",
          height: "75"
        });
         
        // this.wavesurfer.on('ready', (e) => {
        //     wavesurfer.params.container.style.opacity = 0.9;
        // });
    }

    componentWillUnmount() 
    {

    }  

    play(inClip, inColor)
    {
        this.wavesurfer.loadDecodedBuffer(inClip._buffer);
        // this.wavesurfer.params.waveColor = inColor;
        // this.wavesurfer.params.progressColor = inColor;
        this.wavesurfer.play();
        this.setState(prevState => ({
          tag: inClip.getTag()
        }));
    }


    render() {
        return (
                <div className="screen" 
                ref={node => this.el = node}
                >
                    <div className="sample-info-display">
                        {this.state.tag}
                    </div>
                    <div className="waveform-display" ref={node => this.waveformEl = node}></div>
                    <div className="fn-info-display">
                    </div>
                </div> 
        );
    }
}
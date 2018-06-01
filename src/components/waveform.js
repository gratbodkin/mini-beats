import React, { Component } from 'react';
import * as mb from "../defs";

export default class Waveform extends Component {
    constructor(props)
    {
        super(props);
    }  

    componentDidMount() 
    {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.height this.el.getCalculatedStyle.height;
        this.canvas.width this.el.getCalculatedStyle.width;
    }

    componentWillUnmount() 
    {
        $(this.el).off("pointerdown");
    }

    render() {
        return (
            <div className="waveform-container"
            ref={node => this.el = node}
            >

            </div>
        );
    }
}
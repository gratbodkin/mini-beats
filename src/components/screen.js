import React, { Component } from 'react';
import ScreenBG from "../assets/img/screen.png";

export default class Pads extends Component {
    constructor(props)
    {
        super(props);
    }  

    render() {
        const style = {
            backgroundImage: 'url(' + ScreenBG + ')'
        };
        return (
            <div className="screen" 
            ref={node => this.el = node}
            style={style}
            ></div>
        );
    }
}
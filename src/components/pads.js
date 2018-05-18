import React, { Component } from 'react';
import Channel from "./channel";

const kNumChannels = 8;

export default class Pads extends Component {
    constructor(props)
    {
        super(props);
    }  

    onPadTouch = () =>
    {

    };

    onPadRelease = () =>
    {

    };

    render() {
        return (
            <div className={this.props.className}>
                {this.props.clips.map((el)=>{
                    return <Channel className="channel" key={el} onPadTouch={this.onPadTouch}></Channel>
                })}
            </div>
        );
    }
}
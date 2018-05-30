import React, { Component } from 'react';
import Knob from './knob';
import Button from "./button";
import SmBtnBG from "../assets/img/btn-black-off.png";
import PadBG from "../assets/img/btn-pad-off.png";
// import PadOffBtn from "../assets/img/pad-min.png";

export default class Channel extends Component {
    constructor(props)
    {
        super(props);
    }  

    onChange(e)
    {
        if(e.type === "down")
        {
            this.props.onChange({type: "play", id: this.props.tag});
        }
    }

    render() {
        return (
            <div className={this.props.className}>
                <Button bg={SmBtnBG} color={this.props.color} className="radio fill" onChange={e => this.onChange(e)}></Button>
                <Knob className="knob" color={this.props.color} onChange={e => this.onChange(e)}></Knob>
                <Knob className="knob" color={this.props.color} onChange={e => this.onChange(e)}></Knob>
                <Knob className="knob" color={this.props.color} onChange={e => this.onChange(e)}></Knob>
                <Button bg={PadBG} color={this.props.color} className="pad fill" onChange={e => this.onChange(e)}></Button>
            </div>
        );
    }
}
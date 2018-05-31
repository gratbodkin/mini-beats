import React, { Component } from 'react';
import Knob from './knob';
import Button from "./button";
import SmBtnBG from "../assets/img/btn-black-off.png";
import PadBG from "../assets/img/btn-pad-off.png";

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
                <Button bg={SmBtnBG} color={this.props.color} className="radio" onChange={e => this.onChange(e)}></Button>
                <Knob className="knob outline" color={this.props.color} onChange={e => this.onChange(e)}></Knob>
                <Knob className="knob outline" color={this.props.color} onChange={e => this.onChange(e)}></Knob>
                <Knob className="knob outline" color={this.props.color} onChange={e => this.onChange(e)}></Knob>
                <Button bg={PadBG} color={this.props.color} className="pad" onChange={e => this.onChange(e)}></Button>
            </div>
        );
    }
}
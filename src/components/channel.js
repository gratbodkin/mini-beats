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
            this.props.onChange(e);
        }
    }

    render() {
        return (
            <div className={this.props.className}>
                <Button bg={SmBtnBG} tag={this.props.tag} color={this.props.color} className="btn-sml fill" action="select" onChange={e => this.onChange(e)}></Button>
                <Knob className="knob outline" tag={this.props.tag}  color={this.props.color} onChange={e => this.onChange(e)}></Knob>
                <Knob className="knob outline" tag={this.props.tag}  color={this.props.color} onChange={e => this.onChange(e)}></Knob>
                <Knob className="knob outline" tag={this.props.tag}  color={this.props.color} onChange={e => this.onChange(e)}></Knob>
                <Button bg={PadBG} tag={this.props.tag}  color={this.props.color} className="pad fill" action="play" onChange={e => this.onChange(e)}></Button>
            </div>
        );
    }
}
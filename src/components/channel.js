import React, { Component } from 'react';
import Knob from './knob';
import Button from "./button";
import SmBtnBG from "../assets/img/btn-black-off.png";
import PadBG from "../assets/img/btn-pad-off.png";
import * as mb from "../defs";
const channelColors = [mb.kRed, mb.kOrange, mb.kYellow, mb.kGreen, mb.kTurq, mb.kBlue, mb.kViolet, mb.kPink];

export default class Channel extends Component {
    constructor(props)
    {
        super(props);
    }  

    onChange(e)
    {
        if(e.type === "down")
        {
            e.deck = this.props.deck;
            this.props.onChange(e);
            if(e.action === "stop")
            {
                this.playbtn.setValue(false);
            }
        }
    }

    render() {
        const style = 
        {
            width: "100%"
        };
        return (
            <div className={this.props.className}>
                <div className="chan-knobs chan-section">
                    <Knob bg={SmBtnBG} tag={this.props.tag} color={this.props.color} className="chan-knob top-btn--l fill" action="volume-off" onChange={e => this.onChange(e)}></Knob>
                    <Knob bg={SmBtnBG} tag={this.props.tag} color={this.props.color} className="chan-knob top-btn--l fill" action="volume-off" onChange={e => this.onChange(e)}></Knob>
                </div>
                <div className="chan-sml-btns chan-section">
                    <Button bg={SmBtnBG} tag={this.props.tag} color={this.props.color} className="btn-sml top-btn-r fill" action="undo" onChange={e => this.onChange(e)}></Button>
                    <Button bg={SmBtnBG} tag={this.props.tag} color={this.props.color} className="btn-sml fill" action="backward" onChange={e => this.onChange(e)}></Button>
                    <Button bg={SmBtnBG} tag={this.props.tag} color={this.props.color} className="btn-sml fill" action="forward" onChange={e => this.onChange(e)}></Button>
                </div>
                <div className="chan-big-btns chan-section">
                    <Button bg={PadBG} tag={this.props.tag}  color={mb.kRed} className="pad fill" action="stop" onChange={e => this.onChange(e)}></Button>
                    <Button bg={PadBG} tag={this.props.tag}  color={mb.kGreen} className="pad fill" action="play" latch="true" onChange={e => this.onChange(e)} ref={node => this.playbtn = node}></Button>
                </div>
            </div>
        );
    }
}
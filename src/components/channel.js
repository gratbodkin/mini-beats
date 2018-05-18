import React, { Component } from 'react';
import Knob from './knob';
import PadButton from "./pad-button";
import RadioButton from "./radio-button";

export default class Channel extends Component {
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
                <RadioButton className="radio-button" onPadTouch={this.onPadTouch}></RadioButton>
                <Knob className="knob" onPadTouch={this.onPadTouch}></Knob>
                <Knob className="knob" onPadTouch={this.onPadTouch}></Knob>
                <Knob className="knob" onPadTouch={this.onPadTouch}></Knob>
                <PadButton onPadTouch={this.onPadTouch}></PadButton>
            </div>
        );
    }
}
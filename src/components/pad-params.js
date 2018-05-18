import React, { Component } from 'react';
import Knob from './knob';

export default class PadParams extends Component {
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
                <Knob onPadTouch={this.onPadTouch}></Knob>
                <Knob onPadTouch={this.onPadTouch}></Knob>
                <Knob onPadTouch={this.onPadTouch}></Knob>
            </div>
        );
    }
}
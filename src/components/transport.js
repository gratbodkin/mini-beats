import React, { Component } from 'react';
import Button from './button';
import Knob from './knob';
import BG from "../assets/img/btn-black-off.png";
import * as mb from "../defs";

export default class Transport extends Component {
    constructor(props)
    {
        super(props);
    }  

    onChange(e)
    {
        this.props.onChange(e);
    }

    render() {
        return (
            <div className="transport">
                <Button bg={BG} color={mb.kGreen} className="transport" onChange={e => this.onChange(e)}></Button>
                <Button bg={BG} color={mb.kGreen} className="transport" onChange={e => this.onChange(e)}></Button>
                <Button bg={BG} color={mb.kGreen} className="transport" onChange={e => this.onChange(e)}></Button>
                <Knob className="knob" color={this.props.color} onChange={e => this.onChange(e)}></Knob>
            </div>
        );
    }
}
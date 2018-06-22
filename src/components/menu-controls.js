import React, { Component } from 'react';
import Button from './button';
import Knob from './knob';
import BG from "../assets/img/btn-black-off.png";
import * as mb from "../defs";

export default class MenuControls extends Component {
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
            <div className="menu">
                <Button bg={BG} color={mb.kGreen} className="" onChange={e => this.onChange(e)}></Button>
                <Button bg={BG} color={mb.kGreen} className="" onChange={e => this.onChange(e)}></Button>
                <Button bg={BG} color={mb.kGreen} className="" onChange={e => this.onChange(e)}></Button>
                <Button bg={BG} color={mb.kGreen} className="" onChange={e => this.onChange(e)}></Button>
                <Button bg={BG} color={mb.kGreen} className="" onChange={e => this.onChange(e)}></Button>
                <Button bg={BG} color={mb.kGreen} className="" onChange={e => this.onChange(e)}></Button>
                <Button bg={BG} color={mb.kGreen} className="" onChange={e => this.onChange(e)}></Button>
                <Button bg={BG} color={mb.kGreen} className="" onChange={e => this.onChange(e)}></Button>
                <Button bg={BG} color={mb.kGreen} className="" onChange={e => this.onChange(e)}></Button>
            </div>
        );
    }
}
import React, { Component } from 'react';
import Channel from "./channel";
import * as mb from "../defs";

const buttonColors = [mb.kOrange, mb.kViolet];
const channelColors = [mb.kRed, mb.kOrange, mb.kYellow, mb.kGreen, mb.kTurq, mb.kBlue, mb.kViolet, mb.kPink];

export default class Controls extends Component {
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
            <div className={this.props.className}>
            {buttonColors.map((el, index)=>{
                    return <Channel className="channel" deck={index} color={el} key={index} onChange={e => this.onChange(e)} tag={index}></Channel>
                })}
            </div>
        );
    }
}
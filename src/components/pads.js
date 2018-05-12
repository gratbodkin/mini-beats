import React, { Component } from 'react';
import PadButton from './pad-button';

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
                    return <PadButton key={el} onPadTouch={this.onPadTouch}></PadButton>
                })}
            </div>
        );
    }
}
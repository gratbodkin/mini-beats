import React, { Component } from 'react';
import PadButton from './pad-button';

export default class Transport extends Component {
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

            </div>
        );
    }
}
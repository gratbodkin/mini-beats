import React, { Component } from 'react';
import PropTypes from 'prop-types'
import * as mb from "../defs";
import PEP from "pepjs";
import $ from "jquery";

export default class Button extends Component {
    constructor(props)
    {
        super(props);
        this.state = {isActive: false};
        this.bgStyle = {
            backgroundImage: 'url(' + this.props.bg + ')'
        };
    }

    componentDidMount() 
    {
        $(this.el).on("pointerdown",  e => this.onPointerDown(e));
    }

    componentWillUnmount() 
    {
        $(this.el).off("pointerdown");
    }

    onPointerDown(e)
    {
        this.el.setPointerCapture(e.pointerId);
        $(this.el).on("pointerup", (e) => {this.onPointerUp(e)});
        this.setState(prevState => ({
          isActive: true
        }));
        const evt = {type: "down", key: this.key};
        this.props.onChange(evt);
    }

    onPointerUp(e)
    {
        this.el.releasePointerCapture(e.pointerId);
        $(this.el).off("pointerup");
        this.setState(prevState => ({
          isActive: false
        }));
        const evt = {type: "up", key: this.key};
        this.props.onChange(evt);
    }
   

    render() {
        let classList = this.props.className + " button " + this.props.color;
        classList += this.state.isActive ? " active"  : "";
        return (
            <div 
            className= {classList}
            ref={node => this.el = node}
            style={this.bgStyle}
            ></div>
        );

    }
}

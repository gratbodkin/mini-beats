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
          isActive: this.props.latch === undefined ? true : !this.state.isActive
        }));
        this.el.classList.add("active");
        const evt = {
            type: "down", 
            tag: this.props.tag,
            action: this.props.action
        };
        return this.props.onChange(evt);
    }

    onPointerUp(e)
    {
        this.el.releasePointerCapture(e.pointerId);
        $(this.el).off("pointerup");
        if(this.props.latch === undefined)
        {
            this.setState(prevState => ({
              isActive: false
            }));
        }
        const evt = {type: "up", key: this.key};
        this.props.onChange(evt);
    }

    setValue(inValue)
    {
        this.setState(prevState => ({
          isActive: inValue
        }));
    }
   

    render() {
        let classList = this.props.className + " button " + this.props.color;
        let textClassList = "btn-text fa fa-" + this.props.action;
        classList += this.state.isActive ? " active"  : "";
        const btnText = this.props.text ? this.props.text : "";
        return (
            <div 
            className= {classList}
            ref={node => this.el = node}
            style={this.bgStyle}
            ><label className={textClassList}>{btnText}</label></div>
        );

    }
}

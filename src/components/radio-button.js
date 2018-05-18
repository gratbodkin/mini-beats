import React, { Component } from 'react';
import BtnOff from "../assets/img/btn-black-off.png";
import BtnOn from "../assets/img/btn-black-on.png";
import PEP from "pepjs";
import $ from "jquery";

export default class RadioButton extends Component {
    constructor(props)
    {
        super(props);
        this.state = {isToggleOn: false};
    }

    componentDidMount() 
    {
        $(this.el).on("pointerdown", this.pointerDown);
    }

    componentWillUnmount() 
    {

    }

    pointerDown = (e) => 
    {
        this.el.setPointerCapture(e.pointerId);
        $(this.el).on("pointerup", this.pointerUp);
        this.setState(prevState => ({
          isToggleOn: true
        }));
        this.props.onPadTouch(this.key);
    }

    pointerUp = (e) => 
    {
        this.el.releasePointerCapture(e.pointerId);
        $(this.el).off("pointerup");
        this.setState(prevState => ({
          isToggleOn: false
        }));
    }
   

    render() {
        const bg = this.state.isToggleOn ? BtnOn : BtnOff;
        const style = {
            backgroundImage: 'url(' + bg + ')'
        };
        return (
            <div className="radio-button" 
            ref={node => this.el = node}
            style={style}
            ></div>
        );
    }
}
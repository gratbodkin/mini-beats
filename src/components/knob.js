import React, { Component } from 'react';
import KnobBG from "../assets/img/knob-matt-bg.png";
import PEP from "pepjs";
import $ from "jquery";

const kCtrlHW = 60;
const kRadianRangeScalar = 1.5;
const kMinRadScalar = 0.75;
const kRadianMax = kRadianRangeScalar * Math.PI;
const kRadianMin = kMinRadScalar * Math.PI;
const kOutlineRadius = 1.75;
const kOutlineMin = kCtrlHW * 0.475;
const kInnerMin = kCtrlHW * 0.35;
const kInnerRadius = kCtrlHW * 0.05;
const kClockHandRadius = 0.05;
const kDarkishYellow = "#FFB80D";
const kLightGrey = "#353535";
/*
Creates a custom output handler that draws a simple rotary control using the html5 canvas API
*/
export default class Knob extends Component
{
    constructor(props)
    {
        super(props);
        this.mounted = false;
    }

    componentDidMount() 
    {
        this.context = this.el.getContext("2d");
        $(this.el).on("pointerdown", this.pointerDown);
        this.centerX = this.el.width / 2;
        this.centerY = this.el.height / 2;
        this.update(0.5);
    }

    componentWillUnmount() 
    {

    }

    // componentDidUpdate() 
    // {
    //     this.update();
    // }

    update(inValue = 0)
    {
        if(this.el)
        {
            let radVal = this._normValueToRadians(inValue);
            this.el.getContext("2d").clearRect(0, 0, this.el.width, this.el.height);
            this._drawArcs(radVal);
        }
    }

    _normValueToRadians(inNormValue)
    {
        return ((inNormValue * kRadianRangeScalar) + kMinRadScalar) * Math.PI;
    }

    _drawArcs(inRadVal)
    {
        // draw "clock hand" indicator line
        this._drawArc(0, kInnerMin, inRadVal - kClockHandRadius, inRadVal);
        // draw inner arc showing total control range
        this._drawArc(kInnerMin, kInnerMin + kInnerRadius, kRadianMin, kRadianMin + kRadianMax,
                      kLightGrey);
        // draw arc for inValue
        this._drawArc(kInnerMin, kInnerMin + kInnerRadius, kRadianMin, inRadVal);
        // draw outer cirle
        //this._drawArc(kOutlineMin, kOutlineMin + kOutlineRadius, Math.PI * 0, Math.PI * 2);
    }

    _drawArc(kInnerRadius, outterRadius, sRadian, eRadian, inFillStyle = "rgba(0,255,255,0.75)")
    {
        this.el.getContext("2d").beginPath();
        this.el.getContext("2d").arc(this.centerX, this.centerY, outterRadius, sRadian, eRadian, false);
        this.el.getContext("2d").arc(this.centerX, this.centerY, kInnerRadius, eRadian, sRadian, true);
        this.el.getContext("2d").closePath();
        this.el.getContext("2d").fillStyle = inFillStyle;
        this.el.getContext("2d").strokeStyle = this.context.fillStyle;
        this.el.getContext("2d").fill();
    }

    render() {
        const bgStyle = {
            backgroundImage: 'url(' + KnobBG + ')'
        };
        const classList = "knob " + this.props.className;
        if(this.el)
        {
            this.update(0);
        }
        return (
            <div className={classList} style={bgStyle}>
                <canvas ref={node => this.el = node} width={kCtrlHW} height={kCtrlHW} className="chan-knob-inner"/>
            </div>
        );
    }
}
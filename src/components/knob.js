import React, { Component } from 'react';
import KnobBG from "../assets/img/knob-matt-bg.png";
import PEP from "pepjs";
import $ from "jquery";

const kCtrlHW = 50;
const kRadianRangeScalar = 1.5;
const kMinRadScalar = 0.75;
const kRadianMax = kRadianRangeScalar * Math.PI;
const kRadianMin = kMinRadScalar * Math.PI;
const kOutlineRadius = 1.5;
const kOutlineMin = kCtrlHW * 0.475;
const kInnerMin = kCtrlHW * 0.35;
const kInnerRadius = kCtrlHW * 0.11;
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
        // this.context = this.el.getContext("2d");
        // $(this.el).on("pointerdown", this.pointerDown);
        // this.centerX = this.el.width / 2;
        // this.centerY = this.el.height / 2;
        // this.context = this.el.getContext("2d");
        // this.update(0.5);
    }

    componentWillUnmount() 
    {

    }

    componentDidUpdate() 
    {
        this.update();
    }

    update(inValue = 0)
    {
        // let radVal = this._normValueToRadians(inValue);
        // this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        // this._drawArcs(radVal);
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
        this._drawArc(kOutlineMin, kOutlineMin + kOutlineRadius, Math.PI * 0, Math.PI * 2);
    }

    _drawArc(kInnerRadius, outterRadius, sRadian, eRadian, inFillStyle = kDarkishYellow)
    {
        this.context.beginPath();
        this.context.arc(this.centerX, this.centerY, outterRadius, sRadian, eRadian, false);
        this.context.arc(this.centerX, this.centerY, kInnerRadius, eRadian, sRadian, true);
        this.context.closePath();
        this.context.fillStyle = inFillStyle;
        this.context.strokeStyle = this.context.fillStyle;
        this.context.fill();
    }

    render() {
        const bgStyle = {
            backgroundImage: 'url(' + KnobBG + ')'
        };
        const classList = "knob " + this.props.className;
        return (
            <div className={classList}
            ref={node => this.el = node}
            style={bgStyle}
            ></div>
        );
        // return (
        //     <div className="knob" 
        //     ref={node => this.el = node}
        //     style={bgStyle}
        //     >
        //         <div className="knob-dot" 
        //         ref={node => this.el = node}
        //         style={knobStyle}
        //         ></div>
        //     </div>
        // );
        // if(this.mounted)
        // {
        //     this.update();
        // }
        // return (
        //     <canvas ref={node => this.el = node} width={kCtrlHW} height={kCtrlHW} className={this.props.className}/>
        // );
    }
}
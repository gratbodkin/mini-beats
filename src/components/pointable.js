import React, { Component } from 'react';
import PEP from "pepjs";
import $ from "jquery";

export default class Pointable extends Component {
    constructor(props)
    {
        super(props);
    }

    getDefaultProps()
    {
        return {
            draggable: false,
            range: 0
        };
    }

    componentDidMount() 
    {
        $(this.el).on("pointerdown", this.pointerDown);
    }

    componentWillUnmount() 
    {
        $(this.el).off("pointerdown");
    }

    pointerDown = (e) => 
    {
        this.el.setPointerCapture(e.pointerId);
        if(this.props.draggable)
        {
            $(this.el).on("pointermove", this.pointerUp);
        }
        $(this.el).on("pointerup", this.pointerUp);
    }

    pointerUp = (e) => 
    {
        this.el.releasePointerCapture(e.pointerId);
        $(this.el).off("pointerup");
        if(this.props.draggable)
        {
            $(this.el).off("pointermove");
        }
    }

    pointerMoved = (e) => 
    {
        const deltaX = -e.originalEvent.deltaX;
        const deltaY = -e.originalEvent.deltaY;
        const mouseDiff = deltaX - deltaY;
    }
   

    render() {
        return (
            <div className="pointable" 
            ref={node => this.el = node}
            style={style}
            ></div>
        );
    }
}
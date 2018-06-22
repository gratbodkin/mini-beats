import React, { Component } from 'react';
import * as mb from "../defs";
import $ from "jquery";

const RMS = values => Math.sqrt(
  values.reduce((sum, value) => sum + Math.pow(value, 2), 0) / values.length
);
const avg = values => values.reduce((sum, value) => sum + value, 0) / values.length;
const max = values => values.reduce((max, value) => Math.max(max, value), 0);

export default class Waveform extends Component {
    constructor(props)
    {
        super(props);
    }  

    componentDidMount() 
    {
        // this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        // this.canvas.height = this.el.getCalculatedStyle(this.canvas.height;
        // this.canvas.width = this.el.getCalculatedStyle.this.canvas.width;
        // this.el.appendChild(this.canvas);
    }

    componentWillUnmount() 
    {
        $(this.el).off("pointerdown");
    }

    // getWaveformData(audioBuffer, dataPoints) 
    // {
    //   var bufferLength = 1024
    //   const leftChannel = audioBuffer.getChannelData(0);
    //   const rightChannel = audioBuffer.getChannelData(1);
    //   const values = new Float32Array(dataPoints);
    //   const dataWindow = Math.round(leftChannel.length / dataPoints);
    //   for (let i = 0, y = 0, buffer = []; i < leftChannel.length; i++) {
    //     const summedValue = (Math.abs(leftChannel[i]) + Math.abs(rightChannel[i])) / 2;
    //     buffer.push(summedValue);
    //     if (buffer.length === dataWindow) {
    //       values[y++] = avg(buffer);
    //       buffer = [];
    //     }
    //   }
    //   return values;
    // }

    // draw(inData) {
    //     const bufferLength = inData.length ;
    //     //Schedule next redraw
    //     requestAnimationFrame(() => {this.draw});

    //     //Draw black background
    //     this.context.fillStyle = 'rgb(0, 0, 0)';
    //     this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    //     //Draw spectrum
    //     const barWidth = (this.canvas.width / bufferLength) * 2.5;
    //     let posX = 0;
    //     for (let i = 0; i < bufferLength; i++) 
    //     {
    //         const barHeight = (inData[i] + 140) * 2;
    //         this.context.fillStyle = 'rgb(' + Math.floor(barHeight + 100) + ', 50, 50)';
    //         this.context.fillRect(posX, this.canvas.height - barHeight / 2, barWidth, barHeight / 2);
    //         posX += barWidth + 1;
    //     }
    // }

    draw(dataArray) {
      let drawVisual = requestAnimationFrame(this.draw);
      this.canvas.fillStyle = 'rgb(230, 20, 210)';
      this.canvas.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvas.linethis.canvas.width = 2;
      this.canvas.strokeStyle = 'rgb(40, 95, 95)';
      this.canvas.beginPath();
      
      var sliceWidth = this.canvas.width * 1.0 / this.props.bufferLength;
      var x = 0;
      
      for(var i = 0; i < this.props.bufferLength; i++) {
       
            var v = dataArray[i] / 128.0;
            var y = v * this.canvas.height/2;

            if(i === 0) {
              this.canvas.moveTo(x, y);
            } else {
              this.canvas.lineTo(x, y);
            }

            x += sliceWidth;
          };
      
      this.canvas.lineTo(this.canvas.width, this.canvas.height/2);
          this.canvas.stroke();
    }

    render() {
        if(this.canvas)
        {
            this.draw(this.props.freqData);
        }
        return (
            <div className="waveform-container"
            ref={node => this.el = node}
            >
                <canvas ref={node => this.canvas = node}></canvas>
            </div>
        );
    }
}
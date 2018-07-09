import React, { Component } from 'react';
import logo from '../assets/logo.svg';
import '../css/App.css';
import AudioBufferLoader from "./audio-buffer-loader";
import ChannelNode from "./components/channel-node";
import Controls from './components/controls';
import Screen from "./components/screen";
import Transport from "./components/transport";
import MenuControls from "./components/menu-controls";

const numChannels = 8;
const SPECTROGRAM_RESOLUTION = 512;
const FFT_SAMPLE_RATE = 512;
const FFT_BUFFER_SIZE = 128;

export default class AudioEngine
{
    constructor()
    {
        this.clipsReady = false;
        this._audioClips = {};
        this._channels = [];
        //Create audio graph components
        this._audioContext =  new AudioContext();
        this._masterGain = this._audioContext.createGain();
        this._channelMerger = this._audioContext.createChannelMerger(8);
        this._analyser = this._audioContext.createAnalyser();
        this._compressor = this._audioContext.createDynamicsCompressor();
        this._analyser.smoothingTimeConstant = 0.4;
        this._analyser.fftSize = 1024;
        this._bufferLength = this._analyser.frequencyBinCount;
        this._audioClipEngine = new AudioBufferLoader(this._audioContext);
        this._audioClipEngine.loadClips().then((clips) => {
        this._audioClips = clips;
        this.clipsReady = true;
        const keys = Object.keys(this._audioClips);
        //Connect audio graph components
        for(let i = 0; i < 8; i++)
        {
            this._channels[i] = new ChannelNode(this._audioContext);
            this._channels[i].getGain().connect(this._channelMerger);
            this._channels[i].setClip(this._audioClips[keys[i]]);
        }

        this._channelMerger.connect(this._analyser);
        this._analyser.connect(this._compressor);
        this._compressor.connect(this._masterGain);
        this._masterGain.connect(this._audioContext.destination);

        });
    }

    play(inDest, inRate) 
    {
        const source = this._audioContext.createBufferSource();
        source.playbackRate.value = inRate;
        source.buffer = this._buffer;
        source.connect(inDest);
        source.start(0);
    }

    getClipData()
    {
        return this.spectrogramData;
    }

    stop()
    {

    }

    getFreqDomainPeaks(inWindowSize, inBuffer = this._buffer)
    {

    }

    getTimeDomainPeaks(inSampleSize, inBuffer = this._buffer)
    {
        const peaks = [];
        const source = this._audioContext.createBufferSource();
        source.buffer = inBuffer;
        const bufferData = source.buffer.getChannelData(0);
        bufferData.reduce((res, item, index) => { 
            const chunkIndex = Math.floor(index/(inSampleSize / 2))
            if(!res[chunkIndex]) 
            {
                res[chunkIndex] = [] // start a new chunk
            }
            res[chunkIndex].push(item);
            return res
        }, []).forEach( (sampleChunk, index) => {
            peaks[2 * index] = Math.max(...sampleChunk) ;
            peaks[2 * index + 1] = Math.min(...sampleChunk) ;
        });
        return peaks;
    }

    getBinFrequency(index, inTotalBins, inSampleRate) 
    {
        const nyquist = inSampleRate / 2;
        const freq = index / inTotalBins * nyquist;
        return freq;
    }

    getFrequencyValue(freq, inSampleRate) 
    {
        const nyquist = inSampleRate / 2;
        const index = Math.round(freq / nyquist * this.freqs.length);
        return this.freqs[index];
    }

    getBuffer(){ return this._buffer; }
}

import Waveform from "./components/waveform";

export default class ChannelNode{
    constructor(inContext)
    {
        this._audioContext = inContext;
        this.gain = this._audioContext.createGain();
        this.analyser = this._audioContext.createAnalyser();
        this.compressor = this._audioContext.createDynamicsCompressor();
        this.distortion = this._audioContext.createWaveShaper();
        this.biquadFilter = this._audioContext.createBiquadFilter();
        this.convolver = this._audioContext.createConvolver();

        // this.source = this._audioContext.createBufferSource();
        // this.source.connect(this.biquadFilter);
        // this.biquadFilter.connect(this.analyser);
        // this.analyser.connect(this.compressor);
        // this.compressor.connect(this.distortion);
        // this.distortion.connect(this.convolver);
        // this.convolver.connect(this.gain);

        this.analyser.fftSize = 2048;
        this.bufferLength = this.analyser.frequencyBinCount; 
        this.dataBuff = new Uint8Array(this.bufferLength);
        this.dataArray = new Float32Array(this.bufferLength);
        this._curClip = {};
    }  

    getGain()
    {
       return this.gain; 
    }

    getSource()
    {
       return this.source; 
    }

    setBuffer(inBuffer)
    {
        this.buffer = inBuffer;
    }

    setClip(inClip)
    {
        this._curClip = inClip;
        if(this._curClip._buffer)
        {
            this.setBuffer(this._curClip._buffer);
        }
    }

    play(inDest) 
    {
        if(this.buffer)
        {
            this.source = this._audioContext.createBufferSource();
            this.source.buffer = this.buffer;
            this.source.connect(this.gain);
            // this.source.connect(this.biquadFilter);
            // this.biquadFilter.connect(this.analyser);
            // this.analyser.connect(this.compressor);
            // this.compressor.connect(this.distortion);
            // this.distortion.connect(this.convolver);
            // this.convolver.connect(this.gain);
            this.source.start(0);
        }
    }
}
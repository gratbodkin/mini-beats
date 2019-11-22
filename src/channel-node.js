import Waveform from "./components/waveform";
export function test(){return "assets";}
export default class ChannelNode{
    constructor(inContext)
    {
        this._audioContext = inContext;
        this.gain = this._audioContext.createGain();
        // this.compressor = this._audioContext.createDynamicsCompressor();
        // this.distortion = this._audioContext.createWaveShaper();
        // this.biquadFilter = this._audioContext.createBiquadFilter();
        // this.convolver = this._audioContext.createConvolver();

        // this.source = this._audioContext.createBufferSource();
        // this.source.connect(this.biquadFilter);
        // this.biquadFilter.connect(this.analyser);
        // this.analyser.connect(this.compressor);
        // this.compressor.connect(this.distortion);
        // this.distortion.connect(this.convolver);
        // this.convolver.connect(this.gain);

        // this.analyser.fftSize = 2048;
        // this.bufferLength = this.analyser.frequencyBinCount; 
        // this.dataBuff = new Uint8Array(this.bufferLength);
        // this.dataArray = new Float32Array(this.bufferLength);
        this._mClip = {};
    }  

    getGain()
    {
       return this.gain; 
    }

    setGain(inGain)
    {
        this.gain = inGain; 
    }

    setClip(inClip)
    {
        this._mClip = inClip;
    }

    play(inDest) 
    {
        if(this._mClip)
        {
            this._mClip.play(this.gain, 1.0)
        }
    }

    getClip()
    {
        return this._mClip;
    }
}
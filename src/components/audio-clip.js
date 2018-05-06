export default class AudioClip
{
    constructor(inContext, inBuffer, inTag, inCbFunk, inGain = 1.0, )
    {
        this._audioContext = inContext;
        this.buffer = inBuffer;
        this.tab = inTag;
        this.masterGain = inGain;
        this.callback = inCbFunk;
        this.gain = this._audioContext.createGain();
//         this.gain.connect(this.masterGain);
        this.isReadyToPlay = false;
    }

    play(inRate, inGain = 1.0) 
    {
        this.gain.gain.value = inGain;
        this.source = this._audioContext.createBufferSource();
        this.source.playbackRate.value = inRate;
        this.source.buffer = this.buffer;
        this.source.connect(this.gain);
        this.gain.connect(this._audioContext.destination);
        this.source.start(0);
    }

    stop()
    {
        this.gain.disconnect(this._audioContext.destination);
    }
}
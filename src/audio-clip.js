export default class AudioClip
{
    constructor(inContext, inBuffer, inTag, inCbFunk, inGain = 1.0, )
    {
        this._audioContext = inContext;
        this._buffer = inBuffer;
        this._tag = inTag;
        this._masterGain = inGain;
        this._callback = inCbFunk;
        this._gain = this._audioContext.createGain();
    }

    play(inRate, inGain = 1.0) 
    {
        this._gain = inGain;
        let gainNode = this._audioContext.createGain();
        gainNode.gain.value = inGain;
        let source = this._audioContext.createBufferSource();
        // this.source.playbackRate.value = inRate;
        source.buffer = this._buffer;
        source.connect(gainNode);
        gainNode.connect(this._audioContext.destination);
        source.start(0);
    }

    stop()
    {
        //this.gain.disconnect(this._audioContext.destination);
    }

    getTag()
    {

    }

    getBuffer()
    {

    }
}

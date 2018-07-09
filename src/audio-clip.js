import SpectrogramPlugin from 'wavesurfer.js/src/plugin/spectrogram.js'

const SPECTROGRAM_RESOLUTION = 512;
const FFT_SAMPLE_RATE = 1024;
const FFT_BUFFER_SIZE = 128;

export default class AudioClip
{
    constructor(inContext, inBuffer, inTag)
    {
        this._audioContext = inContext;
        this._buffer = inBuffer;
        this._tag = inTag;
        this.spectrogramData = new Map();
        this.createSpectrogramData(inBuffer);
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

    createSpectrogramData(inBuffer)
    {
        this.spectrogramData.set("freqData", this.getFreqDomainPeaks() );
        this.spectrogramData.set("timeData", this.getTimeDomainPeaks() );
    }

    getFreqDomainPeaks(inBuffer = this._buffer, inWindowSize = SPECTROGRAM_RESOLUTION)
    {
        const bufferData = inBuffer.getChannelData(0);
        const sampleSize = bufferData.length / SPECTROGRAM_RESOLUTION;
        const sampleStep = ~~(sampleSize / 10) || 1;
        const freqs = [];
        const fft = new FFT(SPECTROGRAM_RESOLUTION, inBuffer.sampleRate);
        const freqBufferData = inBuffer.getChannelData(0);
        freqBufferData.reduce((res, item, index) => { 
            const chunkIndex = Math.floor(index/SPECTROGRAM_RESOLUTION)
            if(!res[chunkIndex]) 
            {
                res[chunkIndex] = [] 
            }
            res[chunkIndex].push(item);
            return res
        }, []).forEach( (fftBufferWindow, index) => {
            if(fftBufferWindow.length === SPECTROGRAM_RESOLUTION)
            {
                const spectrum = fft.calculateSpectrum(fftBufferWindow);
                const array = new Uint8Array(SPECTROGRAM_RESOLUTION / 2);
                let j;
                for (j = 0; j < SPECTROGRAM_RESOLUTION / 2; j++) {
                    array[j] = Math.max(-255, Math.log10(spectrum[j]) * 45);
                }
                freqs.push(array);
            }
        });
        return freqs;
    }

    getTimeDomainPeaks(inBuffer = this._buffer, inSampleSize = SPECTROGRAM_RESOLUTION)
    {
        const peaks = [];
        const bufferData = inBuffer.getChannelData(0);
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

    getSpectrogramData(inBuffer)
    {
        return this.spectrogramData;
    }

    stop()
    {

    }

    getTag(){ return this._tag; }
    getBuffer(){ return this._buffer; }
}


const FFT = function(bufferSize, sampleRate, windowFunc, alpha) {
    this.bufferSize = bufferSize;
    this.sampleRate = sampleRate;
    this.bandwidth = (2 / bufferSize) * (sampleRate / 2);

    this.sinTable = new Float32Array(bufferSize);
    this.cosTable = new Float32Array(bufferSize);
    this.windowValues = new Float32Array(bufferSize);
    this.reverseTable = new Uint32Array(bufferSize);

    this.peakBand = 0;
    this.peak = 0;

    switch (windowFunc) {
        case 'bartlett':
            for (var i = 0; i < bufferSize; i++) {
                this.windowValues[i] =
                    (2 / (bufferSize - 1)) *
                    ((bufferSize - 1) / 2 - Math.abs(i - (bufferSize - 1) / 2));
            }
            break;
        case 'bartlettHann':
            for (var i = 0; i < bufferSize; i++) {
                this.windowValues[i] =
                    0.62 -
                    0.48 * Math.abs(i / (bufferSize - 1) - 0.5) -
                    0.38 * Math.cos((Math.PI * 2 * i) / (bufferSize - 1));
            }
            break;
        case 'blackman':
            alpha = alpha || 0.16;
            for (var i = 0; i < bufferSize; i++) {
                this.windowValues[i] =
                    (1 - alpha) / 2 -
                    0.5 * Math.cos((Math.PI * 2 * i) / (bufferSize - 1)) +
                    (alpha / 2) *
                        Math.cos((4 * Math.PI * i) / (bufferSize - 1));
            }
            break;
        case 'cosine':
            for (var i = 0; i < bufferSize; i++) {
                this.windowValues[i] = Math.cos(
                    (Math.PI * i) / (bufferSize - 1) - Math.PI / 2
                );
            }
            break;
        case 'gauss':
            alpha = alpha || 0.25;
            for (var i = 0; i < bufferSize; i++) {
                this.windowValues[i] = Math.pow(
                    Math.E,
                    -0.5 *
                        Math.pow(
                            (i - (bufferSize - 1) / 2) /
                                ((alpha * (bufferSize - 1)) / 2),
                            2
                        )
                );
            }
            break;
        case 'hamming':
            for (var i = 0; i < bufferSize; i++) {
                this.windowValues[i] =
                    (0.54 - 0.46) *
                    Math.cos((Math.PI * 2 * i) / (bufferSize - 1));
            }
            break;
        case 'hann':
        case undefined:
            for (var i = 0; i < bufferSize; i++) {
                this.windowValues[i] =
                    0.5 * (1 - Math.cos((Math.PI * 2 * i) / (bufferSize - 1)));
            }
            break;
        case 'lanczoz':
            for (var i = 0; i < bufferSize; i++) {
                this.windowValues[i] =
                    Math.sin(Math.PI * ((2 * i) / (bufferSize - 1) - 1)) /
                    (Math.PI * ((2 * i) / (bufferSize - 1) - 1));
            }
            break;
        case 'rectangular':
            for (var i = 0; i < bufferSize; i++) {
                this.windowValues[i] = 1;
            }
            break;
        case 'triangular':
            for (var i = 0; i < bufferSize; i++) {
                this.windowValues[i] =
                    (2 / bufferSize) *
                    (bufferSize / 2 - Math.abs(i - (bufferSize - 1) / 2));
            }
            break;
        default:
            throw Error("No such window function '" + windowFunc + "'");
    }

    var limit = 1;
    var bit = bufferSize >> 1;

    var i;

    while (limit < bufferSize) {
        for (i = 0; i < limit; i++) {
            this.reverseTable[i + limit] = this.reverseTable[i] + bit;
        }

        limit = limit << 1;
        bit = bit >> 1;
    }

    for (i = 0; i < bufferSize; i++) {
        this.sinTable[i] = Math.sin(-Math.PI / i);
        this.cosTable[i] = Math.cos(-Math.PI / i);
    }

    this.calculateSpectrum = function(buffer) {
        // Locally scope variables for speed up
        var bufferSize = this.bufferSize,
            cosTable = this.cosTable,
            sinTable = this.sinTable,
            reverseTable = this.reverseTable,
            real = new Float32Array(bufferSize),
            imag = new Float32Array(bufferSize),
            bSi = 2 / this.bufferSize,
            sqrt = Math.sqrt,
            rval,
            ival,
            mag,
            spectrum = new Float32Array(bufferSize / 2);

        var k = Math.floor(Math.log(bufferSize) / Math.LN2);

        if (Math.pow(2, k) !== bufferSize) {
            throw 'Invalid buffer size, must be a power of 2.';
        }
        if (bufferSize !== buffer.length) {
            throw 'Supplied buffer is not the same size as defined FFT. FFT Size: ' +
                bufferSize +
                ' Buffer Size: ' +
                buffer.length;
        }

        var halfSize = 1,
            phaseShiftStepReal,
            phaseShiftStepImag,
            currentPhaseShiftReal,
            currentPhaseShiftImag,
            off,
            tr,
            ti,
            tmpReal;

        for (var i = 0; i < bufferSize; i++) {
            real[i] =
                buffer[reverseTable[i]] * this.windowValues[reverseTable[i]];
            imag[i] = 0;
        }

        while (halfSize < bufferSize) {
            phaseShiftStepReal = cosTable[halfSize];
            phaseShiftStepImag = sinTable[halfSize];

            currentPhaseShiftReal = 1;
            currentPhaseShiftImag = 0;

            for (var fftStep = 0; fftStep < halfSize; fftStep++) {
                var i = fftStep;

                while (i < bufferSize) {
                    off = i + halfSize;
                    tr =
                        currentPhaseShiftReal * real[off] -
                        currentPhaseShiftImag * imag[off];
                    ti =
                        currentPhaseShiftReal * imag[off] +
                        currentPhaseShiftImag * real[off];

                    real[off] = real[i] - tr;
                    imag[off] = imag[i] - ti;
                    real[i] += tr;
                    imag[i] += ti;

                    i += halfSize << 1;
                }

                tmpReal = currentPhaseShiftReal;
                currentPhaseShiftReal =
                    tmpReal * phaseShiftStepReal -
                    currentPhaseShiftImag * phaseShiftStepImag;
                currentPhaseShiftImag =
                    tmpReal * phaseShiftStepImag +
                    currentPhaseShiftImag * phaseShiftStepReal;
            }

            halfSize = halfSize << 1;
        }

        for (var i = 0, N = bufferSize / 2; i < N; i++) {
            rval = real[i];
            ival = imag[i];
            mag = bSi * sqrt(rval * rval + ival * ival);

            if (mag > this.peak) {
                this.peakBand = i;
                this.peak = mag;
            }
            spectrum[i] = mag;
        }
        return spectrum;
    };
};
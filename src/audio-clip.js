
export default class AudioClip
{
    constructor(inContext, inBuffer, inTag, inChunkSize = 32)
    {
        this.audioContext = inContext;
        this.sampleRate = inBuffer.sampleRate;
        this.offlineContext = new OfflineAudioContext(2,inBuffer.length,inBuffer.sampleRate);
        this.offlineAnalysisContext = new OfflineAudioContext(2,inBuffer.length,inBuffer.sampleRate);
        this.analyzer = this.audioContext.createAnalyser({fftSize: 1024});   
        this.chunkSize = inChunkSize;
        this.filter = this.offlineAnalysisContext.createBiquadFilter();
        this.filter.type = "lowpass";   
        this.offlineAnalysisSource = this.offlineAnalysisContext.createBufferSource();  
        this.offlineAnalysisSource.buffer = inBuffer;
        this.offlineAnalysisSource.connect(this.filter);
        this.filter.connect(this.offlineAnalysisContext.destination);
        this.offlineAnalysisSource.start(0);
        this.tempo = 0;
        this.offlineAnalysisContext.startRendering().then((inFilteredBuffer)=> {
            this.filteredBuffer = inFilteredBuffer;
            this.tempoCounts = this.getPeaksAtThreshold(this.filteredBuffer.getChannelData(0),0.99);
            this.tempo = this.tempoCounts[0];
            this.perBeatPercentage = 100 / this.tempo.tempo;
            return this.tempoCounts[0];
        }).then((tempo)=> {
            this.offlineSource = this.offlineContext.createBufferSource();
            this.offlineSource.buffer = inBuffer;
            this.offlineSource.connect(this.offlineContext.destination);
            this.offlineSource.start(0);
            this.offlineContext.startRendering().then((inRenderedBuffer)=> {
                this.renderedBuffer = inRenderedBuffer;
                let samplesPerBeat = inRenderedBuffer.sampleRate * (60 / tempo.tempo);
                //this.analyze(samplesPerBeat * 16);
                this.analyze(this.renderedBuffer.length);
            }).catch((err)=>{
                console.log(err);
            });
        }).catch((err)=>{
            console.log(err);
        });

        this.tag = inTag;
        this.waveform = new Map();
        this.playing = false;
        this.startedAt = 0;
        this.stoppedAt = 0;
        this.resumeAt = 0;
        this.playing = false;
    }

    preRenderBuffer()
    {

    }

    play(inDest, inRate) 
    {
        if(!this.renderedBuffer)
        {
            return;
        }
        if(!this.playing)
        {
            this.source = this.audioContext.createBufferSource();
            this.source.buffer = this.renderedBuffer;
            this.source.connect(this.analyzer);
            this.analyzer.connect(this.audioContext.destination);
            this.startedAt = this.source.context.currentTime;
            this.source.start(0, this.resumeAt);
            this.playing = true;
        }
    }
    pause(inTime)
    {
        if(this.playing)
        {
            // this.source.disconnect();
            this.source.stop();
            this.stoppedAt = inTime - this.startedAt;
            this.resumeAt = this.stoppedAt;

            this.playing = false;
        }
    }
    stop(inDest)
    {
        if(this.playing)
        {
            this.stoppedAt = 0;
            this.resumeAt = 0;
            this.source.stop(this.source.context.currentTime);
            // this.source.disconnect();
            this.playing = false;
        }
    }
    getAudioNode()
    {
        return this.audioContext.createBufferSource();
    }
    analyze(inLength = 0)
    {
        if(this.renderedBuffer)
        {
            this.waveform.set("timeData", this.getTimeDomainPeaks(this.renderedBuffer.getChannelData(0), inLength) );            
        }

    }
    isPlaying(){ return this.playing;}
    getCurrentSample(){ return this.getPlaybackPosition();}
    getSampleRate() { return this.sampleRate; }
    getChunkSize(){ return this.chunkSize / 2;}
    peaksPerSecond(){ return this.sampleRate / this.peaksPerSecond(); }
    samplesPerPeak() { return this.chunkSize / 2;}
    peaksPerChunk(){ return 2;}
    peaksPerSecond(){ return this.chunkSize * 2;}
    getTag(){ return this.tag; }
    getBuffer(){ return this.renderedBuffer; }
    getDuration() { return this.source.buffer.duration; }
    getLength() { return this.source.buffer.length; }
    getCurrentChunkIndex()
    {
        let sampleRate = this.source.buffer.sampleRate;
        let curTime = this.source.context.currentTime;
        return (curTime * sampleRate) / this.chunkSize;
    }
    getPlaybackPosition()
    {
        if(this.playing)
        {
            return this.source.context.currentTime - this.startedAt;
        }
        return 0;
    }
    setPlaybackPosition()
    {

    }
    getNextChunk()
    {

    }
    getBPM()
    {
        return this.tempo.tempo;
    }
    getTempoInfo()
    {
        return this.tempo;
    }
    setBPM(inBPM)
    {

    }
    resume()
    {

    }

    setLoopEnabled()
    {

    }

    setLoopStart(inStart)
    {

    }

    setLoopStop(inStop)
    {

    }

    getFrame()
    {
        var bufferLength = this.analyzer.frequencyBinCount;
        let dataArray = new Float32Array(bufferLength);
        this.analyzer.getFloatTimeDomainData(dataArray);
        this.getTimeDomainPeaks(dataArray, bufferLength, this.chunkSize);
        return this.getTimeDomainPeaks(dataArray, bufferLength)
    }

    getRawFrame()
    {
        var bufferLength = this.analyzer.frequencyBinCount;
        let dataArray = new Float32Array(bufferLength);
        this.analyzer.getFloatTimeDomainData(dataArray);
        return dataArray;
    }

    getWaveform(inLength = 0)
    {
        return this.waveform.get("timeData"); 
    }

    setClipPitch(inPitch)
    {

    }

    getClipPitch()
    {

    }

    setClipPlaybackSpeed()
    {

    }

    getPeaksAtThreshold(data, threshold) {
        var peaksArray = [];
        var length = data.length;
        for(var i = 0; i < length;) {
            if (data[i] > threshold) {
                peaksArray.push(i);
                // Skip forward ~ 1/4s to get past this peak.
                i += 10000;
            }
            i++;
        }
        // return peaksArray;
        return this.countIntervalsBetweenNearbyPeaks(peaksArray);
    }

    countIntervalsBetweenNearbyPeaks(peaks) {
        let intervalCounts = [];
        peaks.forEach((peak, index)=> {
            for(let i = 0; i < 10; i++) {
                let interval = peaks[index + i] - peak;
                let foundInterval = intervalCounts.some((intervalCount)=> {
                    if (intervalCount.interval === interval)
                    {
                        //intervalCount.indexes.push(index + i);
                        return intervalCount.count++;
                    }
                });
                if (!foundInterval) {
                    intervalCounts.push({
                    interval: interval,
                    count: 1,
                    start: peaks[index + i]
                    // indexes: [index + i]
                    });
                }
            }
        });
        // return intervalCounts;
        return this.groupNeighborsByTempo(intervalCounts);
    }

    groupNeighborsByTempo(intervalCounts, inSampleRate = this.sampleRate) {
        let tempoCounts = [];
        intervalCounts.forEach(function(intervalCount, i) {
            if(intervalCount.interval > 0 && intervalCount.count > 1)
            {
                // Convert an interval to tempo
                 var theoreticalTempo = 60 / (intervalCount.interval / inSampleRate );
                //var theoreticalTempo = parseInt(60 / (intervalCount.interval / inSampleRate ));
                // Adjust the tempo to fit within the 90-180 BPM range
                let interval = intervalCount.interval;
                while (theoreticalTempo < 90)
                {
                    theoreticalTempo *= 2;
                    interval /= 2;
                }
                while (theoreticalTempo > 180)
                {
                    theoreticalTempo /= 2;
                    interval *= 2;
                } 
                theoreticalTempo = Math.round(theoreticalTempo);
                var foundTempo = tempoCounts.some(function(tempoCount) {
                    if (tempoCount.tempo === theoreticalTempo)
                    {
                        if(intervalCount.start < tempoCount.start)
                        {
                            tempoCount.start = intervalCount.start;
                        }
                        return tempoCount.count += intervalCount.count;
                    }
                });
                if (!foundTempo) {
                    tempoCounts.push({
                        tempo: theoreticalTempo,
                        count: intervalCount.count,
                        start: intervalCount.start,
                        interval: interval
                    });
                }
            }
        });
        return tempoCounts;
    }

    getTimeDomainPeaks(inBuffer = [], inLength = 0, inSampleSize = 64)
    {
        let maxSample = inBuffer.length;
        if(inLength > 0)
        {
            maxSample = inLength;
        }
        const peaks = [];
        const bufferData = inBuffer.slice(0, maxSample);
        bufferData.reduce((res, item, index) => {
            const chunkIndex = Math.floor(index/(inSampleSize))
            if(!res[chunkIndex]) 
            {
                res[chunkIndex] = [] // start a new chunk
            }
            res[chunkIndex].push(item);
            return res
        }, []).forEach( (sampleChunk, index) => {
            peaks[2 * index] = isNaN(Math.max(...sampleChunk))? 0 : Math.max(...sampleChunk) ;
            peaks[2 * index + 1] = isNaN(Math.min(...sampleChunk))? 0 : Math.min(...sampleChunk) ;
        });
        return peaks;
    }
}
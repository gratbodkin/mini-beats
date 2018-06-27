/**
 * optimize the animation - shim requestAnimFrame for animating playback
 */
window.requestAnimFrame = window.requestAnimationFrame || function(callback) {
    window.setTimeout(callback, 1000 / 60);
};


/**
 * Helper function for loading one or more sound files
 */
function loadSounds(obj, context, soundMap, callback) {
    var names = [];
    var paths = [];
    for (var name in soundMap) {
        var path = soundMap[name];
        names.push(name);
        paths.push(path);
    }
    let bufferLoader = new BufferLoader(context, paths, function(bufferList) {
        for (var i = 0; i < bufferList.length; i++) {
            var buffer = bufferList[i];
            var name = names[i];
            obj[name] = buffer;
        }
        if (callback) {
            callback();
        }
    });
    bufferLoader.load();
}


// class that performs most of the work to load
// a new sound file asynchronously
// originally from: http://chimera.labs.oreilly.com/books/1234000001552/ch02.html
function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    var loader = this;

    request.onload = function() {
        // Asynchronously decode the audio file data in request.response
        loader.context.decodeAudioData(
            request.response,
            function(buffer) {
                if (!buffer) {
                    alert('error decoding file data: ' + url);
                    return;
                }
                loader.bufferList[index] = buffer;
                if (++loader.loadCount == loader.urlList.length) {
                    loader.onload(loader.bufferList);
                }
            }
        );
    };

    request.onerror = function() {
        alert('BufferLoader: XHR error');
    };
    request.send();
};

BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
        this.loadBuffer(this.urlList[i], i);
};


/**
 * Spectrogram class
 * sets up most of the configuration for the sound analysis
 * and then loads the sound using loadSounds.
 * Once finished loading, the setupVisual callback is called.
 * @param {String} filename - takes a filename
 * @param {String} selector - id to use to figure out where to display
 * @param {Object} options - Options default is {}
 */
function Spectrogram(filename, selector, options = {}) {
    this.options = options;

    var SMOOTHING = 0.0;
    var FFT_SIZE = 2048;

    // this.sampleRate = 256;
    this.sampleRate = options.sampleSize || 512;
    this.decRange = [-80.0, 80.0];

    this.width = options.width || 900;
    this.height = options.height || 440;
    this.margin = options.margin || {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    };

    this.colorScheme = options.colorScheme || ['#ffffff', '#f0f0f0', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525', '#000000'];
    this.zoomScale = 1;

    this.selector = selector;
    this.filename = filename;

    this.context = new(window.AudioContext || window.webkitAudioContext)();

    // setup a analyzer
    this.analyser = this.context.createAnalyser();
    this.analyser.minDecibels = this.decRange[0];
    this.analyser.maxDecibels = this.decRange[1];
    this.analyser.smoothingTimeConstant = SMOOTHING;
    this.analyser.fftSize = FFT_SIZE;

    // mute the sound
    this.volume = this.context.createGain();
    this.volume.gain.value = 0;

    // Create a ScriptProcessorNode with a bufferSize of this.sampleRate and a single input and output channel
    this.scriptNode = this.context.createScriptProcessor(this.sampleRate, 1, 1);

    this.freqs = new Uint8Array(this.analyser.frequencyBinCount);
    this.data = [];

    this.isPlaying = false;
    this.isLoaded = false;
    this.startTime = 0;
    // this.startOffset = 0;
    this.count = 0;
    this.curSec = 0;
    this.maxCount = 0;

    loadSounds(this, this.context, {
        buffer: this.filename
    }, this.setupVisual.bind(this));
}


/**
 * Spectrogram.prototype.process
 * callback executed each onaudioprocess of the scriptNode
 * performs the work of analyzing the sound and storing the results
 * in a big array (not a great idea, but I haven't thought of something better
 */
Spectrogram.prototype.process = function() {
    if (this.isPlaying && !this.isLoaded) {
        this.count += 1;
        this.curSec = (this.sampleRate * this.count) / this.buffer.sampleRate;
        this.analyser.getByteFrequencyData(this.freqs);

        var d = {
            'key': this.curSec,
            'values': new Uint8Array(this.freqs)
        };
        this.data.push(d);

        if (this.count >= this.maxCount) {
            this.draw();
            this.stop();
            this.isLoaded = true;
            // console.log(this.data.length);
            // console.log(this.data[0].values.length);
        }
    }
};


/**
 * Setup the visual component
 * callback executed when the sound has been loaded.
 * sets up scales and other components needed to visualize.
 */
Spectrogram.prototype.setupVisual = function() {
    // console.log(this.context.sampleRate);
    let that = this;
    // can configure these from the options
    this.timeRange = [0, this.buffer.duration];
    let maxFrequency = this.options.maxFrequency || this.getBinFrequency(this.analyser.frequencyBinCount);
    // let maxFrequency = this.options.maxFrequency || this.getBinFrequency(this.analyser.frequencyBinCount );

    let minFrequency = this.options.minFrequency || this.getBinFrequency(0);
    this.freqRange = [minFrequency, maxFrequency];

    // zoom the x-axis and the scale of the canvas
    this.zoom = d3.zoom()
        .scaleExtent([1, parseInt(this.timeRange[1])])
        .translateExtent([
            [0, 0],
            [this.width, this.height]
        ])
        .extent([
            [0, 0],
            [this.width, this.height]
        ]).on('zoom', function() {
            that.zoomScale = d3.event.transform.k;
            that.xScale = d3.event.transform.rescaleX(that.orgXScale);
            that.gX.call(that.xAxis.scale(that.xScale));
            that.draw();
        });

    let freqs = [];
    for (let i = 64; i < this.analyser.frequencyBinCount; i += 64) {
        freqs.push(this.getBinFrequency(i).toFixed(4));
    }

    this.freqSelect = d3.select(this.selector)
        .append('select')
        .style('margin-top', this.height + this.margin.top + this.margin.bottom + 20 + 'px')
        .style('margin-left', '20px')
        .on('change', function() {
            var newFreq = this.options[this.selectedIndex].value;
            // console.log(newFreq);
            that.yScale.domain([0, newFreq]);
            that.draw();
        });

    this.freqSelect.selectAll('option')
        .data(freqs)
        .enter()
        .append('option')
        .attr('value', function(d) {
            return d;
        })
        .attr('selected', function(d) {
            return (d == 22500) ? 'selected' : null;
        })
        .text(function(d) {
            return Math.round(d / 1000) + 'k';
        });

    this.maxCount = (this.context.sampleRate / this.sampleRate) * this.buffer.duration;

    // original x scale
    this.orgXScale = d3.scaleLinear()
        .domain(this.timeRange)
        .range([0, this.width]);

    // needed for the zoom function
    this.xScale = this.orgXScale;

    this.yScale = d3.scaleLinear()
        .domain(this.freqRange)
        .range([this.height, 0]);

    this.zScale = d3.scaleQuantize()
        .domain(this.decRange)
        .range(this.colorScheme);

    var commasFormatter = d3.format(',.2f');
    this.xAxis = d3.axisBottom(this.xScale)
        .tickSize(-this.height - 15)
        .tickPadding(10)
        .tickFormat(function(d) {
            return commasFormatter(d) + 's';
        });

    this.yAxis = d3.axisLeft(this.yScale)
        .tickSize(-this.width - 10, 0, 0)
        .tickPadding(10)
        .tickFormat(function(d) {
            return (d / 1000).toFixed(1) + 'k';
        });

    this.gX = this.svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + (this.height) + ')')
        .call(this.xAxis);

    this.svg.append('g')
        .attr('class', 'y axis')
        // .attr('transform', 'translate(0,0)')
        .call(this.yAxis);

    this.play();
};

/**
 * Draw the spectrogram
 */
Spectrogram.prototype.draw = function() {
    var that = this;

    // remove spinner
    this.spinner.remove();

    var min = d3.min(this.data, function(d) {
        return d3.min(d.values);
    });
    var max = d3.max(this.data, function(d) {
        return d3.max(d.values);
    });
    this.zScale.domain([min + 20, max - 20]);

    // get the context from the canvas to draw on
    var visContext = d3.select(this.selector)
        .select('.vis_canvas')
        .node()
        .getContext('2d');

    this.svg.select('.x.axis').call(this.xAxis);
    this.svg.select('.y.axis').call(this.yAxis);

    visContext.clearRect(0, 0, this.width + this.margin.left, this.height);

    // slice the array - increases performance
    let startIndex = Math.floor((that.xScale.domain()[0] / this.timeRange[1]) * this.data.length) || 0;
    let endIndex = Math.floor((that.xScale.domain()[1] / this.timeRange[1]) * this.data.length) || this.data.length;

    // console.log(endIndex - startIndex);
    let tmpData = this.data.slice(startIndex, endIndex);

    // bin the data into less number of elements - this is calculated if
    // the dotWidth would be less than 1
    let binnedTmpData = [];
    // if this is true each time slice would be smaller thant 1
    // if true bin and average the array to the number of elements of width
    if ((endIndex - startIndex) > this.width) {
        let ratio = Math.ceil((endIndex - startIndex) / this.width);
        for (let i = 0; i < tmpData.length; i++) {
            // console.log(i % ratio);
            if (!(i % ratio)) {
                let tmpValues = [Array.from(tmpData[i].values)];
                let tmpKey = [tmpData[i].key];
                // get the i+ratio elements to compute the average of a bin in the next step
                for (let j = i + 1; j < i + ratio; j++) {
                    if (tmpData[j]) {
                        tmpValues.push(Array.from(tmpData[j].values));
                        tmpKey.push(tmpData[j].key);
                    }
                }
                // average the columns in the 2D array and convert back to Uint8Array
                tmpValues = new Uint8Array(tmpValues.reduce((acc, cur) => {
                    cur.forEach((e, i) => acc[i] = acc[i] ? acc[i] + e : e);
                    return acc;
                }, []).map(e => e / tmpValues.length));
                // average of the time moment
                tmpKey = tmpKey.reduce(function(a, b) {
                    return a + b;
                }) / tmpKey.length;

                binnedTmpData.push({
                    'values': tmpValues,
                    'key': tmpKey
                });
            }
        }
    } else {
        binnedTmpData = tmpData;
    }

    this.dotWidth = (this.width / binnedTmpData.length) + 1;
    this.dotHeight = (this.height / this.analyser.frequencyBinCount) * (this.freqRange[1] / this.yScale.domain()[1]) + 1;
    // draw only the zoomed part
    binnedTmpData.forEach(function(d) {
        for (var j = 0; j < d.values.length - 1; j++) {
            // draw each pixel with the specific color
            var v = d.values[j];
            var x = that.xScale(d.key);
            var y = that.yScale(that.getBinFrequency(j));
            // color scale
            visContext.fillStyle = that.zScale(v);
            // draw the line
            visContext.fillRect(x, y, that.dotWidth, that.dotHeight);
        }
    });
};


/**
 * Get the frequency value
 */
Spectrogram.prototype.getFrequencyValue = function(freq) {
    var nyquist = this.context.sampleRate / 2;
    var index = Math.round(freq / nyquist * this.freqs.length);
    return this.freqs[index];
};


/**
 * Get the frequency value
 */
Spectrogram.prototype.getBinFrequency = function(index) {
    var nyquist = this.context.sampleRate / 2;
    var freq = index / this.freqs.length * nyquist;
    return freq;
};
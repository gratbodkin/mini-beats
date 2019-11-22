import * as THREE from 'three';

export default class FFTDisplay3D
{
    constructor(inElement)
    {
        super(inElement);
        this.d3 = {
            camera: null,
            scene: null,
            renderer: null,
            lineMaterial: null,
            shapeMaterial: null
        };
        this.audio = {
            context: null,
            analyser: null,
            input: null,
            inputPoint: null,
            freqByteData: null,
        };
        this.curves = [];
        this.startTimestamp = null;
        this.frameCounter = 0;
        this.config = {
            maxCurves: 150,
            skipFrames: 2,
            movementSpeed: 0.25,
            fftSize: 1024,
            minFreqHz: 0,
            maxFreqHz: 20000
        }
        this.fftWindowSize = {
            from: null,
            to: null
        }
        this.start();
        navigator.requestAnimationFrame = navigator.requestAnimationFrame ||
        navigator.webkitRequestAnimationFrame ||
        navigator.mozRequestAnimationFrame;
        this.init3d();
    }

    makeShape(data, width, height) {
      var shape = new THREE.Shape();
      var step = width / (data.length + 1);
      var len = data.length;
      shape.moveTo( 0, 0 );
      for(var i = 0; i < len; i++) {
        shape.lineTo(step * (i + 1), data[i] * height);
      }
      shape.lineTo( width, 0 );
      return shape;
    }

    makeObjects(shape) {
      var group = new THREE.Group();

      // flat shape
      var geometry = new THREE.ShapeGeometry( shape );
      var mesh = new THREE.Mesh( geometry, this.d3.shapeMaterial );

      // solid line
      var points = shape.createPointsGeometry();
      var line = new THREE.Line( points, this.d3.lineMaterial );

      group.add( line );
      group.add( mesh );
      group.rotation.x = Math.PI * 0.5;
      return group;
    }

    init3d() {
        this.d3.scene = new THREE.Scene();
        this.d3.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
        this.d3.camera.rotation.x = Math.PI * 0.3;
        this.d3.camera.position.set( 100, -100, 130 );
        this.d3.scene.add( this.d3.camera );
        var light = new THREE.PointLight( 0xffffff, 0.8 );
        this.d3.camera.add( light );
        this.d3.lineMaterial=  new THREE.LineBasicMaterial({
            color: 0x00f0f0, linewidth: 2
        });
        this.d3.shapeMaterial=  new THREE.MeshBasicMaterial({
            color: 0x000000, side: THREE.DoubleSide
        });
        this.d3.renderer = new THREE.WebGLRenderer( { canvas: this.mElement, antialias: true } );
        this.d3.renderer.setClearColor( 0x000000 );
        this.d3.renderer.setPixelRatio( window.devicePixelRatio );
        document.body.onresize = this.resizeWindow.bind(this);
        this.resizeWindow();
    }

    resizeWindow() {
      this.d3.renderer.setSize( window.innerWidth, window.innerHeight);
    }

    addNewData(){
        // only every n-th frame a new data set is inserted
        requestAnimationFrame( this.addNewData.bind(this) );
        this.frameCounter++;
        if(this.frameCounter % this.config.skipFrames != 0) 
        {
            return;
        } 
        else 
        {
            this.frameCounter = 0;
        }
        // get new dataset
        var data = this.getNewData();
        var shape = this.makeShape(data, 200, 0.1);
        var curve = this.makeObjects(shape);
        this.curves.unshift(curve);
        this.d3.scene.add(curve);

        // insert it and remove old
        if(this.curves.length > this.config.maxCurves) 
        {
            this.d3.scene.remove(this.curves.pop());
        }
    }

    render(timestamp) 
    {
      if (!this.startTimestamp) 
      {
        this.startTimestamp = timestamp;
      }
      var progress = timestamp - this.startTimestamp;
      var movementSpeed = this.config.movementSpeed;
      this.curves.forEach(function(curve) 
      {
        curve.position.y += movementSpeed;
      });
      this.d3.renderer.render(this.d3.scene, this.d3.camera);
      requestAnimationFrame( this.render.bind(this) );
    }

    start() 
    {
        this.initAudio();
        requestAnimationFrame( this.addNewData.bind(this) );
        requestAnimationFrame( this.render.bind(this) );
    }

    gotStream(stream) 
    {
        this.audio.inputPoint = this.audio.context.createGain();
        // Create an AudioNode from the stream.
        this.audio.input = this.audio.context.createMediaStreamSource(stream);
        this.audio.input.connect(this.audio.inputPoint);
        this.audio.analyser = this.audio.context.createAnalyser();
        this.audio.analyser.fftSize = this.config.fftSize;
        this.audio.freqByteData = new Uint8Array(this.audio.analyser.frequencyBinCount);
        this.audio.inputPoint.connect( this.audio.analyser );
    }

    calcFFTWindowSize() 
    {
        var maxFreq = this.audio.context.sampleRate / 2;
        var sizePerFreq = this.config.fftSize / maxFreq;
        this.fftWindowSize.from = Math.floor(sizePerFreq * this.config.minFreqHz);
        this.fftWindowSize.to = Math.floor(sizePerFreq * this.config.maxFreqHz);
    }

    getNewData() 
    {
        this.audio.analyser.getByteFrequencyData(this.audio.freqByteData);
        return this.audio.freqByteData.subarray(this.fftWindowSize.from, this.fftWindowSize.to);
    }

    initAudio() 
    {
        window.AudioContext  = window.AudioContext || window.webkitAudioContext;
        this.audio.context = new window.AudioContext();
        this.calcFFTWindowSize();
        navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

        if (navigator.getUserMedia) 
        {
            navigator.getUserMedia(
                {audio: true},
                this.gotStream.bind(this),
                function(e) {
                    alert('Error getting audio');
                    console.log(e);
            });
        } 
        else 
        {
            alert('Error getting audio');
        }
    }
}

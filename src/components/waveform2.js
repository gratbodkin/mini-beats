import * as THREE from 'three';
import OrbitControls from "orbit-controls-es6";
 
export default class Waveform
{
    constructor(canvas, aContext)
    {
        navigator.requestAnimationFrame = navigator.requestAnimationFrame ||
        navigator.webkitRequestAnimationFrame ||
        navigator.mozRequestAnimationFrame;
        this.mElement = canvas;
        this.audioContext = aContext;
        this.width = 874;
        this.height = 315;
        this.secondsDisplayed = 5;
        this.sampleRate = this.audioContext.sampleRate;
        this.init3d();
    } 
 
    init3d() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100000);
        // this.camera.position.set( 0, -1000, 0 );
        this.camera.position.set( 0, 0, -3000 );
        this.camera.lookAt( 0, 0, 100 );
        this.scene.add( this.camera );
        this.light = new THREE.HemisphereLight( 0xffffbb, 0xffffff, 1 );
        this.camera.add( this.light );
        this.camera.up.set( 0, 0, 1 );
        this.renderer = new THREE.WebGLRenderer( { canvas: this.mElement, antialias: true, alpha: true } );
        this.renderer.setClearColor( 0x000000, 0.0);
        this.renderer.setPixelRatio( window.devicePixelRatio );
        // this.renderer.setSize(this.mElement.width, this.mElement.height);
        this.renderer.setSize(874, 155);
        this.cameraControl = new OrbitControls(this.camera, this.mElement);
        this.cameraControl.enabled = true;
        this.cameraControl.maxDistance = 3000;
        this.cameraControl.minDistance = 10;
        this.decks = [{}, {}];
        this.resizeWindow();
    }
 
    addLineGeometry(inVertices, clip)
    {
        let lines = [];
        let numBeatsShown = 8;
        let pixelsPerBeat = this.width / numBeatsShown;
        let chunksPerSecond = clip.chunksPerSecond();
        let samplesPerBeat = clip.getTempoInfo().interval;
        let peaksPerBeat = samplesPerBeat / clip.peaksPerSecond();
        let pixelsPerPeak = pixelsPerBeat / peaksPerBeat;
        let lineGeometry = new THREE.BufferGeometry();
        const numBeats = (inVertices.length / peaksPerBeat) - 1;
        const numVertices = inVertices.length + (numBeats * 3);
        const numVerticeElements = numVertices * 3;
        let lineVertices = new Float32Array(numVerticeElements);
        let colors = new Float32Array(numVerticeElements); 
        let curIndex = 0;
        let curPeak = 0;
        let curBeat = 1;
        while(curIndex < numVerticeElements)
        {
            lineVertices[curIndex] = pixelsPerPeak * curPeak;
            colors[curIndex] = 1 - Math.abs(inVertices[curPeak]) * 0.5;
            ++curIndex;
            lineVertices[curIndex] = inVertices[curPeak] * (this.height / 2);
            colors[curIndex] = Math.abs(inVertices[curPeak - 1]) * 0.25;
            ++curIndex;
            lineVertices[curIndex] = 0;
            colors[curIndex] = Math.abs(inVertices[curPeak - 1] - (inVertices[curPeak - 2] ? inVertices[curPeak - 2] : 0));
            ++curIndex;
            if(curPeak % Math.round(peaksPerBeat) === 0)
            {
                lineVertices[curIndex] = pixelsPerPeak * curPeak;
                colors[curIndex] = 0.0;
                ++curIndex;
                lineVertices[curIndex] = -this.height * 2;
                colors[curIndex] = curBeat !== 1.0 ? 0.25 : 1.0;
                ++curIndex;
                lineVertices[curIndex] = 0;
                colors[curIndex] = curBeat !== 1.0 ? 0.25 : 1.0;
                ++curIndex;
                lineVertices[curIndex] = pixelsPerPeak * curPeak;
                colors[curIndex] = 0.0;
                ++curIndex;
                lineVertices[curIndex] = this.height * 2;
                colors[curIndex] = curBeat !== 1.0 ? 0.25 : 1.0;
                ++curIndex;
                lineVertices[curIndex] = 0;
                colors[curIndex] = curBeat !== 1.0 ? 0.25 : 1.0;
                ++curIndex;
                lineVertices[curIndex] = pixelsPerPeak * curPeak;
                colors[curIndex] = 0.0;
                ++curIndex;
                lineVertices[curIndex] = 0;
                colors[curIndex] = curBeat !== 1.0 ? 0.25 : 1.0;
                ++curIndex;
                lineVertices[curIndex] = 0;
                colors[curIndex] = curBeat !== 1.0 ? 0.25 : 1.0;
                ++curIndex;
                curBeat = curBeat + 1 > 4 ? 1 : curBeat + 1;;
            }
            curPeak++;
        }
        lineGeometry.addAttribute( 'position', new THREE.Float32BufferAttribute( lineVertices, 3 ) );
        lineGeometry.addAttribute( 'normal', new THREE.Float32BufferAttribute( new Float32Array(numVertices), 3 ) );
        lineGeometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3, true) );
        lineGeometry.center();
        return lineGeometry;
    }
 
    resizeWindow() {
     // this.renderer.setSize( window.innerWidth, window.innerHeight);
    }
 
    render() 
    {
        requestAnimationFrame(this.render.bind(this));  
        for(let deck of this.decks)
        {
            //console.log(deck);
            if(deck.clip)
            {
                let clip = deck.clip;
                let frame = clip.getFrame();
                let numChunks = frame.length;
                // let curTime = clip.getPlaybackPosition();
                // let pixelsPerSec = this.width / 5/2;
                // deck.waveformLine.position.x = (this.width/2)-(curTime * pixelsPerSec);
            }
 
        }
        this.renderer.render(this.scene, this.camera);
    }
 
    setClip(inCmdObj)
    {
        const clip = inCmdObj.clip;
        const data = clip.getWaveform(5);
        const beats  = clip
        const timeData = data.get("timeData"); 
        const deck = inCmdObj.deck;
        if(!this.decks[deck])
        {
            this.decks[deck] = {};
        }
            this.decks[deck].clip = clip;
            this.decks[deck].data = data;
        if(this.decks[deck].waveformLine)
        {
            this.scene.remove(this.decks[deck].waveformLine);
        }
        this.renderer.clear();
        if(timeData.length)
        {
            this.decks[deck].waveformGeometry = this.addLineGeometry(timeData, clip);
            this.decks[deck].waveformLineMaterial = new THREE.LineBasicMaterial( {
                vertexColors: THREE.VertexColors,
                linewidth: 3,
            } );
            this.decks[deck].waveformLine = new THREE.Line( this.decks[deck].waveformGeometry,  this.decks[deck].waveformLineMaterial );
            this.decks[deck].waveformLine.position.z = 0;
            //this.decks[deck].waveformLine.position.x = this.width/2;
            if( deck === 1)
            {
                this.decks[deck].waveformLine.position.y += this.height/5;
            }
            if( deck === 0)
            {
                this.decks[deck].waveformLine.position.y -= this.height/5;
            }
            this.decks[deck].waveformGeometry.verticesNeedUpdate = true;
            this.decks[deck].waveformGeometry.uvsNeedUpdate = true;
            this.decks[deck].waveformGeometry.normalsNeedUpdate = true;
            this.decks[deck].waveformGeometry.colorsNeedUpdate = true;
            this.scene.add(this.decks[deck].waveformLine);
            this.render();
        }
    }
 }
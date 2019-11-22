import * as THREE from 'three';
import OrbitControls from "orbit-controls-es6";
import vShader from "./v-shader.glsl";
import fShader from "./f-shader.glsl";

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
        this.vShader = vShader;
        this.fShader = fShader;
        this.init3d();
    } 

    init3d() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100000);
        // this.camera.position.set( 0, -1000, 0 );
        this.camera.position.set( 0, 0, -3000 );
        this.camera.lookAt( 0, 0, 0 );
        this.light = new THREE.HemisphereLight( 0xffffbb, 0xffffff, 1 );
        this.camera.add( this.light );
        this.camera.up.set( 0, 0, 1 );
        this.renderer = new THREE.WebGLRenderer( { canvas: this.mElement, antialias: true, alpha: true } );
        this.renderer.setClearColor( 0x000000, 0.0);
        this.renderer.setPixelRatio( window.devicePixelRatio );
        // this.renderer.setSize(this.mElement.width, this.mElement.height);
        this.renderer.setSize(874, 380);
        this.cameraControl = new OrbitControls(this.camera, this.mElement);
        this.cameraControl.enabled = true;
        this.cameraControl.maxDistance = 5000;
        this.cameraControl.minDistance = 10;
        this.decks = [
        {
            offset: -500
        }, 
        {
            offset: 500
        }];
        this.resizeWindow();
    }

    addLineGeometry(inDeck, inDeckNumber)
    {
        inDeck.numBeatsShown = 16;
        inDeck.pixelsPerBeat = this.width / inDeck.numBeatsShown;
        inDeck.peaksPerSecond = inDeck.clip.peaksPerSecond();
        inDeck.samplesPerBeat = inDeck.clip.getTempoInfo().interval;
        inDeck.peaksPerBeat = inDeck.samplesPerBeat / inDeck.clip.peaksPerSecond();
        inDeck.pixelsPerPeak = inDeck.pixelsPerBeat / inDeck.peaksPerBeat;
        inDeck.geometry = new THREE.BufferGeometry();
        inDeck.numBeats = (inDeck.length / inDeck.peaksPerBeat) - 1;
        inDeck.numVertices = inDeck.data.length;
        inDeck.numVerticeElements = inDeck.numVertices * 3;
        inDeck.position = new Float32Array(inDeck.numVerticeElements);
        inDeck.colors = new Float32Array(inDeck.numVerticeElements); 
        inDeck.buffer = new Float32Array(inDeck.numVertices);
        inDeck.peakIndex = new Float32Array(inDeck.numVertices);
        inDeck.curPeak = 0;
        let curIndex = 0;
        let curBeat = 1;
        while(curIndex < inDeck.numVerticeElements)
        {
            inDeck.peakIndex[inDeck.curPeak] = inDeck.curPeak;
            inDeck.position[curIndex] = inDeck.pixelsPerPeak * inDeck.curPeak;
            ++curIndex;
            inDeck.position[curIndex] = inDeck.data[inDeck.curPeak] * 100.0;
            inDeck.buffer[inDeck.curPeak] = inDeck.data[inDeck.curPeak];
             ++curIndex;
             inDeck.position[curIndex] = 0;
             ++curIndex
            inDeck.curPeak++;
        }
        inDeck.geometry.addAttribute('peakIndex', new THREE.Float32BufferAttribute(inDeck.peakIndex, 1));
        inDeck.geometry.addAttribute('amplitude', new THREE.Float32BufferAttribute(inDeck.buffer, 1));
        inDeck.geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( inDeck.position, 3 ) );
        inDeck.geometry.addAttribute( 'normal', new THREE.Float32BufferAttribute( new Float32Array(inDeck.numVerticeElements), 3 ) );
        inDeck.geometry.attributes.peakIndex.dynamic = true;
        inDeck.geometry.attributes.amplitude.dynamic = true;
        inDeck.geometry.attributes.position.dynamic = true;
        inDeck.geometry.attributes.normal.dynamic = true;
        inDeck.geometry.center();
        inDeck.material = this.getCustomShader();
        inDeck.line = new THREE.Line( inDeck.geometry,  inDeck.material );
        inDeck.line.name = "deck" + inDeckNumber;
        inDeck.scene = this.scene;
        inDeck.scene.add(inDeck.line);
        inDeck.line.position.y += inDeck.offset;
        inDeck.line.position.x += this.width / 2;
    }

    addVertex(inVArray, inCArray, inPos, inColor, inIndex)
    {
        inVArray[inIndex] = isNaN(inPos) ? 0.01 : inPos;
        inCArray[inIndex] = isNaN(inColor) ? 0 : inColor;
    }

    resizeWindow() {
     // this.renderer.setSize( window.innerWidth, window.innerHeight);
    }

    render() 
    {
        // requestAnimationFrame(this.render.bind(this));  
        // let camera = this.camera;
        // for(let deck of this.decks)
        // {
        //     if(deck.clip)
        //     {
        //         let clip = deck.clip;
        //         if(clip.isPlaying())
        //         {
        //             let inVertices = clip.getFrame();
        //             let curPosition = clip.getCurrentSample();
        //             deck.buffer.copyWithin(0, inVertices.length,deck.buffer.length);
        //             deck.buffer.set(inVertices, deck.buffer.length - inVertices.length);
        //             deck.geometry.attributes.amplitude.array.set(deck.buffer, 0);
        //         }
        //                             deck.geometry.attributes.position.needsUpdate = true;
        //             deck.geometry.attributes.amplitude.needsUpdate = true;
        //         this.renderer.render(deck.scene, camera);
        //     }
        // }
        requestAnimationFrame(this.render.bind(this));  
        let camera = this.camera;
        for(let deck of this.decks)
        {
            if(deck.clip)
            {
                let clip = deck.clip;
                let numBeatsShown = 16;
                let pixelsPerBeat = (this.width / numBeatsShown);
                // pixels
                //let secondsPerBeat  = clip.getTempoInfo().interval / clip.peaksPerSecond();
                // let pixelsPerPeak = pixelsPerBeat / (clip.getTempoInfo().interval / clip.peaksPerSecond());
                let pixelsPerBeat = this.width / 16;
                let beatsPerSecond = clip.getTempoInfo().interval / 60;
                let secondsPerPeak = 16 / this.sampleRate;
                let pixelsPerPeak = pixelsPerBeat * secondsPerPeak * beatsPerSecond;
                // let pixelsPerPeak = pixelsPerBeat / (clip.getTempoInfo().interval / clip.peaksPerSecond());

                //need pixels per second --> getPlaybackPosition * px/sec
                // NEED PIXELS PER PEAK!
                let pixelsPerSecond = pixelsPerPeak / deck.clip.peaksPerSecond(); // peaksPerSecond * pixelsPerPeak
                let waveformOffset = clip.getPlaybackPosition();
                deck.material.uniforms.pixelsPerPeak.value = pixelsPerPeak;
                //need pixels per second
                deck.material.uniforms.offset.value = waveformOffset;

                if(clip.isPlaying())
                {
                    //deck.line.position.x =  - waveformOffset;
                    deck.line.position.needsUpdate = true;
                    deck.material.uniforms.offset.dynamic = true;
                    deck.material.uniforms.offset.needsUpdate = true;
                    deck.material.uniforms.pixelsPerPeak.needsUpdate = true;
                     deck.geometry.attributes.peakIndex.needsUpdate = true;
                    deck.geometry.attributes.position.needsUpdate = true;
                    deck.geometry.attributes.amplitude.needsUpdate = true;
                    // let inVertices = clip.getFrame();
                    // let curPosition = clip.getCurrentSample();
                    // deck.buffer.copyWithin(0, inVertices.length,deck.buffer.length);
                    // deck.buffer.set(inVertices, deck.buffer.length - inVertices.length);
                    // deck.geometry.attributes.amplitude.array.set(deck.buffer, 0);
                }
                // deck.material.uniforms.pixelsPerPeak.needsUpdate = true;
                // deck.geometry.attributes.position.needsUpdate = true;
                // deck.geometry.attributes.amplitude.needsUpdate = true;
                this.renderer.render(deck.scene, camera);
            }
        }
    }

    getCustomShader()
    {
        let customUniforms = THREE.UniformsUtils.merge([
          THREE.ShaderLib.phong.uniforms,
          {
            "pixelsPerPeak": { type: "f", value: 0.5 },
            "offset": { type: "f", value: 0.0 }
          }
        ]);

        return new THREE.ShaderMaterial({
            vertexShader: 
                `attribute float amplitude;
                attribute float peakIndex;
                uniform float pixelsPerPeak;
                uniform float offset;
                varying vec3 vPosition;
                varying vec3 vPositionColor;
                varying vec3 vNormal;
                varying vec2 vUv;

                void main() {
                    vUv = uv;
                    vPositionColor = position;
                    vPosition = position;
                    vPosition.y = amplitude;
                    float xPos = vPosition.x - pixelsPerPeak * offset;
                    vNormal = normalize(position);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(xPos, vPosition.y * 150.0, vPosition.z, 1.0);
                    // gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition.x, vPosition.y * 150.0, vPosition.z, 1.0);
                }`,
            fragmentShader: `
                varying vec3 vPosition;
                varying vec3 vPositionColor;
                varying vec2 vUv;
                uniform vec3 color;
                varying vec3 vNormal;

                vec3 hsb2rgb( in vec3 c ){
                    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                                             6.0)-3.0)-1.0,
                                     0.0,
                                     1.0 );
                    rgb = rgb*rgb*(3.0-2.0*rgb);
                    return c.z * mix(vec3(1.0), rgb, c.y);
                }

                void main() 
                {
                    float vNormPosition = 1.0 - abs(vPosition.y);
                    float xColor =  abs(vPosition.y) * 0.5;
                    float yColor = abs(vPosition.y);
                    gl_FragColor = vec4( vec3(xColor, 1.0 - vNormPosition * 0.5,  vNormPosition), 0.5 );
                }`,
            // vertexShader:vShader,
            // fragmentShader:  fShader,
            side: THREE.DoubleSide,
            shading: THREE.SmoothShading,
            blending: THREE.AdditiveBlending,
            wireframe: false,
            uniforms: customUniforms
        });
    }

    setClip(inCmdObj)
    {
        if(inCmdObj.action)
        {
            let clip = inCmdObj.clip;
            let data = clip.getWaveform();
            switch(inCmdObj.action)
            {
                case "load":
                    if(data)
                    {
                        const deckNum = inCmdObj.deck;
                        this.decks[deckNum].clip = clip;
                        this.decks[deckNum].data = data;
                        let deckName = this.scene.getObjectByName("deck" + deckNum);
                        if(deckName)
                        {
                            this.scene.remove( deckName );
                        }
                        this.addLineGeometry(this.decks[deckNum], deckNum);
                        this.render();
                    }
                case "play":
                    if(data)
                    {
                        const deckNum = inCmdObj.deck;
                        this.decks[deckNum].clip = clip;
                        this.decks[deckNum].data = data;
                        let deckName = this.scene.getObjectByName("deck" + deckNum);
                        if(deckName)
                        {
                            this.scene.remove( deckName );
                        }
                        this.addLineGeometry(this.decks[deckNum], deckNum);
                        this.render();
                    }
                case "stop":

                case "pause":
            }
        }

    }


}

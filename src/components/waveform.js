import React, { Component } from 'react';
import * as mb from "../defs";

import * as THREE from 'three';
import $ from "jquery";

// export default class Waveform extends Component {
export default class Waveform{
    constructor(canvas, aContext)
    {
        this.canvas = canvas;
        this.audioContext = aContext;
        this.init();
        this.draw();
    }  

    // componentDidMount() 
    // {
    //     this.analyser = this.props.analyser;
    //     this.init();
    //     this.draw();
    // }

    // componentWillUnmount() 
    // {

    // }

    setBuffer(inSource)
    {
        this.buffer = inSource;
        this.draw();
    }

    draw() {
        // update the camera
        // var rotSpeed = this.control.rotationSpeed;
        // this.camera.position.x = this.camera.position.x * Math.cos(rotSpeed) + this.camera.position.z * Math.sin(rotSpeed);
        // this.camera.position.z = this.camera.position.z * Math.cos(rotSpeed) - this.camera.position.x * Math.sin(rotSpeed);
        // this.camera.lookAt(this.scene.position);
        // let array =  new Uint8Array(this.analyser.frequencyBinCount);
        // this.analyser.getByteFrequencyData(array);
        // // let average = array.map(function(x,i,arr){return x/arr.length}).reduce(function(a,b){return a + b})
        // // // and render the scene
        // // this.renderer.render(this.scene, camera);
        // // render using requestAnimationFrame
        // requestAnimationFrame(() => {this.draw});
    }

    componentWillReceiveProps(nextProps)
    {
        // this.draw(nextProps.freqData, nextProps.bufferLength);
        // this.draw();
    }

    // render() {
    //     return (
    //         <div className="waveform-container"
    //         ref={node => this.el = node}
    //         >
    //             <canvas width="400" height="200" ref={node => this.canvas = node}></canvas>
    //         </div>
    //     );
    // }

    init() {
        // create a scene, that will hold all our elements such as objects, cameras and lights.
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
        this.renderer.setClearColor(0x000000, 1.0);
        // this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMapEnabled = true;
        // create the ground plane
        this.planeGeometry = new THREE.PlaneGeometry(80, 80);
        this.planeMaterial = new THREE.MeshPhongMaterial({color: 0x3333ff});
        this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
        this.plane.receiveShadow = true;
        // rotate and position the plane
        this.plane.rotation.x = -0.5 * Math.PI;
        this.plane.position.x = 0;
        this.plane.position.y = -2;
        this.plane.position.z = 0;
        // add the plane to the scene
        this.scene.add(this.plane);
        // create a cube
        this.cubeGeometry = new THREE.BoxGeometry(3, 6, 3, 15, 25, 15);
        var pm = new THREE.PointsMaterial();
        pm.map = THREE.TextureLoader("../assets/textures/particles/particle.png");
        pm.blending= THREE.AdditiveBlending;
        pm.transparent = true;
        pm.size=1.0;
        var ps = new THREE.ParticleSystem(this.cubeGeometry, pm);
        ps.sortParticles = true;
        ps.name='cube';
        ps.position.x=1.75;
        this.scene.add(ps);
        var pm2 = pm.clone();
        pm2.map = THREE.ImageUtils.loadTexture("../assets/textures/particles/particle2.png");
        var ps2 = new THREE.ParticleSystem(this.cubeGeometry, pm2);
        ps2.name = 'cube2';
        ps2.position.x=-1.75;
        this.scene.add(ps2);
        this.camera.position.x = 10;
        this.camera.position.y = 14;
        this.camera.position.z = 10;
        this.camera.lookAt(this.scene.position);
        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(10, 20, 20);
        spotLight.shadowCameraNear = 20;
        spotLight.shadowCameraFar = 50;
        spotLight.castShadow = true;
        this.scene.add(spotLight);
        // setup the control object for the control gui
        this.control = new function() {
            this.rotationSpeed = 0.005;
            this.opacity = 0.6;
//            this.color = cubeMaterial.color.getHex();
        };
    }
}


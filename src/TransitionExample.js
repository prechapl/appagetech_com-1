import React, { Component } from "react";
import * as THREE from "three";
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import LandingTransition from './LandingTransition';
import HomeTransition from './HomeTransition';

var container, stats;
var renderer;
var transition;
var transitionParams = {
	"useTexture": true,
	"transition": 1,
	"transitionSpeed": 2.0,
	"transitionIncrement": 0.02,
	"transitionIndex": 0,
	"texture": 1,
	"loopTexture": false,
	"animateTransition": false,
	"textureThreshold": 0.3,
};
var clock = new THREE.Clock();

const createTransitionSinWaveArray = (inc, speed) => {
	const sinWaveConvert = (convertValue) => {
		return ( 1 + Math.sin( speed * convertValue / Math.PI ) ) / 2;
	}
	const startValue = 2.47;
	let testValue = 0;
	let i = 0;
	const incArray = [startValue];
	const returnArray = [sinWaveConvert(startValue)];
	do {
		testValue = sinWaveConvert(incArray[i] + inc);
		if (testValue < returnArray[i]) {
			incArray.push(incArray[i] + inc)
			returnArray.push(testValue)
		}
		i++;
	} while(testValue < returnArray[i-1])
	return returnArray;
}

function Transition( sceneA, sceneB ) {
	this.scene = new THREE.Scene();
	this.cameraOrtho = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, - 10, 10 );
	this.textures = [];
	var loader = new THREE.TextureLoader();
	for ( var i = 0; i < 6; i ++ )
		this.textures[ i ] = loader.load( 'textures/transition/transition' + ( i + 1 ) + '.png' );
	this.quadmaterial = new THREE.ShaderMaterial( {
		uniforms: {
			tDiffuse1: {
				value: null
			},
			tDiffuse2: {
				value: null
			},
			mixRatio: {
				value: 0.0
			},
			threshold: {
				value: 0.1
			},
			useTexture: {
				value: 1
			},
			tMixTexture: {
				value: this.textures[ 0 ]
			}
		},
		vertexShader: [
			"varying vec2 vUv;",
			"void main() {",
			"vUv = vec2( uv.x, uv.y );",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		].join( "\n" ),
		fragmentShader: [
			"uniform float mixRatio;",
			"uniform sampler2D tDiffuse1;",
			"uniform sampler2D tDiffuse2;",
			"uniform sampler2D tMixTexture;",
			"uniform int useTexture;",
			"uniform float threshold;",
			"varying vec2 vUv;",
			"void main() {",
			"	vec4 texel1 = texture2D( tDiffuse1, vUv );",
			"	vec4 texel2 = texture2D( tDiffuse2, vUv );",
			"	if (useTexture==1) {",
			"		vec4 transitionTexel = texture2D( tMixTexture, vUv );",
			"		float r = mixRatio * (1.0 + threshold * 2.0) - threshold;",
			"		float mixf=clamp((transitionTexel.r - r)*(1.0/threshold), 0.0, 1.0);",
			"		gl_FragColor = mix( texel1, texel2, mixf );",
			"	} else {",
			"		gl_FragColor = mix( texel2, texel1, mixRatio );",
			"	}",
			"}"
		].join( "\n" )
	} );
	var quadgeometry = new THREE.PlaneBufferGeometry( window.innerWidth, window.innerHeight );
	this.quad = new THREE.Mesh( quadgeometry, this.quadmaterial );
	this.scene.add( this.quad );
	// Link both scenes and their FBOs
	this.sceneA = sceneA;
	this.sceneB = sceneB;
	this.quadmaterial.uniforms.tDiffuse1.value = sceneA.fbo.texture;
	this.quadmaterial.uniforms.tDiffuse2.value = sceneB.fbo.texture;
	this.needChange = false;
	this.setTextureThreshold = function ( value ) {
		this.quadmaterial.uniforms.threshold.value = value;
	};
	this.useTexture = function ( value ) {
		this.quadmaterial.uniforms.useTexture.value = value ? 1 : 0;
	};
	// this.setTexture = function ( i ) {
	// 	this.quadmaterial.uniforms.tMixTexture.value = this.textures[ i ];
	// };
	this.quadmaterial.uniforms.tMixTexture.value = this.textures[ transitionParams.texture ];
	// Function to build the transition increments
	const sinWaveArray = createTransitionSinWaveArray(transitionParams.transitionIncrement, transitionParams.transitionSpeed)
	this.render = function ( delta ) {
		// Transition animation
		if ( transitionParams.animateTransition ) {
			transitionParams.transition = THREE.Math.smoothstep( sinWaveArray[transitionParams.transitionIndex], 0.59, 0.9999 );
			// Checks size of transition increment array before increasing the index
			if (transitionParams.transitionIndex + 1 < sinWaveArray.length) {
				transitionParams.transitionIndex++;
			};
		}
		this.quadmaterial.uniforms.mixRatio.value = transitionParams.transition;
		// Prevent render both scenes when it's not necessary
		if ( transitionParams.transition == 0 ) {
			this.sceneB.render( delta, false );
		} else if ( transitionParams.transition == 1 ) {
			this.sceneA.render( delta, false );
		} else {
			// When 0<transition<1 render transition between two scenes
			this.sceneA.render( delta, true );
			this.sceneB.render( delta, true );
			renderer.setRenderTarget( null );
			renderer.clear();
			renderer.render( this.scene, this.cameraOrtho );
		}
	};
}

class TransitionExample extends Component {

	componentDidMount() {
		console.log(createTransitionSinWaveArray(.02, transitionParams.transitionSpeed))
		this.init();
		this.animate();
	}

	toggleTransition = () => {
		if (transitionParams.animateTransition) {
			transitionParams.animateTransition = false;
		} else {
			transitionParams.animateTransition = true;
		}
	}

	init = () => {
		this.initGUI();
		container = document.createElement("div");
		document.body.appendChild(container);
		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		container.appendChild( renderer.domElement );
		stats = new Stats();
		container.appendChild( stats.dom );
		var sceneA = new LandingTransition( renderer, 0xffffff, this.toggleTransition)
		var sceneB = new HomeTransition( renderer, 0x000000)
		transition = new Transition( sceneA, sceneB );
	}

	initGUI = () => {
		var gui = new GUI();
		gui.add( transitionParams, "useTexture" ).onChange( function ( value ) {
			transition.useTexture( value );
		} );
		gui.add( transitionParams, 'loopTexture' );
		gui.add( transitionParams, 'texture', { Perlin: 0, Squares: 1, Cells: 2, Distort: 3, Gradient: 4, Radial: 5 } ).onChange( function ( value ) {
			transition.setTexture( value );
		} ).listen();
		gui.add( transitionParams, "textureThreshold", 0, 1, 0.01 ).onChange( function ( value ) {
			transition.setTextureThreshold( value );
		} );
		gui.add( transitionParams, "animateTransition" );
		gui.add( transitionParams, "transition", 0, 1, 0.01 ).listen();
		gui.add( transitionParams, "transitionSpeed", 0.5, 5, 0.01 );
	}

	animate = () => {
		requestAnimationFrame( this.animate );
		this.sceneRender();
	}

	sceneRender = () => {
		transition.render( clock.getDelta() );
	}

	render() {
		return <div ref={el => (this.mount = el)} />;
	}
}

export default TransitionExample;

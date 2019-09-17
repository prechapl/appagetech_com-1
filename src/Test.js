import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  CSS3DRenderer,
  CSS3DObject
} from "three/examples/jsm/renderers/CSS3DRenderer.js";

let camera, glScene, cssScene, glRenderer, cssRenderer, controls, container;

class Test extends Component {
  componentDidMount() {
    this.sceneSetup();
    this.animate();
  }

  sceneSetup = () => {
    // container = document.createElement("div");
    // document.body.appendChild(container);

    glScene = new THREE.Scene();
    cssScene = new THREE.Scene();
    glScene.background = new THREE.Color(0x0030ff);
    // cssScene.background = new THREE.Color(0x000000);
    // cssScene.background = new THREE.Color(0xffffff);
    camera = new THREE.PerspectiveCamera(
      25,
      window.innerWidth / window.innerHeight,
      1,
      500
    );
    camera.position.set(0, 0, 7);
    camera.lookAt(0, 0, 0);
    glRenderer = new THREE.WebGLRenderer({ antialias: true });
    glRenderer.setPixelRatio(window.devicePixelRatio);
    glRenderer.setSize(window.innerWidth, window.innerHeight);
    glRenderer.gammaOutput = true;
    glRenderer.domElement.style.position = "absolute";
    glRenderer.domElement.style.zIndex = -1;
    glRenderer.domElement.style.top = 0;

    var material = new THREE.MeshBasicMaterial({
      wireframe: false
    });
    material.color.set("grey");
    material.opacity = 0;
    // material.blending = THREE.NoBlending;
    var geometry = new THREE.PlaneGeometry();
    var planeMesh = new THREE.Mesh(geometry, material);
    glScene.add(planeMesh);

    // var element = document.createElement("div");
    // var newContent = document.createTextNode(
    //   "Hi there and greetings!xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    // );
    // element.appendChild(newContent);

    let element = document.createElement("img");
    element.src = "textures/star.png";

    // let element = document.createElement("hr");

    // var cssObject = new CSS3DObject(element);
    var cssObject = new CSS3DObject(element);

    cssScene.add(cssObject);

    cssRenderer = new CSS3DRenderer();
    cssRenderer.setSize(200, 200);
    cssRenderer.domElement.style.position = "absolute";
    // cssRenderer.domElement.style.top = 0;
    cssRenderer.domElement.style.zIndex = 0;

    cssRenderer.domElement.appendChild(glRenderer.domElement);
    container.appendChild(cssRenderer.domElement);
    // this.mount.appendChild(glRenderer.domElement);

    controls = new OrbitControls(camera, glRenderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    window.addEventListener("resize", this.onWindowResize, false);
    document.addEventListener("mousemove", this.onDocumentMouseMove, false);
    document.addEventListener("touchstart", this.onDocumentTouchStart, false);
    document.addEventListener("touchmove", this.onDocumentTouchMove, false);
  };

  onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    glRenderer.setSize(window.innerWidth, window.innerHeight);
  };

  animate = () => {
    requestAnimationFrame(this.animate);
    glRenderer.render(glScene, camera);
    cssRenderer.render(cssScene, camera);
  };

  render() {
    return <div ref={el => (container = el)} />;
  }
}

export default Test;

import React, { Component } from "react";
import * as THREE from "three";
import ReactDOM from "react-dom";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  CSS3DRenderer,
  CSS3DObject
} from "three/examples/jsm/renderers/CSS3DRenderer.js";
import About from "./2D/About";
// const About = require("./2D/About");

let camera, glScene, cssScene, glRenderer, cssRenderer, controls, container;

class Test2 extends Component {
  componentDidMount() {
    this.initialize();
  }

  ///////////////////////////////////////////////////////////////////
  // Creates WebGL Renderer
  //
  ///////////////////////////////////////////////////////////////////
  createGlRenderer = () => {
    var glRenderer = new THREE.WebGLRenderer({ alpha: true });
    glRenderer.setClearColor(0xecf8ff);
    glRenderer.setPixelRatio(window.devicePixelRatio);
    glRenderer.setSize(window.innerWidth, window.innerHeight);
    glRenderer.domElement.style.position = "absolute";
    glRenderer.domElement.style.zIndex = 1;
    glRenderer.domElement.style.top = 0;
    return glRenderer;
  };
  ///////////////////////////////////////////////////////////////////
  // Creates CSS Renderer
  //
  ///////////////////////////////////////////////////////////////////
  createCssRenderer = () => {
    var cssRenderer = new CSS3DRenderer();
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.domElement.style.position = "absolute";
    glRenderer.domElement.style.zIndex = 0;
    cssRenderer.domElement.style.top = 0;
    return cssRenderer;
  };

  ///////////////////////////////////////////////////////////////////
  // Creates plane mesh
  //
  ///////////////////////////////////////////////////////////////////
  createPlane = (w, h, position, rotation) => {
    var material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      opacity: 0.0,
      side: THREE.DoubleSide
    });
    var geometry = new THREE.PlaneGeometry(w, h);
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = position.x;
    mesh.position.y = position.y;
    mesh.position.z = position.z;
    mesh.rotation.x = rotation.x;
    mesh.rotation.y = rotation.y;
    mesh.rotation.z = rotation.z;
    return mesh;
  };

  ///////////////////////////////////////////////////////////////////
  // Creates CSS object
  //
  ///////////////////////////////////////////////////////////////////

  createCssObject = () => {
    // let element = document.createElement("img");
    // element.src = "textures/star.png";

    // var element = document.createElement("div");
    // var newContent = document.createTextNode(
    //   "Hi there and greetings!xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    // );
    // element.appendChild(newContent);
    // var cssObject = new CSS3DObject(element);
    // console.log(typeof About);

    let div = document.createElement("div");
    let node = document.createTextNode("Insert 2D Content Here!");
    div.appendChild(node);
    // console.log(element);
    var cssObject = new CSS3DObject(div);

    // cssScene.add(cssObject);
    return cssObject;
  };

  ///////////////////////////////////////////////////////////////////
  // Creates 3d webpage object
  //
  ///////////////////////////////////////////////////////////////////
  create3dPage = (w, h, position, rotation, url) => {
    var plane = this.createPlane(w, h, position, rotation);
    glScene.add(plane);
    var cssObject = this.createCssObject();
    cssScene.add(cssObject);
  };

  ///////////////////////////////////////////////////////////////////
  // Creates material with random color
  //
  ///////////////////////////////////////////////////////////////////
  createColoredMaterial = () => {
    var material = new THREE.MeshBasicMaterial({
      color: Math.floor(Math.random() * 16777215),
      shading: THREE.FlatShading,
      side: THREE.DoubleSide
    });
    return material;
  };

  ///////////////////////////////////////////////////////////////////
  // Creates 3D geometry to place in the scene
  //
  ///////////////////////////////////////////////////////////////////
  create3dGeometry = () => {
    var mesh1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0, 200, 300, 20, 4),
      this.createColoredMaterial()
    );
    mesh1.position.x = 0;
    mesh1.position.y = -300;
    mesh1.position.z = 400;
    glScene.add(mesh1);
    var mesh2 = new THREE.Mesh(
      new THREE.BoxGeometry(200, 200, 200),
      this.createColoredMaterial()
    );
    mesh2.position.x = -300;
    mesh2.position.y = -300;
    mesh2.position.z = 400;
    glScene.add(mesh2);
    var mesh3 = new THREE.Mesh(
      new THREE.SphereGeometry(100, 128, 128),
      this.createColoredMaterial()
    );
    mesh3.position.x = 500;
    mesh3.position.y = -300;
    mesh3.position.z = 400;
    glScene.add(mesh3);
  };

  ///////////////////////////////////////////////////////////////////
  // Initializes scene
  //
  ///////////////////////////////////////////////////////////////////
  initialize = () => {
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.set(0, 100, 3000);
    glRenderer = this.createGlRenderer();
    cssRenderer = this.createCssRenderer();
    container = document.createElement("div");
    document.body.appendChild(container);
    //document.body.appendChild(glRenderer.domElement);
    document.body.appendChild(cssRenderer.domElement);
    cssRenderer.domElement.appendChild(glRenderer.domElement);
    glScene = new THREE.Scene();
    cssScene = new THREE.Scene();
    controls = new OrbitControls(camera, glRenderer.domElement);
    var ambientLight = new THREE.AmbientLight(0x555555);
    glScene.add(ambientLight);
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(-0.5, 0.5, -1.5).normalize();
    glScene.add(directionalLight);
    this.create3dPage(
      1000,
      1000,
      new THREE.Vector3(-1050, 0, 400),
      new THREE.Vector3(0, (45 * Math.PI) / 180, 0),
      "http://viewer.autodesk.io/node/ng-gallery/#/home"
    );
    this.create3dPage(
      900,
      1000,
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
      "http://adndevblog.typepad.com/cloud_and_mobile"
    );
    this.create3dPage(
      1000,
      1000,
      new THREE.Vector3(1050, 0, 400),
      new THREE.Vector3(0, (-45 * Math.PI) / 180, 0),
      "http://mongo.autodesk.io"
    );
    this.create3dGeometry();
    this.update();
  };

  ///////////////////////////////////////////////////////////////////
  // Updates scene
  //
  ///////////////////////////////////////////////////////////////////
  update = () => {
    controls.update();
    glRenderer.render(glScene, camera);
    cssRenderer.render(cssScene, camera);
    requestAnimationFrame(this.update);
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
    return <div ref={this.container} />;
  }
}

export default Test2;

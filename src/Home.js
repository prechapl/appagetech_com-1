import React, { Component } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { EquirectangularToCubeGenerator } from "three/examples/jsm/loaders/EquirectangularToCubeGenerator.js";
import { PMREMGenerator } from "three/examples/jsm/pmrem/PMREMGenerator.js";
import { PMREMCubeUVPacker } from "three/examples/jsm/pmrem/PMREMCubeUVPacker.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";

let cubeGenerator, hdrEnvMap;

// Texture width for simulation
let WIDTH = 512;
// Water size in system units
let BOUNDS = 512;
var BOUNDS_HALF = BOUNDS * 0.5;
var controls;
var camera, scene, renderer;
var mouseMoved = false;
var mouseCoords = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var waterMesh;
var meshRay;
var gpuCompute;
var heightmapVariable;
var waterUniforms;
var smoothShader;
var readWaterLevelShader;
var readWaterLevelRenderTarget;
var readWaterLevelImage;
var waterNormal = new THREE.Vector3();

var simplex = new SimplexNoise();

class Home extends Component {
  componentDidMount() {
    this.sceneSetup();
    this.loadAssets();
    this.lighting();
  }

  lighting = () => {
    const spotLight1 = new THREE.SpotLight(0x0b0038, 1, 0, Math.PI / 3);
    spotLight1.position.set(100, 100, 100);
    spotLight1.lookAt(0, 0, 0);
    // spotLight1.penumbra = 1;
    spotLight1.angle = 1.05;
    // const spotLightHelper1 = new THREE.SpotLightHelper(spotLight1);
    // scene.add(spotLightHelper1);
    scene.add(spotLight1);

    const spotLight2 = new THREE.SpotLight(0x680056, 1, 0, Math.PI / 3);
    spotLight2.position.set(-300, -200, 250);
    spotLight2.lookAt(0, 0, 0);
    // spotLight2.penumbra = 1;
    spotLight2.angle = 1.05;
    // const spotLightHelper2 = new THREE.SpotLightHelper(spotLight2);
    // scene.add(spotLightHelper2);
    scene.add(spotLight2);
  };

  sceneSetup = () => {
    this.container = document.createElement("div");
    document.body.appendChild(this.container);
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      25,
      window.innerWidth / window.innerHeight,
      1,
      500
    );
    camera.position.set(0, 0, 225);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.gammaOutput = true;
    this.container.appendChild(renderer.domElement);
    // controls = new OrbitControls(camera, renderer.domElement);
    // controls.target.set(0, 0, 215);
    // controls.update();
    window.addEventListener("resize", this.onWindowResize, false);
    document.addEventListener("mousemove", this.onDocumentMouseMove, false);
    document.addEventListener("touchstart", this.onDocumentTouchStart, false);
    document.addEventListener("touchmove", this.onDocumentTouchMove, false);
    document.addEventListener(
      "keydown",
      function(event) {
        // W Pressed: Toggle wireframe
        if (event.keyCode === 87) {
          waterMesh.material.wireframe = !waterMesh.material.wireframe;
          waterMesh.material.needsUpdate = true;
        }
      },
      false
    );
    window.addEventListener("resize", this.onWindowResize, false);
  };

  loadAssets = () => {
    new RGBELoader()
      .setDataType(THREE.UnsignedByteType)
      .setPath("textures/")
      .load("diyHdri_04f.hdr", function(texture) {
        cubeGenerator = new EquirectangularToCubeGenerator(texture, {
          resolution: 1024
        });
        cubeGenerator.update(renderer);
        const pmremGenerator = new PMREMGenerator(
          cubeGenerator.renderTarget.texture
        );
        pmremGenerator.update(renderer);
        const pmremCubeUVPacker = new PMREMCubeUVPacker(
          pmremGenerator.cubeLods
        );
        pmremCubeUVPacker.update(renderer);
        hdrEnvMap = pmremCubeUVPacker.CubeUVRenderTarget.texture;

        // Models
        const typeParams = {
          envMap: hdrEnvMap,
          envMapIntensity: 5,
          color: 0x000000,
          metalness: 1,
          roughness: 0
        };
        const iconParams = {
          envMap: hdrEnvMap,
          envMapIntensity: 5,
          // emissive: 0xfff000,
          // emissiveIntensity: 0.2,
          color: 0x302203,
          // color: 0xfad44b,
          metalness: 1,
          roughness: 0.15
        };
        const yPos = 0;
        const zPos = 215;
        const zRot = null;

        const logoType = new GLTFLoader().setPath("/models/");
        logoType.load("Logo_Type.glb", function(gltf) {
          gltf.scene.traverse(function(child) {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial(typeParams);
            }
          });
          gltf.scene.position.x = -2.2;
          gltf.scene.position.y = yPos;
          gltf.scene.position.z = zPos;
          gltf.scene.rotation.z = zRot;
          scene.add(gltf.scene);
        });

        const logoIcon = new GLTFLoader().setPath("/models/");
        logoIcon.load("Solid_Icon.glb", function(gltf) {
          gltf.scene.traverse(function(child) {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial(iconParams);
            }
          });
          gltf.scene.position.x = -2.2;
          gltf.scene.position.y = yPos;
          gltf.scene.position.z = zPos;
          gltf.scene.rotation.z = zRot;
          scene.add(gltf.scene);
        });

        const contactType = new GLTFLoader().setPath("/models/");
        contactType.load("Contact_Button_Type.glb", function(gltf) {
          gltf.scene.traverse(function(child) {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial(typeParams);
            }
          });
          scene.add(gltf.scene);
          gltf.scene.position.y = yPos;
          gltf.scene.position.z = zPos;
          gltf.scene.rotation.z = zRot;
        });

        const contactIcon = new GLTFLoader().setPath("/models/");
        contactIcon.load("Solid_Icon.glb", function(gltf) {
          gltf.scene.traverse(function(child) {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial(iconParams);
            }
          });
          scene.add(gltf.scene);
          gltf.scene.position.y = yPos;
          gltf.scene.position.z = zPos;
          gltf.scene.rotation.z = zRot;
        });

        const aboutType = new GLTFLoader().setPath("/models/");
        aboutType.load("About_Button_Type.glb", function(gltf) {
          gltf.scene.traverse(function(child) {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial(typeParams);
            }
          });
          gltf.scene.position.x = -0.97;
          gltf.scene.position.y = yPos;
          gltf.scene.position.z = zPos;
          gltf.scene.rotation.z = zRot;
          scene.add(gltf.scene);
        });

        const aboutIcon = new GLTFLoader().setPath("/models/");
        aboutIcon.load("Solid_Icon.glb", function(gltf) {
          gltf.scene.traverse(function(child) {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial(iconParams);
            }
          });
          gltf.scene.position.x = -0.97;
          gltf.scene.position.y = yPos;
          gltf.scene.position.z = zPos;
          gltf.scene.rotation.z = zRot;
          scene.add(gltf.scene);
        });

        const projectsType = new GLTFLoader().setPath("/models/");
        projectsType.load("Projects_Button_Type.glb", function(gltf) {
          gltf.scene.traverse(function(child) {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial(typeParams);
            }
          });
          gltf.scene.position.x = 0.97;
          gltf.scene.position.y = yPos;
          gltf.scene.position.z = zPos;
          gltf.scene.rotation.z = zRot;
          scene.add(gltf.scene);
        });

        const projectsIcon = new GLTFLoader().setPath("/models/");
        projectsIcon.load("Solid_Icon.glb", function(gltf) {
          gltf.scene.traverse(function(child) {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial(iconParams);
            }
          });
          gltf.scene.position.x = 0.97;
          gltf.scene.position.y = yPos;
          gltf.scene.position.z = zPos;
          gltf.scene.rotation.z = zRot;
          scene.add(gltf.scene);
        });

        const clientType = new GLTFLoader().setPath("/models/");
        clientType.load("Client_Button_Type.glb", function(gltf) {
          gltf.scene.traverse(function(child) {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial(typeParams);
            }
          });
          gltf.scene.position.x = 1.94;
          gltf.scene.position.y = yPos;
          gltf.scene.position.z = zPos;
          gltf.scene.rotation.z = zRot;
          scene.add(gltf.scene);
        });

        const clientIcon = new GLTFLoader().setPath("/models/");
        clientIcon.load("Solid_Icon.glb", function(gltf) {
          gltf.scene.traverse(function(child) {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial(iconParams);
            }
          });
          gltf.scene.position.x = 1.94;
          gltf.scene.position.y = yPos;
          gltf.scene.position.z = zPos;
          gltf.scene.rotation.z = zRot;
          scene.add(gltf.scene);
        });

        const initWater = () => {
          var materialColor = 0x000000;
          // const materialColor = 0xffffff;
          // var materialColor = 0x010204;

          var geometry = new THREE.PlaneBufferGeometry(
            BOUNDS,
            BOUNDS,
            WIDTH - 1,
            WIDTH - 1
          );
          // material: make a THREE.ShaderMaterial clone of THREE.MeshPhongMaterial, with customized vertex shader
          var material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
              THREE.ShaderLib["phong"].uniforms,
              {
                heightmap: { value: null }
              }
            ]),
            vertexShader: document.getElementById("waterVertexShader")
              .textContent,
            fragmentShader: THREE.ShaderChunk["meshphong_frag"]
          });
          material.lights = true;
          // Material attributes from THREE.MeshPhongMaterial
          material.color = new THREE.Color(materialColor);
          material.specular = new THREE.Color(0xffffff);
          material.shininess = 100;
          // Sets the uniforms with the material values
          material.uniforms["diffuse"].value = material.color;
          material.uniforms["specular"].value = material.specular;
          material.uniforms["shininess"].value = Math.max(
            material.shininess,
            1e-4
          );
          material.uniforms["opacity"].value = material.opacity;
          // Defines
          material.defines.WIDTH = WIDTH.toFixed(1);
          material.defines.BOUNDS = BOUNDS.toFixed(1);
          waterUniforms = material.uniforms;
          waterMesh = new THREE.Mesh(geometry, material);
          waterMesh.rotation.x = 2 * Math.PI;
          waterMesh.matrixAutoUpdate = false;
          waterMesh.updateMatrix();
          scene.add(waterMesh);
          // THREE.Mesh just for mouse raycasting
          var geometryRay = new THREE.PlaneBufferGeometry(BOUNDS, BOUNDS, 1, 1);
          meshRay = new THREE.Mesh(
            geometryRay,
            new THREE.MeshBasicMaterial({ color: 0xffffff, visible: false })
          );
          meshRay.rotation.x = 2 * Math.PI;
          meshRay.matrixAutoUpdate = false;
          meshRay.updateMatrix();
          scene.add(meshRay);
          // Creates the gpu computation class and sets it up
          gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer);
          var heightmap0 = gpuCompute.createTexture();
          fillTexture(heightmap0);
          heightmapVariable = gpuCompute.addVariable(
            "heightmap",
            document.getElementById("heightmapFragmentShader").textContent,
            heightmap0
          );
          gpuCompute.setVariableDependencies(heightmapVariable, [
            heightmapVariable
          ]);
          heightmapVariable.material.uniforms["mousePos"] = {
            value: new THREE.Vector2(10000, 10000)
          };
          heightmapVariable.material.uniforms["mouseSize"] = { value: 10.0 };
          heightmapVariable.material.uniforms["viscosityConstant"] = {
            value: 0.93
          };
          heightmapVariable.material.uniforms["heightCompensation"] = {
            value: 0
          };
          heightmapVariable.material.defines.BOUNDS = BOUNDS.toFixed(1);
          var error = gpuCompute.init();
          if (error !== null) {
            console.error(error);
          }
          // Create compute shader to smooth the water surface and velocity
          smoothShader = gpuCompute.createShaderMaterial(
            document.getElementById("smoothFragmentShader").textContent,
            { smoothTexture: { value: null } }
          );
          // Create compute shader to read water level
          readWaterLevelShader = gpuCompute.createShaderMaterial(
            document.getElementById("readWaterLevelFragmentShader").textContent,
            {
              point1: { value: new THREE.Vector2() },
              levelTexture: { value: null }
            }
          );
          readWaterLevelShader.defines.WIDTH = WIDTH.toFixed(1);
          readWaterLevelShader.defines.BOUNDS = BOUNDS.toFixed(1);
          // Create a 4x1 pixel image and a render target (Uint8, 4 channels, 1 byte per channel) to read water height and orientation
          readWaterLevelImage = new Uint8Array(4 * 1 * 4);
          readWaterLevelRenderTarget = new THREE.WebGLRenderTarget(4, 1, {
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat,
            type: THREE.UnsignedByteType,
            stencilBuffer: false,
            depthBuffer: false
          });
        };

        const fillTexture = texture => {
          var waterMaxHeight = 10;
          function noise(x, y) {
            var multR = waterMaxHeight;
            var mult = 0.025;
            var r = 0;
            for (var i = 0; i < 15; i++) {
              r += multR * simplex.noise(x * mult, y * mult);
              multR *= 0.53 + 0.025 * i;
              mult *= 1.25;
            }
            return r;
          }
          var pixels = texture.image.data;
          var p = 0;
          for (var j = 0; j < WIDTH; j++) {
            for (var i = 0; i < WIDTH; i++) {
              var x = (i * 128) / WIDTH;
              var y = (j * 128) / WIDTH;
              pixels[p + 0] = noise(x, y);
              pixels[p + 1] = pixels[p + 0];
              pixels[p + 2] = 0;
              pixels[p + 3] = 1;
              p += 4;
            }
          }
        };

        const animate = () => {
          requestAnimationFrame(animate);
          sceneRender();
        };

        const sceneRender = () => {
          // Set uniforms: mouse interaction
          var uniforms = heightmapVariable.material.uniforms;
          if (mouseMoved) {
            raycaster.setFromCamera(mouseCoords, camera);
            var intersects = raycaster.intersectObject(meshRay);
            if (intersects.length > 0) {
              var point = intersects[0].point;
              uniforms["mousePos"].value.set(point.x, point.z);
            } else {
              uniforms["mousePos"].value.set(10000, 10000);
            }
            mouseMoved = false;
          } else {
            uniforms["mousePos"].value.set(10000, 10000);
          }
          // Do the gpu computation
          gpuCompute.compute();
          // if (spheresEnabled) {
          //   this.sphereDynamics();
          // }
          // Get compute output in custom uniform
          waterUniforms["heightmap"].value = gpuCompute.getCurrentRenderTarget(
            heightmapVariable
          ).texture;
          // Render
          renderer.render(scene, camera);
        };

        initWater();
        animate();
        pmremGenerator.dispose();
        pmremCubeUVPacker.dispose();

        // scene.background = cubeGenerator.renderTarget;

        scene.background = new THREE.Color(0xffffff);
        // scene.background = new THREE.Color(0x000000);
      });
  };

  onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  setMouseCoords = (x, y) => {
    mouseCoords.set(
      (x / renderer.domElement.clientWidth) * 2 - 1,
      -(y / renderer.domElement.clientHeight) * 2 + 1
    );
    mouseMoved = true;
  };
  onDocumentMouseMove = event => {
    this.setMouseCoords(event.clientX, event.clientY);
  };
  onDocumentTouchStart = event => {
    if (event.touches.length === 1) {
      event.preventDefault();
      this.setMouseCoords(event.touches[0].pageX, event.touches[0].pageY);
    }
  };
  onDocumentTouchMove = event => {
    if (event.touches.length === 1) {
      event.preventDefault();
      this.setMouseCoords(event.touches[0].pageX, event.touches[0].pageY);
    }
  };

  render() {
    return <div ref={el => (this.mount = el)} />;
  }
}

export default Home;

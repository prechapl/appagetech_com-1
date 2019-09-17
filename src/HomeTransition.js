import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { EquirectangularToCubeGenerator } from "three/examples/jsm/loaders/EquirectangularToCubeGenerator.js";
import { PMREMGenerator } from "three/examples/jsm/pmrem/PMREMGenerator.js";
import { PMREMCubeUVPacker } from "three/examples/jsm/pmrem/PMREMCubeUVPacker.js";
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise.js";
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import About from './2D/About';
import React from 'react';
import ReactDOM from 'react-dom';

var mouseMoved = false;
var mouseCoords = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var waterMesh;
var meshRay;
var gpuCompute;
var heightmapVariable;
var waterUniforms;
var readWaterLevelShader;
var readWaterLevelRenderTarget;
var readWaterLevelImage;
var waterNormal = new THREE.Vector3();
var simplex = new SimplexNoise();

export default function HomeTransition(renderer, clearColor, container) {

    // State variagels
    let reactAboutRendered = false;
    // Water variables
    // Texture width for simulation
    let WIDTH = 512;
    // Water size in system units
    let BOUNDS = 366;

    // Scene creation
    const scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      25,
      window.innerWidth / window.innerHeight,
      1,
      500
    );
    this.camera.position.set(0, 0, 225);
    this.camera.lookAt(0, 0, 0)

    // CSS RENDER EXAMPLE
    const scene2 = new THREE.Scene();
    //var material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, wireframeLinewidth: 1, side: THREE.DoubleSide } );
    //
    var element = document.createElement( 'div' );
    element.style.width = '50px';
    element.style.height = '50px';
    element.style.opacity = 0.5;
    element.style.background = new THREE.Color( Math.random() * 0xffffff ).getStyle();
    element.id = "abouttest"
    var object = new CSS3DObject( element );
    object.position.x = 0;
    object.position.y = 0;
    object.position.z = 0;
    scene2.add( object );

    //
    const renderer2 = new CSS3DRenderer();
    renderer2.setSize( window.innerWidth, window.innerHeight );
    renderer2.domElement.style.position = 'absolute';
    renderer2.domElement.style.top = 0;
    container.appendChild( renderer2.domElement );
    const renderCSS3D = () => {
      renderer2.render( scene2, this.camera );
    }

    // Window functions
    const onDocumentMouseMove = event => {
        setMouseCoords(event.clientX, event.clientY);
    };
    document.addEventListener("mousemove", onDocumentMouseMove, false);
    const setMouseCoords = (x, y) => {
        mouseCoords.set(
        (x / renderer.domElement.clientWidth) * 2 - 1,
        -(y / renderer.domElement.clientHeight) * 2 + 1
        );
        mouseMoved = true;
    };
    const onDocumentTouchStart = event => {
        if (event.touches.length === 1) {
        event.preventDefault();
        setMouseCoords(event.touches[0].pageX, event.touches[0].pageY);
        }
    };
    document.addEventListener("touchstart", onDocumentTouchStart, false);
    const onDocumentTouchMove = event => {
        if (event.touches.length === 1) {
        event.preventDefault();
        this.setMouseCoords(event.touches[0].pageX, event.touches[0].pageY);
        }
    };
    document.addEventListener("touchmove", onDocumentTouchMove, false);
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

    let cubeGenerator, hdrEnvMap;
    new RGBELoader()
      .setDataType(THREE.UnsignedByteType)
      .setPath("textures/")
      .load("diyHdri_04d.hdr", function(texture) {
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
        // hdrEnvMap.rotation = 180;

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
          envMapIntensity: 1,
          // emissive: 0xfff000,
          // emissiveIntensity: 0.2,
          color: 0xfad44b,
          metalness: 0.95,
          roughness: 0.1
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
        pmremGenerator.dispose();
        pmremCubeUVPacker.dispose();
      });

    const initWater = () => {
        // var materialColor = 0x00000;
        var materialColor = 0x010204;
        // var materialColor = 0x020202;
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

        // material.envMap = hdrEnvMap;
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
        waterMesh.rotation.x = Math.PI / 2;
        waterMesh.matrixAutoUpdate = false;
        waterMesh.updateMatrix();
        scene.add(waterMesh);
        // THREE.Mesh just for mouse raycasting
        var geometryRay = new THREE.PlaneBufferGeometry(BOUNDS, BOUNDS, 1, 1);
        meshRay = new THREE.Mesh(
            geometryRay,
            new THREE.MeshBasicMaterial({ color: 0xffffff, visible: false })
        );
        // meshRay.rotation.x = Math.PI / 2;
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
    
    // Set uniforms: mouse interaction
    initWater();
    // scene.background = cubeGenerator.renderTarget;
    scene.background = new THREE.Color(0xffffff);
    var renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
	  this.fbo = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );
    this.render = function ( delta, rtt ) {
        var uniforms = heightmapVariable.material.uniforms;
        if (mouseMoved) {
            raycaster.setFromCamera(mouseCoords, this.camera);
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
        waterUniforms["heightmap"].value = gpuCompute.getCurrentRenderTarget(
            heightmapVariable
            ).texture;
        renderer.setClearColor( this.clearColor );
        if ( rtt ) {
          renderer.setRenderTarget( this.fbo );
          renderer.clear()
          renderer.render( scene, this.camera );
        } else {
          renderer.setRenderTarget( null );
          renderer.render( scene, this.camera );
          renderer2.render( scene2, this.camera );
          if (reactAboutRendered === false) {
            // React rendering after div is appended
            const aboutElement = document.getElementById("abouttest")
            ReactDOM.render(<About />, aboutElement)
          }
        }
    }

    this.onDocumentTouchMove = event => {
        if (event.touches.length === 1) {
        event.preventDefault();
        this.setMouseCoords(event.touches[0].pageX, event.touches[0].pageY);
        }
    };
};

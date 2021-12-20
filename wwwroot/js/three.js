import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

const gltfLoader = new GLTFLoader();

// Scene
const scenePC = new THREE.Scene();
const sceneMobiles = new THREE.Scene();

// Objects
gltfLoader.load("./wwwroot/models/pc.gltf", gltf => {scenePC.add(gltf.scene); gltf.scene.rotation.set(0, 0.4, 0);});
gltfLoader.load("./wwwroot/models/tablet.gltf", gltf => { 
    const children = [...gltf.scene.children]; 
    children.forEach(child => sceneMobiles.add(child)); 
});

// Sizes
const PCsizes = {width: 752, height: 572};
const mobileSizes = {width: 1110, height: 640}

// Lights
const directionalLightPC = new THREE.DirectionalLight(0xffffff, 2); 
const directionalLightMobiles = new THREE.DirectionalLight(0xffffff, 3.43)
const ambientLightPC = new THREE.AmbientLight(0xffffff, 1.4);
directionalLightPC.position.set(12, 12, 12);
directionalLightMobiles.position.set(2.56, 3.86, 20); 

// Camera
const cameraPC = new THREE.PerspectiveCamera(25, PCsizes.width / PCsizes.height);
const cameraMobiles = new THREE.PerspectiveCamera(25, mobileSizes.width / mobileSizes.height);
cameraPC.position.z = 10.2;
cameraMobiles.position.set(-4, 0, 10.5);
scenePC.add(cameraPC, directionalLightPC, ambientLightPC);
sceneMobiles.add(cameraMobiles, directionalLightMobiles);

// Controls
const canvasPC = document.querySelector("#pc-model");
const canvasMobiles = document.querySelector("#mobiles-model");
const controlsPC = new OrbitControls(cameraPC, canvasPC);
const controlsMobiles = new OrbitControls(cameraMobiles, canvasMobiles);
controlsPC.enableDamping = true;
controlsMobiles.enableDamping = true; 
controlsPC.minDistance = 5;
controlsPC.maxDistance = 16;
controlsMobiles.minDistance = 5;
controlsMobiles.maxDistance = 16;

// Renderer
const rendererPC = new THREE.WebGLRenderer({
    canvas: canvasPC,
    antialias: true,
    alpha:true
});
rendererPC.setPixelRatio(2);
rendererPC.setSize(PCsizes.width, PCsizes.height);
rendererPC.render(scenePC, cameraPC);
rendererPC.physicallyCorrectLights = true;

const rendererMobiles = new THREE.WebGLRenderer({
    canvas: canvasMobiles,
    antialias: true,
    alpha:true
});
rendererMobiles.setPixelRatio(2);
rendererMobiles.setSize(mobileSizes.width, mobileSizes.height);
rendererMobiles.render(sceneMobiles, cameraMobiles);
rendererMobiles.physicallyCorrectLights = true;

// Animate
const tick = () =>{
    controlsPC.update();
    rendererPC.render(scenePC, cameraPC);
    controlsMobiles.update();
    rendererMobiles.render(sceneMobiles, cameraMobiles);
    window.requestAnimationFrame(tick);
}

tick();
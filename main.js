import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
const isDesktop = window.innerWidth > 768;
let mixer = new THREE.AnimationMixer();
const clock = new THREE.Clock();
const scene = new THREE.Scene();

const loader = new GLTFLoader();

let characterLoaded = false;

const camera = new THREE.PerspectiveCamera(
  20,
  window.innerWidth / window.innerHeight,
  0.1,
  20000
);
const startingX = 0;
const startingY = 1;
const startingZ = 4;
if (!characterLoaded) {
  window.scrollTo({ top: 0 });
  camera.position.set(startingX, startingY, startingZ);
  camera.rotation.set(0, 0, 0);
}

let oliver;
let office;

let newScroll = window.scrollY;
window.addEventListener("scroll", () => {
  const oldScroll = newScroll;
  newScroll = window.scrollY;
  const scrollDelta = oldScroll - newScroll;
  if (scrollY <= 200) {
    //camera.translateZ(scrollDelta * 0.016);
    camera.position.set(startingX, startingY, startingZ + scrollY * -0.015);
    camera.rotation.set(0, 0, 0);
  } else if (scrollY <= 400) {
    camera.position.set(startingX + (scrollY - 200) * 0.0005, startingY, 1);
    camera.rotation.set(0, 0, 0);
  }
  //} else if (scrollY <= 500) {
  else if (scrollY <= 550) {
    camera.position.set(0.1 + (scrollY - 400) * 0.009, 1, 1);
    camera.rotation.set(0, (scrollY - 400) * 0.006, 0);
  } else if (scrollY <= 835) {
    camera.position.set(1.45, 1, 1 + (scrollY - 550) * -0.01);
    //camera.rotation.set(0, 0.9, 0);
    camera.rotation.set(0, 0.9 + (scrollY - 550) * 0.0055, 0);
    console.log(camera.position);
    console.log(scrollY);
  } else if (scrollY <= 968) {
    camera.rotation.set(0, 2.5, 0);
    camera.translateX(scrollDelta * -0.000019);
    camera.translateZ(scrollDelta * 0.016);
  } else {
    console.log(camera.position);
    console.log(scrollY);
  }
});

const canvas = document.querySelector("#bg");

const renderer = new THREE.WebGL1Renderer({
  alpha: true,
  canvas,
});

/* window.onresize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}; */
//const controls = new OrbitControls(camera, renderer.domElement);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.render(scene, camera);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, 0, 1);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

scene.background = null;
const officePositions = { x: 0, y: 0.77, z: 0 };
loader.load(
  "models/animated/oliver typing.glb",
  function (gltf) {
    oliver = gltf.scene;
    oliver.traverse(function (object) {
      if (object.isMesh) {
        object.frustumCulled = false;
        // object.castShadow = true;
      }
    });
    oliver.rotateY(-0.8);
    oliver.position.set(
      officePositions.x + 0.14,
      officePositions.y - 0.045,
      officePositions.z - 0.13
    );
    mixer = new THREE.AnimationMixer(oliver);
    const animations = gltf.animations;
    const typingAction = mixer.clipAction(animations[0]);
    scene.add(oliver);
    typingAction.play();
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

loader.load(
  "models/office/scene.gltf",
  function (gltf) {
    office = gltf.scene;
    office.scale.set(0.003, 0.003, 0.003);
    office.rotateY(1);
    office.position.set(
      officePositions.x,
      officePositions.y,
      officePositions.z
    );
    //model.rotateY(-0.5);
    scene.add(office);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

function animate() {
  requestAnimationFrame(animate);
  if (oliver) {
    renderer.render(scene, camera);
    mixer.update(clock.getDelta());
  }
}

animate();

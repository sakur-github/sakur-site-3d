import "./style.css";

import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
const isDesktop = window.innerWidth > 768;
let mixer = new THREE.AnimationMixer();
const clock = new THREE.Clock();
const scene = new THREE.Scene();

const loader = new GLTFLoader();

const camera = new THREE.PerspectiveCamera(
  10,
  window.innerWidth / window.innerHeight,
  0.1,
  20000
);
camera.position.setZ(1);

/* function moveCamera() {
  const top = document.body.getBoundingClientRect().top;
  camera.position.setY(top * 0.0001);
}
moveCamera();
document.body.onscroll = moveCamera; */

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

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.render(scene, camera);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, 0, 1);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

scene.background = null;

loader.load(
  "models/animated/oliver typing.glb",
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    if (isDesktop) {
      model.position.set(0.12, -0.32, 0);
    } else {
      model.position.set(0.05, -0.32, 0);
    }
    model.rotateY(-0.5);
    model.traverse(function (object) {
      if (object.isMesh) {
        object.frustumCulled = false;
        object.castShadow = true;
      }
    });

    mixer = new THREE.AnimationMixer(model);
    const animations = gltf.animations;
    const typingAction = mixer.clipAction(animations[0]);
    typingAction.play();
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
  mixer.update(clock.getDelta());
}

animate();

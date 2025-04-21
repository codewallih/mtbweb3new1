import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "https://cdn.skypack.dev/gsap";

const camera = new THREE.PerspectiveCamera(
  10,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 5;

const scene = new THREE.Scene();

let bee;
let mixer;

const loader = new GLTFLoader();

loader.load("/mtb.glb", function (gltf) {
  bee = gltf.scene;
  scene.add(bee);
  bee.scale.set(0.1, 0.1, 0.1);
  mixer = new THREE.AnimationMixer(bee);
  mixer.clipAction(gltf.animations[0]).play();
});

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

const reRender3d = () => {
  requestAnimationFrame(reRender3d);
  renderer.render(scene, camera);
  if (mixer) mixer.update(0.02);
};

reRender3d();

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 3.5);
scene.add(topLight);

let totalRotation = { x: 0, y: 0, z: 0 };

window.addEventListener("scroll", () => {
  const delta = window.scrollY;
  const rotationSpeed = 0.0001;

  totalRotation.x += delta * rotationSpeed;
  totalRotation.y += delta * rotationSpeed;
  totalRotation.z += delta * rotationSpeed;

  if (bee) {
    bee.rotation.x = totalRotation.x;
    bee.rotation.y = totalRotation.y;
    bee.rotation.z = totalRotation.z;
  }
});

let hoverDirection = 1;
let hoverSpeed = 0.001;
let hoverHeight = 0.5;

const hoverEffect = () => {
  if (bee) {
    bee.position.y += hoverDirection * hoverSpeed;
    if (bee.position.y >= hoverHeight || bee.position.y <= -hoverHeight) {
      hoverDirection *= -1;
    }
  }
};

const animate = () => {
  requestAnimationFrame(animate);
  hoverEffect();
};
animate();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

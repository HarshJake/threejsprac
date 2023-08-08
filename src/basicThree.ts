import * as THREE from "three";

//scene
const scene = new THREE.Scene();

/**
 * Objects
 *  -Geometry
 *  -Material
 *  -Mesh
 */
const geometruy = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometruy, material);
// mesh.position.x = 1.5;
// mesh.position.y = -0.6;
// mesh.position.z = -1;
mesh.position.set(1.5, -0.6, -3);

//add mesh to scene
scene.add(mesh);

//norma;ise mesh
// mesh.position.normalize();

// //distance b/w center of scene and position of object
// console.log(mesh.position.length());

//Axes Helper
const axesHelper = new THREE.AxesHelper();

//sizes
const sizes = {
  width: 800,
  height: 800,
};

//camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// //distance b/w the camera  and object postion
// console.log(mesh.position.distanceTo(camera.position));

//canvas
const canvas = document.getElementById("webgl");

//renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas! });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

import {
  Scene,
  MeshBasicMaterial,
  PerspectiveCamera,
  BoxGeometry,
  Mesh,
  WebGLRenderer,
  // SphereGeometry,
  // CircleGeometry,
  // PlaneGeometry,
  // BufferGeometry,
  // BufferAttribute,
  // Clock,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as DAT from "lil-gui";
import gsap from "gsap";

interface DocumentWithFullscreen extends HTMLDocument {
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  webkitFullscreenElement?: Element;
  msExitFullscreen?: () => void;
  mozCancelFullScreen?: () => void;
  webkitExitFullscreen?: () => void;
}
interface DocumentElementWithFullscreen extends HTMLElement {
  msRequestFullscreen?: () => void;
  mozRequestFullScreen?: () => void;
  webkitRequestFullscreen?: () => void;
}
const properties = {
  color: 0xff0000,
  spin: () => {
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
  },
  cameraY: () => {
    gsap.to(camera.position, {
      duration: 1,
      z: -camera.position.z + 2 * 2,
    });
  },
};
const gui = new DAT.GUI();
const scene = new Scene();

const geometry = new BoxGeometry(1, 1, 1, 10, 20, 10);
// const geometry = new SphereGeometry(1, 5, 5);
// const geometry = new BufferGeometry();

// const positionsArray = new Float32Array(500 * 3 * 3);

// for (let i = 0; i < 800 * 3 * 3; i++) {
//   positionsArray[i] = Math.random() - 0.5 * 4;
// }

// const positionAttributes = new BufferAttribute(positionsArray, 3);
// geometry.setAttribute("position", positionAttributes);

const material = new MeshBasicMaterial({
  color: properties.color,
  wireframe: true,
});

const mesh = new Mesh(geometry, material);

gui.add(mesh.position, "y", -3, 3, 0.01);
gui.add(mesh. , "y").min(-3).max(3).step(0.001).name("elevation");
gui.add(mesh, "visible");
gui.add(material, "wireframe");
gui.addColor(properties, "color").onChange(() => {
  material.color.set(properties.color);
});
gui.add(properties, "spin");
gui.add(properties, "cameraY");

scene.add(mesh);

const sizes = {
  width: innerWidth,
  height: innerHeight,
};

const camera = new PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

const canvas = document.getElementById("webgl");

const renderer = new WebGLRenderer({ canvas: canvas! });

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

//clock
// const clock = new Clock();

// const cursor = {
//   x: 0,
//   y: 0,
// };
// window.addEventListener("mousemove", (e) => {
//   cursor.x = e.clientX / sizes.width - 0.5;
//   cursor.y = -(e.clientY / sizes.height - 0.5);
// });
window.addEventListener("resize", () => {
  sizes.width = innerWidth;
  sizes.height = innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.max(devicePixelRatio, 2));
});

//full screen
window.addEventListener("dblclick", () => {
  const element = canvas as DocumentElementWithFullscreen;
  const doc = document as DocumentWithFullscreen;
  const fullScreenElement =
    doc.fullscreenElement || doc["webkitFullscreenElement"];
  if (!fullScreenElement) {
    if (element?.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    }
  } else {
    if (doc.exitFullscreen) {
      doc.exitFullscreen();
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
    }
  }
});
const controls = new OrbitControls(camera, canvas!);
controls.enableDamping = true;
const animate = () => {
  // const elapsedTime = clock.getElapsedTime();

  // // mesh.rotation.y = elapsedTime;
  // mesh.position.x = Math.sin(elapsedTime);
  // // mesh.position.y = Math.sin(elapsedTime);
  // mesh.position.z = Math.sin(elapsedTime);
  // camera.position.y = Math.cos(elapsedTime);
  // camera.lookAt(mesh.position);
  // camera.position.x = cursor.x * 5;
  // camera.position.y = cursor.y * 5;
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2;
  // camera.position.y = cursor.y * 3;
  // camera.lookAt(mesh.position);
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
};
animate();

/**
 * 3d text
 */
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  BoxGeometry,
  TextureLoader,
  MeshMatcapMaterial,
  DoubleSide,
  SphereGeometry,
  AxesHelper,
  Group,
  PointLight,
  Fog,
  Clock,
  Vector3,
  Vector2,
  Raycaster,
  SpotLight,
  SpotLightHelper,
} from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { gsap } from "gsap";
import * as DAT from "lil-gui";
import * as CANNON from "cannon-es";
import { getHauntedHouse } from "./hauntedHouse";

const onClick = (event: MouseEvent) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(textGroup.children);
  console.log("intersects", intersects);
  if (intersects.length > 0) {
    const clickedMesh = intersects[0].object;
    if (clickedMesh.name === "text") {
      properties.haunted();
    }
    if (clickedMesh.name === "box") {
      properties.gravity = !properties.gravity;
    }
  }
};
const sizes = {
  width: innerWidth,
  height: innerHeight,
};
const properties = {
  gravity: false,
  haunted: () => {
    const destinationPosition = new Vector3(4, 2, 5);
    // Animate the camera movement
    const duration = 1; // Animation duration in milliseconds
    gsap.to(textGroup.position, {
      duration: duration,
      x: 0,
      y: -100,
      z: 0,
    });
    gsap.to(haunteHouse.position, {
      duration: duration,
      x: 0,
      y: 0,
      z: 0,
    });
    gsap.to(camera.position, {
      duration: duration,
      x: destinationPosition.x,
      y: destinationPosition.y,
      z: destinationPosition.z,
      // onUpdate: () => {
      //   // haunteHouse.rotation.y = Math.PI * 0.5;
      //   // camera.zoom = 1;
      //   // ambientLight.color.set("#b9d5ff");
      //   // ambientLight.intensity = 0.12;
      //   // moonLight.intensity = 0.12;
      //   // moonLight.color.set("#b9d5ff");

      //   const fog = new Fog("#262837", 1, 15);
      //   scene.fog = fog;
      //   haunteHouse.rotation.y = 89.5;

      //   camera.lookAt(haunteHouse.position);
      //   renderer.setClearColor("#262837");
      //   console.log("haunted", camera.rotation, camera.position);
      //   // renderer.render(scene, camera);
      // },
      onComplete: () => {
        const fog = new Fog("#262837", 1, 15);
        scene.fog = fog;
        // haunteHouse.rotation.y = 90;
        camera.lookAt(haunteHouse.position);
        renderer.setClearColor("#262837");
      },
    });
  },
};
// const geometry = new BoxGeometry(1, 1, 1, 10, 20, 10);
// const boxMaterial = new MeshBasicMaterial({ color: 0xff0000 });
// const box = new Mesh(geometry, boxMaterial);
const gui = new DAT.GUI();
const scene = new Scene();
// scene.add(box);
gui.add(properties, "haunted");
//texture
const textureLoader = new TextureLoader();
const matcapTexture = textureLoader.load("../static/matcaps/1.png");
const matcapTexture2 = textureLoader.load("../static/matcaps/8.png");
const matcapTexture3 = textureLoader.load("../static/matcaps/7.png");

/**
 * Fonts
 */
const fontLoader = new FontLoader();
const donutGeometry = new SphereGeometry(1, 0.3, 20, 50, 100);
const boxGeometry = new BoxGeometry(0.5, 0.5, 0.5);
const donutMaterial = new MeshMatcapMaterial({
  matcap: matcapTexture2,
});
const boxMaterial = new MeshMatcapMaterial({ matcap: matcapTexture3 });
// boxMaterial.roughness = 0.4;
const textGroup = new Group();
fontLoader.load("../static/fonts/helvetiker_bold.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Haunted House (Texture,lights)", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 2,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 2,
  });
  const textMaterial = new MeshMatcapMaterial({ matcap: matcapTexture });
  textMaterial.side = DoubleSide;
  textMaterial.flatShading = true;
  const text = new Mesh(textGeometry, textMaterial);
  text.name = "text";
  // scene.add(text);
  for (let i = 0; i < 500; i++) {
    donutMaterial.wireframe = true;
    const donut = new Mesh(donutGeometry, donutMaterial);
    donut.name = "donut";
    const box = new Mesh(boxGeometry, boxMaterial);
    box.name = "box";
    donut.position.x = (Math.random() - 0.5) * 50;
    donut.position.y = (Math.random() - 0.5) * 50;
    donut.position.z = (Math.random() - 0.5) * 50;
    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;
    donut.rotation.z = Math.random() * Math.PI;
    const scale = Math.random();
    donut.scale.set(scale, scale, scale);
    // scene.add(donut);
    box.position.x = (Math.random() - 0.5) * 70;
    box.position.y = (Math.random() - 0.5) * 70;
    box.position.z = (Math.random() - 0.5) * 70;
    //box
    const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    const boxBody = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(box.position.x, box.position.y, box.position.z),
      shape: boxShape,
    });
    // boxBody.name = "boxBody";
    world.addBody(boxBody);

    textGroup.add(box);
    textGroup.add(donut);
    // scene.add(box);
  }

  textGeometry.computeBoundingBox();
  textGeometry.center();
  textGroup.add(text);
});

scene.add(textGroup);
console.log("textGroup", textGroup);
const { haunteHouse } = getHauntedHouse();
scene.add(haunteHouse);
const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.castShadow = true;
camera.position.z = 6;

// const cameraHelper = new CameraHelper(camera1);
// haunteHouse.add(camera1);
// scene.add(camera1);
scene.add(camera);

//cannon
const world = new CANNON.World();
world.gravity.set(0, -1.82, 0);

const raycaster = new Raycaster();
const mouse = new Vector2();

const ghost1 = new PointLight("#ff00ff", 2, 7);
ghost1.castShadow = true;
scene.add(ghost1);

const ghost2 = new PointLight("#00ffff", 2, 3);
ghost2.castShadow = true;
scene.add(ghost2);

const ghost3 = new PointLight("#ffff00", 2, 3);
ghost3.castShadow = true;
scene.add(ghost3);

const canvas = document.getElementById("webgl");
canvas?.addEventListener("click", onClick);
const renderer = new WebGLRenderer({ canvas: canvas! });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
// renderer.setClearColor("#262837");
renderer.render(scene, camera);

window.addEventListener("resize", () => {
  sizes.width = innerWidth;
  sizes.height = innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.max(devicePixelRatio, 2));
});
const controls = new OrbitControls(camera, canvas!);
controls.enableDamping = true;
const clock = new Clock();
let oldElapsedTime = 0;
const animate = () => {
  const elapsedTime = clock.getElapsedTime();
  if (properties.gravity) {
    const deltaTime = elapsedTime - oldElapsedTime;
    world.step(1 / 60, deltaTime, 3);

    textGroup.children.forEach((child, i) => {
      const boxBody = world.bodies[i];
      if (child.name === "box") {
        if (boxBody?.position) {
          child.position.x = boxBody.position.x;
          child.position.y = boxBody.position.y;
          child.position.z = boxBody.position.z;
        }
      }
    });
  }

  // Ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3);

  const ghost2Angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  const ghost3Angle = -elapsedTime * 0.18;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);
  controls.update();
  renderer.render(scene, camera);

  // renderer.render(scene, camera1);
  window.requestAnimationFrame(animate);
};
animate();
gsap.from(camera.position, {
  x: 0,
  y: 0,
  z: 70,
  duration: 3,
});

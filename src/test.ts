/**
 * 3d text
 */
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  MeshBasicMaterial,
  Mesh,
  BoxGeometry,
  TextureLoader,
  MeshMatcapMaterial,
  TorusGeometry,
  DoubleSide,
  SphereGeometry,
  MeshStandardMaterial,
  SpotLight,
  SpotLightHelper,
  AxesHelper,
  DirectionalLight,
  DirectionalLightHelper,
  PlaneGeometry,
  AmbientLight,
  CameraHelper,
  Group,
  ConeGeometry,
  PointLight,
  Fog,
  Clock,
  Vector3,
} from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { gsap } from "gsap";
import * as DAT from "lil-gui";

const sizes = {
  width: innerWidth,
  height: innerHeight,
};
const properties = {
  haunted: () => {
    const destinationPosition = new Vector3(
      100,
      haunteHouse.position.y,
      haunteHouse.position.z
    );
    // destinationPosition.z += 10; // Adjust the offset if needed

    // Animate the camera movement
    const duration = 1; // Animation duration in milliseconds
    // const easingFunction = gs; // Choose an easing function
    const cameraStartPosition = camera.position.clone();

    // new TWEEN.Tween(camera.position)
    //   .to(destinationPosition, duration)
    //   .easing(easingFunction)
    //   .onUpdate(() => {
    //     camera.lookAt(sphere.position);
    //     renderer.render(scene, camera);
    //   })
    //   .start();
    gsap.to(camera.position, {
      duration: duration,
      x: destinationPosition.x,
      y: destinationPosition.y,
      z: destinationPosition.z,
      onUpdate: () => {
        haunteHouse.rotation.y = Math.PI * 0.5;
        camera.zoom = 1;
        camera.lookAt(haunteHouse.position);
        // renderer.render(scene, camera);
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

// fontLoader.load("../static/fonts/helvetiker_bold.typeface.json", (font) => {
//   const textGeometry = new TextGeometry("My POC", {
//     font: font,
//     size: 0.5,
//     height: 0.2,
//     curveSegments: 2,
//     bevelEnabled: true,
//     bevelThickness: 0.03,
//     bevelSize: 0.02,
//     bevelOffset: 0,
//     bevelSegments: 2,
//   });
//   const textMaterial = new MeshMatcapMaterial({ matcap: matcapTexture });
//   textMaterial.side = DoubleSide;
//   textMaterial.flatShading = true;
//   const text = new Mesh(textGeometry, textMaterial);
//   scene.add(text);
//   for (let i = 0; i < 500; i++) {
//     donutMaterial.wireframe = true;
//     const donut = new Mesh(donutGeometry, donutMaterial);
//     const box = new Mesh(boxGeometry, boxMaterial);
//     donut.position.x = (Math.random() - 0.5) * 50;
//     donut.position.y = (Math.random() - 0.5) * 50;
//     donut.position.z = (Math.random() - 0.5) * 50;
//     donut.rotation.x = Math.random() * Math.PI;
//     donut.rotation.y = Math.random() * Math.PI;
//     donut.rotation.z = Math.random() * Math.PI;
//     const scale = Math.random();
//     donut.scale.set(scale, scale, scale);
//     scene.add(donut);
//     box.position.x = (Math.random() - 0.5) * 70;
//     box.position.y = (Math.random() - 0.5) * 70;
//     box.position.z = (Math.random() - 0.5) * 70;
//     // const spotLight = new SpotLight(0xff0000, 1, 10, Math.PI * 0.1, 0.25, 1);
//     // scene.add(spotLight);
//     // const directionalLight = new DirectionalLight(0xff0000, 1);
//     // // directionalLight.position.set(0, 0, 0);
//     // scene.add(directionalLight);
//     // const directionalLightHelper = new DirectionalLightHelper(directionalLight);
//     // scene.add(directionalLightHelper);
//     scene.add(box);
//     const axesHelper = new AxesHelper(box.position.length());
//     scene.add(axesHelper);
//   }
//   // text.position.z = -3;
//   // text.position.x = -1;
//   textGeometry.computeBoundingBox();
//   // textGeometry.translate(
//   //   -(textGeometry.boundingBox!.max.x - 0.02) * 0.5,
//   //   -(textGeometry.boundingBox!.max.y - 0.02) * 0.5,
//   //   -(textGeometry.boundingBox!.max.z - 0.02) * 0.5
//   // );
//   textGeometry.center();
// });

//Haunted House
const haunteHouse = new Group();
const house = new Group();
const bricksColorTexture = textureLoader.load(
  "../static/textures/bricks/color.jpg"
);
const bricksAmbientOcclusionTexture = textureLoader.load(
  "../static/textures/bricks/ambientOcclusion.jpg"
);
const bricksNormalTexture = textureLoader.load(
  "../static/textures/bricks/normal.jpg"
);
const bricksRoughnessTexture = textureLoader.load(
  "../static/textures/bricks/roughness.jpg"
);
const walls = new Mesh(
  new BoxGeometry(4, 2.5, 4),
  new MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  })
);
walls.position.y = 1.25;
house.add(walls);
//Roof
const roof = new Mesh(
  new ConeGeometry(3.5, 1, 4),
  new MeshStandardMaterial({ color: "#b35f45" })
);
roof.rotation.y = Math.PI * 0.25;
roof.position.y = 2.5 + 0.5;
house.add(roof);
//door
const doorColorTexture = textureLoader.load(
  "../static/textures/door/color.jpg"
);
const doorAlphaTexture = textureLoader.load(
  "../static/textures/door/alpha.jpg"
);
const doorAmbientOcclusionTexture = textureLoader.load(
  "../static/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load(
  "../static/textures/door/height.jpg"
);
const doorNormalTexture = textureLoader.load(
  "../static/textures/door/normal.jpg"
);
const doorMetalnessTexture = textureLoader.load(
  "../static/textures/door/metalness.jpg"
);
const doorRoughnessTexture = textureLoader.load(
  "../static/textures/door/roughness.jpg"
);
const door = new Mesh(
  new PlaneGeometry(2.2, 2.2, 100, 100),
  new MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);

// Bushes
const bushGeometry = new SphereGeometry(1, 16, 16);
const bushMaterial = new MeshStandardMaterial({ color: "#89c854" });

const bush1 = new Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);
// Door light
const doorLight = new PointLight("#ff7d46", 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);
// scene.add(house);
// const fog = new Fog("#262837", 1, 15);
// house.add(fog);
// scene.fog = fog;

// Graves
const graves = new Group();
const graveGeometry = new BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new MeshStandardMaterial({ color: "#b2b6b1" });
for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2; // Random angle
  const radius = 3 + Math.random() * 6; // Random radius
  const x = Math.cos(angle) * radius; // Get the x position using cosinus
  const z = Math.sin(angle) * radius; // Get the z position using sinus

  // Create the mesh
  const grave = new Mesh(graveGeometry, graveMaterial);

  // Position
  grave.position.set(x, 0.3, z);

  // Rotation
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;

  // Add to the graves container
  graves.add(grave);
}
haunteHouse.add(graves);
haunteHouse.add(house);

//floor
const floor = new Mesh(
  new PlaneGeometry(20, 20),
  new MeshStandardMaterial({ color: "#a9c388", side: DoubleSide })
);
floor.rotation.x = -Math.PI * 0.5;
// floor.position.y = -100;
// floor.position.z = 20;
haunteHouse.add(floor);
// haunteHouse.position.x = 100;
scene.add(haunteHouse);
/**
 * Lights
 */
// Ambient light
const ambientLight = new AmbientLight("#b9d5ff", 0.12);
// gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
haunteHouse.add(ambientLight);

// Directional light
const moonLight = new DirectionalLight("#b9d5ff", 0.12);
moonLight.position.set(4, 5, -2);
// gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
// gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
// gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
// gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
haunteHouse.add(moonLight);

const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
// const camera1 = new PerspectiveCamera(
//   75,
//   sizes.width / sizes.height,
//   150,
//   1000
// );
// camera1.position.x = 50;
// camera.position.y = -50;
// camera1.position.z = 1;
// camera1.rotation.z = -90;
// camera.rotation.order = "YXZ";
// camera.rotation.y = 270;
// camera.lookAt(haunteHouse.position);
// camera.zoom = 100;
// camera.position.x = 4;
// camera.position.y = 2;
// camera.position.z = 5;

camera.position.z = 3;
// camera.lookAt(haunteHouse.position);
// const cameraHelper = new CameraHelper(camera1);
// haunteHouse.add(camera1);
// scene.add(camera1);
scene.add(camera);
// scene.add(cameraHelper);

// const ghost1 = new PointLight("#ff00ff", 2, 3);
// scene.add(ghost1);

// const ghost2 = new PointLight("#00ffff", 2, 3);
// scene.add(ghost2);

// const ghost3 = new PointLight("#ffff00", 2, 3);
// scene.add(ghost3);

const canvas = document.getElementById("webgl");
const renderer = new WebGLRenderer({ canvas: canvas! });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
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
const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // Ghosts
  // const ghost1Angle = elapsedTime * 0.5;
  // ghost1.position.x = Math.cos(ghost1Angle) * 4;
  // ghost1.position.z = Math.sin(ghost1Angle) * 4;
  // ghost1.position.y = Math.sin(elapsedTime * 3);

  // const ghost2Angle = -elapsedTime * 0.32;
  // ghost2.position.x = Math.cos(ghost2Angle) * 5;
  // ghost2.position.z = Math.sin(ghost2Angle) * 5;
  // ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  // const ghost3Angle = -elapsedTime * 0.18;
  // ghost3.position.x =
  //   Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  // ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  // ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);
  controls.update();
  renderer.render(scene, camera);
  // renderer.render(scene, camera1);
  window.requestAnimationFrame(animate);
};
animate();

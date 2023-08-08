import {
  AmbientLight,
  Clock,
  Color,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshDepthMaterial,
  MeshLambertMaterial,
  MeshMatcapMaterial,
  MeshNormalMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
  MeshToonMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  SphereGeometry,
  TextureLoader,
  TorusGeometry,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

//sizes
const sizes = {
  width: innerWidth,
  height: innerHeight,
};

//scene
const scene = new Scene();

//texture
const textureLoader = new TextureLoader();
// const matcapTexture = textureLoader.load("../static/matcaps/2.png");
// const matcapTexture = textureLoader.load("../static/matcaps/3.png");
// const matcapTexture = textureLoader.load("../static/matcaps/4.png");
// const matcapTexture = textureLoader.load("../static/matcaps/5.png");
// const matcapTexture = textureLoader.load("../static/matcaps/6.png");
// const matcapTexture = textureLoader.load("../static/matcaps/7.png");
// const matcapTexture = textureLoader.load("../static/matcaps/8.png");

// const material = new MeshNormalMaterial();
// const material = new MeshMatcapMaterial();
const material = new MeshStandardMaterial();
material.side = DoubleSide;
// material.wireframe = true;
// material.flatShading = true;
// material.matcap = matcapTexture;
// material.shininess = 100;
// material.specular = new Color(0x1188ff);
material.metalness = 0.7;
material.roughness = 0.2;

// lights;
const ambientLight = new AmbientLight("green", 0.5);
scene.add(ambientLight);

const pointLifht = new PointLight("white", 0.5);
pointLifht.position.x = 1;
pointLifht.position.y = 3;
pointLifht.position.z = 1;

scene.add(pointLifht);

const sphereGeometry = new SphereGeometry(0.5, 16, 16);
const sphere = new Mesh(sphereGeometry, material);
sphere.position.x = -1.5;

const planeGeometry = new PlaneGeometry(1, 1);
const plane = new Mesh(planeGeometry, material);

const torusGeometry = new TorusGeometry(0.3, 0.3, 16, 16);
const torus = new Mesh(torusGeometry, material);
torus.position.x = 1.5;

scene.add(sphere, plane, torus);

const camera = new PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

const canvas = document.getElementById("webgl");
const renderer = new WebGLRenderer({ canvas: canvas! });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.max(devicePixelRatio, 2));

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

//clock
const clock = new Clock();
const animate = () => {
  const elapsedTime = clock.getElapsedTime();
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;
  controls.update();
  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();

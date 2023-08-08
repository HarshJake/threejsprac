//@ts-ignore
//@ts-nocheck
import {
  CustomLayerInterface,
  LngLat,
  Map,
  MercatorCoordinate,
} from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  AxesHelper,
  Camera,
  CameraHelper,
  DirectionalLight,
  DirectionalLightHelper,
  Matrix4,
  PerspectiveCamera,
  Scene,
  SpotLight,
  SpotLightHelper,
  Vector3,
  WebGLRenderer,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as DAT from "lil-gui";

const properties = {
  color: 0xff0000,
};

const process = import.meta.env;
const map = new Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  zoom: 18,
  center: [148.9819, -35.3981],
  antialias: true,
  accessToken: process.VITE_APP_MAPBOX_TOKEN as string,
  pitch: 60,
  bearing: 172,
});

const modelOrigin = [148.9819, -35.39847];
const modelAltitude = 0;
const modelRotate = [Math.PI / 2, 0, 0];

const modelAsMercatorCoordinate = MercatorCoordinate.fromLngLat(
  modelOrigin,
  modelAltitude
);

console.log(modelAsMercatorCoordinate);

const modelTransform = {
  translateX: modelAsMercatorCoordinate.x,
  translateY: modelAsMercatorCoordinate.y,
  translateZ: modelAsMercatorCoordinate.z,
  rotateX: modelRotate[0],
  rotateY: modelRotate[1],
  rotateZ: modelRotate[2],
  /* Since the 3D model is in real world meters, a scale transform needs to be
   * applied since the CustomLayerInterface expects units in MercatorCoordinates.
   */
  scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
};

const customLayer: CustomLayerInterface = {
  id: "3d-on-map",
  type: "custom",
  renderingMode: "3d",
  onAdd: (map, gl) => {
    console.log(gl);
    window.camera = new PerspectiveCamera(75, 1, 2, 200);
    camera.castShadow = true;

    // window.camera.position.set(70, 70, 3);
    window.scene = new Scene();
    const cameraHelper = new CameraHelper(camera);
    cameraHelper.castShadow = true;
    cameraHelper.visible = true;
    cameraHelper.position.set(70, 70, 70);
    window.gui = new DAT.GUI();
    window.scene.add(camera);
    window.scene.add(cameraHelper);
    // window.gui.add(spotLight, "intensity", 0, 10, 0.1);
    // create two three.js lights to illuminate the model
    // const directionalLight = new DirectionalLight(0xff0000);
    // directionalLight.castShadow = true;
    // directionalLight.shadow.mapSize.width = 1024;
    // directionalLight.shadow.mapSize.height = 1024;
    // directionalLight.position.set(0, -70, 100).normalize();

    // window.scene.add(directionalLight);
    // const directionHelper1 = new DirectionalLightHelper(
    //   directionalLight,
    //   50,
    //   "red"
    // );
    // window.scene.add(directionHelper1);
    const spotLight = new SpotLight(0xff0000, 3);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.angle = 0.3;
    spotLight.distance = 0;
    spotLight.penumbra = 0.5;
    spotLight.shadow.focus = 1;
    spotLight.position.set(0, 70, 50);
    window.scene.add(spotLight);
    window.gui.add(spotLight, "intensity", 0, 10, 0.1);
    window.gui.add(spotLight, "angle", 0, 1, 0.1);
    window.gui.add(spotLight, "penumbra", 0, 1, 0.1);
    window.gui.add(spotLight, "distance", 0, 200, 0.1);
    window.gui.add(spotLight.shadow, "focus", 0, 1, 0.1);
    window.spotlightHelper = new SpotLightHelper(spotLight, 100, "green");
    window.scene.add(window.spotlightHelper);
    window.gui.addColor(properties, "color").onChange(() => {
      spotLight.color.set(properties.color);
    });

    const directionalLight2 = new DirectionalLight();
    directionalLight2.castShadow = true;
    directionalLight2.shadow.mapSize.width = 1024;
    directionalLight2.shadow.mapSize.height = 1024;
    directionalLight2.shadow.camera.visible = true;
    directionalLight2.shadow.camera.near = 0.5;
    directionalLight2.shadow.camera.far = 500;
    directionalLight2.shadow.camera.left =
      directionalLight2.shadow.camera.bottom = -1000;
    directionalLight2.shadow.camera.right =
      directionalLight2.shadow.camera.top = 1000;

    directionalLight2.position.set(200, 70, -100);
    window.scene.add(directionalLight2);
    const directionHelper = new DirectionalLightHelper(
      directionalLight2,
      50,
      "red"
    );
    window.gui.add(directionHelper, "visible").name("directionalLight");
    window.gui.add(window.spotlightHelper, "visible").name("spotLight");
    window.gui.add(cameraHelper, "visible").name("camera");
    const helper = new AxesHelper(1000);
    window.scene.add(helper);
    window.scene.add(directionHelper);
    const loader = new GLTFLoader();
    loader.load(
      "https://docs.mapbox.com/mapbox-gl-js/assets/34M_17/34M_17.gltf",
      (gltf) => {
        gltf.scene.traverse((child) => {
          if ((child as any).isMesh) {
            (child as any).castShadow = true;
            (child as any).receiveShadow = true;
          }
        });
        window.scene.add(gltf.scene);
      }
    );
    loader.load(
      "https://docs.mapbox.com/mapbox-gl-js/assets/metlife-building.gltf",
      (gltf) => {
        const model1 = gltf.scene;
        gltf.scene.traverse((child) => {
          if ((child as any).isMesh) {
            (child as any).castShadow = true;
            (child as any).receiveShadow = true;
          }
        });
        window.scene.add(model1);
        model1.translateX(modelTransform.translateX + 100);
      }
    );
    window.map = map;

    // use the Mapbox GL JS map canvas for three.js
    window.renderer = new WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: true,
    });
    // Window.renderer.setPixelRatio(window.devicePixelRatio);
    window.renderer.autoClear = false;
  },
  render: (gl, matrix) => {
    // console.log(matrix);
    const rotationX = new Matrix4().makeRotationAxis(
      new Vector3(1, 0, 0),
      modelTransform.rotateX
    );
    const rotationY = new Matrix4().makeRotationAxis(
      new Vector3(0, 1, 0),
      modelTransform.rotateY
    );
    const rotationZ = new Matrix4().makeRotationAxis(
      new Vector3(0, 0),
      modelTransform.rotateZ
    );
    const m = new Matrix4().fromArray(matrix);
    const l = new Matrix4()
      .makeTranslation(
        modelTransform.translateX,
        modelTransform.translateY,
        modelTransform.translateZ!
      )
      .scale(
        new Vector3(
          modelTransform.scale,
          -modelTransform.scale,
          modelTransform.scale
        )
      )
      .multiply(rotationX)
      .multiply(rotationY)
      .multiply(rotationZ);

    window.camera.projectionMatrix = m.multiply(l);
    // window.camera.position.set(172, 70, 100);
    window.renderer.resetState();
    window.spotlightHelper.update();
    window.renderer.shadowMap.enabled = true;
    window.renderer.render(window.scene, window.camera);
    window.map.triggerRepaint();
  },
};
map.on("style.load", () => {
  map.addLayer(customLayer, "waterway-label");
});

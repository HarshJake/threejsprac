import {
  Mesh,
  BoxGeometry,
  DoubleSide,
  SphereGeometry,
  MeshStandardMaterial,
  DirectionalLight,
  PlaneGeometry,
  AmbientLight,
  Group,
  ConeGeometry,
  PointLight,
  TextureLoader,
  RepeatWrapping,
} from "three";

export const getHauntedHouse = () => {
  //Haunted House
  const haunteHouse = new Group();
  const house = new Group();
  const textureLoader = new TextureLoader();
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
  walls.castShadow = true;
  house.add(walls);
  //Roof
  const roof = new Mesh(
    new ConeGeometry(3.5, 1, 4),
    new MeshStandardMaterial({ color: "#b35f45" })
  );
  roof.castShadow = true;
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
  door.castShadow = true;
  door.position.y = 1;
  door.position.z = 2 + 0.01;
  house.add(door);

  // Bushes
  const bushGeometry = new SphereGeometry(1, 16, 16);
  const bushMaterial = new MeshStandardMaterial({ color: "#89c854" });

  const bush1 = new Mesh(bushGeometry, bushMaterial);
  bush1.castShadow = true;
  bush1.scale.set(0.5, 0.5, 0.5);
  bush1.position.set(0.8, 0.2, 2.2);

  const bush2 = new Mesh(bushGeometry, bushMaterial);
  bush2.castShadow = true;
  bush2.scale.set(0.25, 0.25, 0.25);
  bush2.position.set(1.4, 0.1, 2.1);

  const bush3 = new Mesh(bushGeometry, bushMaterial);
  bush3.castShadow = true;
  bush3.scale.set(0.4, 0.4, 0.4);
  bush3.position.set(-0.8, 0.1, 2.2);

  const bush4 = new Mesh(bushGeometry, bushMaterial);
  bush4.castShadow = true;
  bush4.scale.set(0.15, 0.15, 0.15);
  bush4.position.set(-1, 0.05, 2.6);

  house.add(bush1, bush2, bush3, bush4);
  // Door light
  const doorLight = new PointLight("#ff7d46", 1, 7);
  doorLight.position.set(0, 2.2, 2.7);
  house.add(doorLight);

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
    grave.castShadow = true;
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

  const grassColorTexture = textureLoader.load(
    "../static/textures/grass/color.jpg"
  );
  const grassAmbientOcclusionTexture = textureLoader.load(
    "../static/textures/grass/ambientOcclusion.jpg"
  );
  const grassNormalTexture = textureLoader.load(
    "../static/textures/grass/normal.jpg"
  );
  const grassRoughnessTexture = textureLoader.load(
    "../static/textures/grass/roughness.jpg"
  );

  const floor = new Mesh(
    new PlaneGeometry(20, 20),
    new MeshStandardMaterial({
      color: "#a9c388",
      side: DoubleSide,
      map: grassColorTexture,
      aoMap: grassAmbientOcclusionTexture,
      normalMap: grassNormalTexture,
      roughnessMap: grassRoughnessTexture,
    })
  );
  floor.rotation.x = -Math.PI * 0.5;
  grassColorTexture.repeat.set(8, 8);
  grassAmbientOcclusionTexture.repeat.set(8, 8);
  grassNormalTexture.repeat.set(8, 8);
  grassRoughnessTexture.repeat.set(8, 8);

  grassColorTexture.wrapS = RepeatWrapping;
  grassAmbientOcclusionTexture.wrapS = RepeatWrapping;
  grassNormalTexture.wrapS = RepeatWrapping;
  grassRoughnessTexture.wrapS = RepeatWrapping;

  grassColorTexture.wrapT = RepeatWrapping;
  grassAmbientOcclusionTexture.wrapT = RepeatWrapping;
  grassNormalTexture.wrapT = RepeatWrapping;
  grassRoughnessTexture.wrapT = RepeatWrapping;
  haunteHouse.add(floor);
  haunteHouse.position.y = -100;

  /**
   * Lights
   */
  // Ambient light
  const ambientLight = new AmbientLight("#b9d5ff", 0.12);
  ambientLight.name = "ambientLight";
  // gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
  haunteHouse.add(ambientLight);

  // Directional light
  const moonLight = new DirectionalLight("#b9d5ff", 0.12);
  moonLight.name = "moonLight";
  moonLight.position.set(4, 5, -2);
  // gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
  // gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
  // gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
  // gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
  haunteHouse.add(moonLight);

  return { haunteHouse, ambientLight, moonLight };
};

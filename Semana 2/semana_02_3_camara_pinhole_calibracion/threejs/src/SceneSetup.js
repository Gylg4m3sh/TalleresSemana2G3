// src/SceneSetup.js
// =================
// Configura la escena 3D con objetos conocidos, iluminación y renderer.
//
// MEJORA — Marcadores anclados (vs Vector3 estáticos):
//   Los marcadores se añaden como hijos de cada objeto con parent.add(marker).
//   Esto significa que heredan la transformación del padre automáticamente.
//   Cuando el cubo rota, el marcador en su tope rota con él.
//   marker.getWorldPosition() en ProjectionOverlay siempre devuelve
//   la posición correcta en world-space, sin importar la animación.
//
//   Vector3 estático → posición fija en el mundo (incorrecta si el objeto anima)
//   Marcador hijo     → posición se actualiza automáticamente con el padre ✓

import * as THREE from 'three';

export function createScene() {

  // ── Escena ────────────────────────────────────────────────
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070710);
  scene.fog = new THREE.FogExp2(0x070710, 0.018);

  // ── Iluminación ──────────────────────────────────────────
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.position.set(10, 18, 12);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width  = 2048;
  dirLight.shadow.mapSize.height = 2048;
  scene.add(dirLight);

  const pointLight = new THREE.PointLight(0x0066ff, 3, 25);
  pointLight.position.set(-6, 8, 4);
  scene.add(pointLight);

  const rimLight = new THREE.PointLight(0xff4400, 1.5, 20);
  rimLight.position.set(8, 2, -8);
  scene.add(rimLight);

  // ── Grid de referencia ───────────────────────────────────
  const grid = new THREE.GridHelper(50, 50, 0x1a1a3a, 0x111128);
  scene.add(grid);

  // ── Objetos 3D conocidos ─────────────────────────────────
  const objects = new THREE.Group();

  // Array de marcadores — se llena con addMarker()
  // Cada elemento es un Mesh hijo de su objeto padre.
  // getWorldPosition() en el overlay obtiene la posición real animada.
  const referenceMarkers = [];

  /**
   * Crea un marcador esférico amarillo y lo añade como hijo de `parent`.
   * La posición (x, y, z) es LOCAL relativa al padre.
   * Cuando el padre se mueve/rota/escala, el marcador lo sigue.
   *
   * @param {THREE.Object3D} parent  - objeto padre (mesh, group o scene)
   * @param {number} x, y, z         - posición local relativa al padre
   * @param {string} name            - nombre descriptivo para debug
   */
  function addMarker(parent, x, y, z, name) {
    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.10, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffff00 })
    );
    marker.position.set(x, y, z);
    marker.name = name;
    parent.add(marker);           // hijo del padre → hereda su transformación
    referenceMarkers.push(marker);
  }

  // ── Cubo central — azul ──────────────────────────────────
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshPhongMaterial({ color: 0x1155ff, shininess: 90 })
  );
  box.position.set(0, 1, 0);
  box.castShadow = true;
  box.name = 'cube';
  objects.add(box);

  // Marcadores en posición LOCAL del cubo (cubo centrado en su origen)
  addMarker(box,  0,  1,  0, 'ref_cube_top');      // tope  → rota con el cubo
  addMarker(box,  1, -1,  1, 'ref_cube_fwd');      // esquina delantera
  addMarker(box, -1, -1, -1, 'ref_cube_bck');      // esquina trasera

  // ── Esfera izquierda — naranja ───────────────────────────
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.1, 32, 32),
    new THREE.MeshPhongMaterial({ color: 0xff5500, shininess: 110 })
  );
  sphere.position.set(-5.5, 1.1, -2);
  sphere.castShadow = true;
  sphere.name = 'sphere';
  objects.add(sphere);

  // La esfera sube y baja (animada en main.js).
  // El marcador en (0, 1.1, 0) local siempre queda en su tope
  // porque está anclado — el bounce se refleja automáticamente.
  addMarker(sphere, 0, 1.1, 0, 'ref_sphere_top');

  // ── Cilindro derecho — verde ─────────────────────────────
  const cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.8, 3.5, 32),
    new THREE.MeshPhongMaterial({ color: 0x00cc55, shininess: 70 })
  );
  cylinder.position.set(5.5, 1.75, -1.5);
  cylinder.castShadow = true;
  cylinder.name = 'cylinder';
  objects.add(cylinder);

  addMarker(cylinder, 0, 1.75, 0, 'ref_cyl_top');   // tope del cilindro

  // ── Toro al fondo — amarillo ─────────────────────────────
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(1.3, 0.45, 16, 64),
    new THREE.MeshPhongMaterial({ color: 0xffcc00, shininess: 100 })
  );
  torus.position.set(0, 1.8, -9);
  torus.rotation.x = Math.PI / 2;
  torus.name = 'torus';
  objects.add(torus);

  // El toro rota en Z (main.js). El marcador en el centro
  // se mueve con esa rotación porque es hijo.
  addMarker(torus, 0, 0, 0, 'ref_torus_center');

  // ── Icosaedro — magenta ──────────────────────────────────
  const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.MeshPhongMaterial({ color: 0xff00aa, shininess: 80, flatShading: true })
  );
  ico.position.set(-3, 1, -6);
  ico.name = 'icosahedron';
  objects.add(ico);

  // El icosaedro rota en X e Y. El marcador en su tope
  // orbita con él, mostrando la proyección del punto real animado.
  addMarker(ico, 0, 1, 0, 'ref_ico_top');

  scene.add(objects);

  // ── Marcadores estáticos en el suelo ─────────────────────
  // Anclados directamente a la scene (no a ningún objeto móvil).
  // Su posición world es fija — equivalen a los Vector3 originales.
  addMarker(scene,  3, 0,  4, 'ref_floor_R');
  addMarker(scene, -4, 0,  3, 'ref_floor_L');

  // ── Renderer ──────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  // referenceMarkers reemplaza a referencePoints3D.
  // La diferencia clave: son Mesh vivos, no Vector3 muertos.
  return { scene, renderer, objects, referenceMarkers };
}
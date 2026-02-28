// main.js
// =======
// Punto de entrada principal del proyecto Three.js.
// Conecta todos los módulos y controla el loop de animación.

import * as THREE from 'three';
import GUI from 'lil-gui';

import { createScene }             from './src/SceneSetup.js';
import { createCameraRig }         from './src/CameraRig.js';
import { createFrustumHelper }     from './src/FrustumHelper.js';
import { createProjectionOverlay } from './src/ProjectionOverlay.js';
import { createDistortionPass }    from './src/DistortionPass.js';

// ── Inicializar módulos ───────────────────────────────────────
const { scene, renderer, objects, referenceMarkers } = createScene();
const { camera, controls, getFocalLengthPx }         = createCameraRig(renderer);
const frustumHelper                                  = createFrustumHelper(scene, renderer);
const { updateOverlay }                              = createProjectionOverlay(referenceMarkers);
const distortionPass                                 = createDistortionPass(renderer);

// ── Elementos del panel de info ───────────────────────────────
const valFov   = document.getElementById('val-fov');
const valFocal = document.getElementById('val-focal');
const valNear  = document.getElementById('val-near');
const valFar   = document.getElementById('val-far');
const valDist  = document.getElementById('val-dist');

// ── Estado de parámetros ──────────────────────────────────────
const params = {
  // Intrínsecos
  fov:       75,
  nearPlane: 0.1,
  farPlane:  100,

  // Extrínsecos (posición manual de la cámara)
  camX: 9,
  camY: 7,
  camZ: 14,

  // Distorsión
  distortionOn: false,
  k1: 0.0,
  k2: 0.0,

  // Visualización
  showFrustum:    true,
  animateFrustum: true,
  frustumCulling: false,
  showOverlay:    true,
  animateObjects: true,
  wireframe:      false,
};

// ── Panel GUI ─────────────────────────────────────────────────
const gui = new GUI({ title: 'Parametros de Camara', width: 280 });

// Grupo: Intrínsecos
const intrFolder = gui.addFolder('Intrinsicos — Matriz K');

intrFolder.add(params, 'fov', 10, 150, 1)
  .name('FOV (grados)')
  .onChange(v => {
    camera.fov = v;
    camera.updateProjectionMatrix();
    // NO llamar frustumHelper.updateFrustum() aquí:
    // este FOV es de la cámara principal del renderer, no de la cámara virtual del helper.
    // Mezclarlos hacía que el frustum visual se distorsionara o colapsara al mover el slider.
    valFov.textContent   = v;
    valFocal.textContent = Math.round(getFocalLengthPx());
  });

intrFolder.add(params, 'nearPlane', 0.01, 10, 0.01)
  .name('Near plane')
  .onChange(v => {
    camera.near = v;
    camera.updateProjectionMatrix();
    valNear.textContent = v.toFixed(2);
  });

intrFolder.add(params, 'farPlane', 10, 300, 1)
  .name('Far plane')
  .onChange(v => {
    camera.far = v;
    camera.updateProjectionMatrix();
    valFar.textContent = v;
  });

intrFolder.open();

// Grupo: Extrínsecos
const extrFolder = gui.addFolder('Extrinsicos — R y t');

extrFolder.add(params, 'camX', -25, 25, 0.1)
  .name('Posicion X')
  .listen()
  .onChange(v => { camera.position.x = v; });

extrFolder.add(params, 'camY', 0, 35, 0.1)
  .name('Posicion Y')
  .listen()
  .onChange(v => { camera.position.y = v; });

extrFolder.add(params, 'camZ', -25, 35, 0.1)
  .name('Posicion Z')
  .listen()
  .onChange(v => { camera.position.z = v; });

// Grupo: Distorsión
const distFolder = gui.addFolder('Distorsion de Lente');

distFolder.add(params, 'distortionOn')
  .name('Activar distorsion')
  .onChange(v => {
    valDist.textContent = v ? 'ON' : 'OFF';
    distortionPass.setDistortion(
      v ? params.k1 : 0,
      v ? params.k2 : 0
    );
  });

distFolder.add(params, 'k1', -1.2, 1.2, 0.01)
  .name('k1  (barrel / pincushion)')
  .onChange(v => {
    if (params.distortionOn) distortionPass.setDistortion(v, params.k2);
  });

distFolder.add(params, 'k2', -0.5, 0.5, 0.01)
  .name('k2  (radial 2do orden)')
  .onChange(v => {
    if (params.distortionOn) distortionPass.setDistortion(params.k1, v);
  });

// Grupo: Cámara virtual del frustum (separado de los intrínsecos de la cámara principal)
const frustumCamFolder = gui.addFolder('Camara Virtual — Frustum');
params.frustumFov  = 60;
params.frustumNear = 1.5;
params.frustumFar  = 18;

frustumCamFolder.add(params, 'frustumFov', 10, 120, 1)
  .name('FOV camara virtual')
  .onChange(v => frustumHelper.updateFrustum(v, params.frustumNear, params.frustumFar));

frustumCamFolder.add(params, 'frustumNear', 0.1, 10, 0.1)
  .name('Near (virtual)')
  .onChange(v => frustumHelper.updateFrustum(params.frustumFov, v, params.frustumFar));

frustumCamFolder.add(params, 'frustumFar', 5, 60, 1)
  .name('Far (virtual)')
  .onChange(v => frustumHelper.updateFrustum(params.frustumFov, params.frustumNear, v));

// Grupo: Visualización
const visFolder = gui.addFolder('Visualizacion');

visFolder.add(params, 'showFrustum')
  .name('Mostrar frustum')
  .onChange(v => frustumHelper.setVisible(v));

visFolder.add(params, 'animateFrustum').name('Animar frustum');

visFolder.add(params, 'frustumCulling')
  .name('Frustum Clipping (cortar exterior)')
  .onChange(v => {
    frustumHelper.setCulling(v);
  });

visFolder.add(params, 'showOverlay')
  .name('Overlay proyeccion 2D')
  .onChange(v => {
    document.getElementById('overlay').style.display = v ? 'block' : 'none';
  });

visFolder.add(params, 'animateObjects').name('Animar objetos');

visFolder.add(params, 'wireframe')
  .name('Wireframe')
  .onChange(v => {
    objects.traverse(child => {
      if (child.isMesh) child.material.wireframe = v;
    });
  });

visFolder.open();

// ── Clock ─────────────────────────────────────────────────────
const clock = new THREE.Clock();

// ── Loop de animación ─────────────────────────────────────────
function animate() {
  requestAnimationFrame(animate);

  const elapsed = clock.getElapsedTime();

  // Animar objetos de la escena
  if (params.animateObjects) {
    const cube = objects.getObjectByName('cube');
    const sph  = objects.getObjectByName('sphere');
    const tor  = objects.getObjectByName('torus');
    const ico  = objects.getObjectByName('icosahedron');

    if (cube) cube.rotation.y = elapsed * 0.45;
    if (sph)  sph.position.y  = 1.1 + Math.sin(elapsed * 0.9) * 0.6;
    if (tor)  tor.rotation.z  = elapsed * 0.3;
    if (ico)  { ico.rotation.x = elapsed * 0.4; ico.rotation.y = elapsed * 0.25; }
  }

  // Animar frustum de la cámara virtual (solo si está activo)
  if (params.animateFrustum && params.showFrustum) {
    frustumHelper.animateFrustum(elapsed);
  }

  // FIX PRINCIPAL: syncHelper() en CADA frame cuando el frustum es visible.
  // Antes: helper.update() solo ocurría dentro de animateFrustum(), por lo que
  // al pausar la animación o mover la cámara principal con OrbitControls, el
  // CameraHelper dejaba de dibujarse correctamente (se "perdía" en pantalla).
  // Three.js CameraHelper necesita .update() en cada frame para recalcular
  // su proyección en el espacio de la cámara activa del renderer.
  if (params.showFrustum) {
    frustumHelper.syncHelper();
  }

  // Frustum clipping: la GPU corta los fragmentos fuera del cono de la cámara virtual.
  // Usa renderer.clippingPlanes con los 6 planos reales del frustum — no bounding spheres.
  // El corte es pixel-perfect: los objetos se ven partidos exactamente en el plano.
  if (params.frustumCulling) {
    frustumHelper.applyFrustumCulling();
  }

  // Actualizar OrbitControls
  controls.update();

  // Sincronizar sliders GUI con la posición real de la cámara
  params.camX = camera.position.x;
  params.camY = camera.position.y;
  params.camZ = camera.position.z;

  // Renderizar con o sin distorsión
  if (params.distortionOn) {
    distortionPass.render(scene, camera);
  } else {
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
  }

  // Actualizar overlay de proyección 2D
  if (params.showOverlay) {
    updateOverlay(camera);
  }

  // Actualizar panel de info
  valFocal.textContent = Math.round(getFocalLengthPx());
}

// ── Inicializar valores del panel ─────────────────────────────
valFov.textContent   = params.fov;
valFocal.textContent = Math.round(getFocalLengthPx());
valNear.textContent  = params.nearPlane;
valFar.textContent   = params.farPlane;
valDist.textContent  = 'OFF';

animate();
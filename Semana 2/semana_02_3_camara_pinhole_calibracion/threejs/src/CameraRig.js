// src/CameraRig.js
// ================
// Crea la PerspectiveCamera principal con parámetros configurables
// y los OrbitControls para navegar la escena con el mouse.
//
// Concepto clave:
//   FOV (Field of View) en Three.js es el ángulo vertical del frustum.
//   Se relaciona con la focal length de OpenCV así:
//
//     f_px = (height / 2) / tan(FOV_rad / 2)
//
//   Reducir el FOV = aumentar la focal = más zoom (imagen más grande)
//   Aumentar el FOV = reducir la focal = gran angular (imagen más pequeña)
//
// CORRECCIÓN:
//   getFocalLengthPx usa renderer.getSize() en lugar de window.innerHeight
//   para coincidir con la resolución real del canvas en todos los casos.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function createCameraRig(renderer) {

  const size = new THREE.Vector2();

  // ── Cámara principal ──────────────────────────────────────
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    200
  );
  camera.position.set(9, 7, 14);
  camera.lookAt(0, 0, 0);

  // ── OrbitControls ─────────────────────────────────────────
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping  = true;
  controls.dampingFactor  = 0.06;
  controls.minDistance    = 1.5;
  controls.maxDistance    = 70;
  controls.target.set(0, 1, 0);

  // ── Calcular focal length equivalente en píxeles ──────────
  function getFocalLengthPx() {
    renderer.getSize(size);
    const fovRad = THREE.MathUtils.degToRad(camera.fov);
    return (size.y / 2) / Math.tan(fovRad / 2);
  }

  // ── Resize handler ────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return { camera, controls, getFocalLengthPx };
}
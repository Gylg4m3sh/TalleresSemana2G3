// src/FrustumHelper.js
// ====================
// Visualiza el frustum (cono de visión) de una cámara secundaria
// y aplica frustum clipping preciso: solo se renderiza la parte de cada
// objeto que está DENTRO del cono — no el objeto entero ni nada.
//
// TÉCNICA — Clipping Planes vs Bounding Sphere Culling:
//
//   Versión anterior (bounding sphere culling):
//     frustum.intersectsObject(mesh) → si cualquier parte toca el frustum,
//     el objeto entero se dibuja. Un cubo a medio entrar se ve completo.
//
//   Esta versión (clipping planes reales):
//     renderer.clippingPlanes = [p0, p1, p2, p3, p4, p5]
//     La GPU descarta fragmentos fuera de los 6 planos, pixel a pixel.
//     Un cubo a medio entrar se ve partido exactamente por el plano del frustum.
//
//   Cómo se extraen los planos:
//     THREE.Frustum.setFromProjectionMatrix(P × V) rellena internamente
//     6 objetos THREE.Plane en world-space. Se pasan directamente al renderer.
//
//   Importante — localClippingEnabled:
//     renderer.localClippingEnabled = true  es obligatorio para que los
//     clipping planes globales afecten a materiales con localClipping.
//     Para clipping global (renderer.clippingPlanes) no hace falta, pero
//     se activa de todas formas para compatibilidad con futuros materiales.

import * as THREE from 'three';

export function createFrustumHelper(scene, renderer) {

  // ── Cámara virtual (la que visualizamos, no la que renderiza) ─
  const virtualCam = new THREE.PerspectiveCamera(60, 16 / 9, 1.5, 18);
  virtualCam.position.set(-4, 3, 9);
  virtualCam.lookAt(0, 1, 0);
  virtualCam.updateProjectionMatrix();
  virtualCam.updateMatrixWorld();

  // ── CameraHelper: dibuja el frustum de virtualCam ────────
  const helper = new THREE.CameraHelper(virtualCam);
  helper.name  = 'frustumHelper';
  scene.add(helper);

  // ── Pequeño cono que marca la posición de la cámara virtual ─
  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.25, 0.7, 8),
    new THREE.MeshBasicMaterial({ color: 0x00ffee, wireframe: true })
  );
  cone.name = 'frustumCone';
  scene.add(cone);

  cone.position.copy(virtualCam.position);
  cone.lookAt(0, 1, 0);
  cone.rotateX(Math.PI / 2);

  // ── Frustum y matriz para extraer los 6 planos ───────────
  const frustum       = new THREE.Frustum();
  const frustumMatrix = new THREE.Matrix4();

  // Los 6 planos del frustum que se pasan al renderer.
  // Se reutilizan los objetos THREE.Plane del frustum para evitar allocations.
  let cullingActive = false;

  // ── Control de visibilidad del helper ────────────────────
  function setVisible(v) {
    helper.visible = v;
    cone.visible   = v;
  }

  // ── Activar / desactivar el clipping ─────────────────────
  function setCulling(active) {
    cullingActive = active;

    if (!active) {
      // Desactivar: limpiar los clipping planes del renderer
      renderer.clippingPlanes = [];
    }
  }

  // ── Actualizar parámetros de la cámara virtual ───────────
  function updateFrustum(fov, near, far) {
    virtualCam.fov  = fov;
    virtualCam.near = near;
    virtualCam.far  = far;
    virtualCam.updateProjectionMatrix();
    virtualCam.updateMatrixWorld();
    helper.update();
  }

  // ── Aplicar clipping planes del frustum al renderer ──────
  //
  // En cada frame:
  //   1. Calcular P × V de la cámara virtual → extraer 6 planos en world-space
  //   2. Asignar renderer.clippingPlanes con esos 6 planos
  //   3. La GPU descarta automáticamente todo fragmento fuera de cualquier plano
  //
  // Resultado: los objetos se cortan visualmente con precisión geométrica
  // exactamente donde el plano del frustum los intersecta.
  function applyFrustumCulling() {
    if (!cullingActive) return;

    virtualCam.updateMatrixWorld();

    // P × V → extraer los 6 planos en world-space
    frustumMatrix.multiplyMatrices(
      virtualCam.projectionMatrix,
      virtualCam.matrixWorldInverse
    );
    frustum.setFromProjectionMatrix(frustumMatrix);

    // Pasar los 6 planos directamente al renderer.
    // THREE.Frustum.planes es un array de 6 THREE.Plane ya en world-space.
    renderer.clippingPlanes = frustum.planes;
  }

  // ── Animar: la cámara virtual orbita lentamente ──────────
  function animateFrustum(elapsed) {
    const radius = 10;
    const angle  = elapsed * 0.28;

    virtualCam.position.x = Math.cos(angle) * radius;
    virtualCam.position.z = Math.sin(angle) * radius;
    virtualCam.position.y = 3 + Math.sin(elapsed * 0.4) * 1.5;
    virtualCam.lookAt(0, 1, 0);
    virtualCam.updateMatrixWorld();

    cone.position.copy(virtualCam.position);
    cone.lookAt(0, 1, 0);
    cone.rotateX(Math.PI / 2);
  }

  // ── syncHelper: llamar en cada frame para que el CameraHelper
  // recalcule su proyección en pantalla (necesario aunque no anime)
  function syncHelper() {
    helper.update();
  }

  return {
    virtualCam,
    helper,
    setVisible,
    setCulling,
    updateFrustum,
    applyFrustumCulling,
    animateFrustum,
    syncHelper,
  };
}
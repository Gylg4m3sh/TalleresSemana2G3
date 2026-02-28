// src/DistortionPass.js
// =====================
// Simula distorsión radial de lente usando un shader GLSL personalizado.
//
// Modelo implementado (equivalente al de OpenCV):
//   r² = x² + y²
//   factor = 1 + k1·r² + k2·r⁴
//   (x_d, y_d) = (x, y) · factor
//
// CORRECCIONES respecto a la versión anterior:
//
//   1. RenderTarget creado con renderer.getSize() en lugar de window.innerWidth/Height
//      → En entornos donde el canvas no ocupa toda la ventana, window.* puede diferir.
//      Usar getSize() garantiza coherencia con el renderer real.
//
//   2. El pixelRatio se aplica SOLO al RenderTarget, NO a la cámara ortográfica.
//      La OrthographicCamera de post-proceso cubre el NDC [-1,1] y no necesita
//      escalar con pixelRatio — ese escalado lo gestiona el renderer internamente.
//
//   3. El uniform `aspect` se actualiza tanto en el constructor como en resize,
//      usando siempre la relación real del canvas del renderer (no window.*).

import * as THREE from 'three';

// ── Vertex Shader ─────────────────────────────────────────────
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// ── Fragment Shader ───────────────────────────────────────────
const fragmentShader = `
  uniform sampler2D tDiffuse;
  uniform float k1;
  uniform float k2;
  uniform float strength;
  uniform float aspect;

  varying vec2 vUv;

  void main() {
    vec2 c = vUv - 0.5;

    // Corregir aspect ratio para que r² mida distancia real (no UV deformada)
    c.x *= aspect;

    float r2     = dot(c, c);
    float factor = 1.0 + (k1 * r2 + k2 * r2 * r2) * strength;

    vec2 uv_dist  = c * factor;
    uv_dist.x    /= aspect;
    uv_dist      += 0.5;

    if (uv_dist.x < 0.0 || uv_dist.x > 1.0 ||
        uv_dist.y < 0.0 || uv_dist.y > 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    } else {
      gl_FragColor = texture2D(tDiffuse, uv_dist);
    }
  }
`;

export function createDistortionPass(renderer) {

  const pixelRatio = renderer.getPixelRatio();

  // FIX: usar getSize() para coincidir exactamente con el tamaño del renderer
  const size = new THREE.Vector2();
  renderer.getSize(size);

  const rt = new THREE.WebGLRenderTarget(
    size.x * pixelRatio,
    size.y * pixelRatio
  );

  const quadGeo = new THREE.PlaneGeometry(2, 2);
  const quadMat = new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse: { value: rt.texture },
      k1:       { value: 0.0 },
      k2:       { value: 0.0 },
      strength: { value: 1.0 },
      aspect:   { value: size.x / size.y },
    },
    vertexShader,
    fragmentShader,
    depthTest:  false,
    depthWrite: false,
  });

  const quad      = new THREE.Mesh(quadGeo, quadMat);
  const postScene = new THREE.Scene();
  // FIX: la cámara ortográfica cubre exactamente NDC [-1,1] en ambos ejes.
  // NO escalar con pixelRatio aquí — el renderer ya maneja eso internamente.
  const postCam   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  postScene.add(quad);

  function render(mainScene, mainCamera) {
    renderer.setRenderTarget(rt);
    renderer.render(mainScene, mainCamera);
    renderer.setRenderTarget(null);
    renderer.render(postScene, postCam);
  }

  function setDistortion(k1Val, k2Val) {
    quadMat.uniforms.k1.value = k1Val;
    quadMat.uniforms.k2.value = k2Val;
  }

  window.addEventListener('resize', () => {
    renderer.getSize(size);
    rt.setSize(size.x * pixelRatio, size.y * pixelRatio);
    quadMat.uniforms.aspect.value = size.x / size.y;
  });

  return { render, setDistortion };
}
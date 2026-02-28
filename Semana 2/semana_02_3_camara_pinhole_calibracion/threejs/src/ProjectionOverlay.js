// src/ProjectionOverlay.js
// ========================
// Convierte marcadores 3D anclados a objetos en coordenadas 2D de pantalla
// y los dibuja como círculos etiquetados en un SVG overlay.
//
// MEJORAS respecto a la versión anterior:
//
//   1. marker.getWorldPosition(tempVec)  en vez de  point3D.clone()
//      → Obtiene la posición world-space ACTUAL del marcador,
//        incluyendo todas las transformaciones del padre (posición, rotación, escala).
//        Si el cubo está rotando, el marcador en su tope devuelve su posición real.
//
//   2. tempVec reutilizado  (un solo THREE.Vector3 declarado fuera del loop)
//      → Evita crear un objeto nuevo por marcador por frame.
//        A 60 fps con 9 marcadores = 540 Vector3 basura/segundo eliminados.
//        El GC (garbage collector) agradece esto especialmente en móviles.
//
// La función worldToScreen no cambia — sigue usando point.project(camera)
// que aplica la misma matemática que OpenCV: R, t, K en una sola operación.

import * as THREE from 'three';

export function createProjectionOverlay(referenceMarkers) {

  const svg    = document.getElementById('overlay');
  const valPts = document.getElementById('val-points');

  const COLORS = [
    '#ff4455', '#ff8800', '#ffee00', '#44ff88',
    '#00eeff', '#4488ff', '#ff44ee', '#ffffff',
    '#aaffaa', '#ffaaaa', '#aaaaff',
  ];

  // ── Vector reutilizable — declarado UNA vez fuera del loop ──
  // getWorldPosition escribe en él en cada llamada sin crear objetos nuevos.
  const tempVec = new THREE.Vector3();

  // ── Proyección 3D → coordenadas de pantalla ──────────────
  // Igual que antes — point.project(camera) hace:
  //   P_cam = R·P_world + t   →   p_ndc = K·P_cam/Z   →   NDC → px
  function worldToScreen(point3D, camera) {
    // Copiar al tempVec para no modificar el original
    tempVec.copy(point3D);
    tempVec.project(camera);

    const behind = tempVec.z > 1.0;
    const x = ( tempVec.x + 1) * 0.5 * window.innerWidth;
    const y = (-tempVec.y + 1) * 0.5 * window.innerHeight;

    return { x, y, behind };
  }

  // ── Helper para crear elementos SVG ──────────────────────
  function svgEl(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
  }

  // ── Actualizar overlay en cada frame ─────────────────────
  function updateOverlay(camera) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    let visible = 0;

    referenceMarkers.forEach((marker, i) => {

      // CLAVE: getWorldPosition resuelve la cadena de transformaciones.
      // Escribe directamente en tempVec (sin new Vector3()).
      // Si el marcador es hijo de un cubo que rota, aquí ya viene rotado.
      marker.getWorldPosition(tempVec);

      const { x, y, behind } = worldToScreen(tempVec, camera);

      if (behind) return;
      const margin = 30;
      if (x < -margin || x > window.innerWidth  + margin) return;
      if (y < -margin || y > window.innerHeight + margin) return;

      visible++;
      const col = COLORS[i % COLORS.length];

      // Cruz de precisión
      svg.appendChild(svgEl('line', {
        x1: x-16, y1: y, x2: x+16, y2: y,
        stroke: col, 'stroke-width': '1', opacity: '0.45',
      }));
      svg.appendChild(svgEl('line', {
        x1: x, y1: y-16, x2: x, y2: y+16,
        stroke: col, 'stroke-width': '1', opacity: '0.45',
      }));

      // Círculo exterior
      svg.appendChild(svgEl('circle', {
        cx: x, cy: y, r: '9',
        fill: 'none', stroke: col, 'stroke-width': '1.8',
      }));

      // Punto central
      svg.appendChild(svgEl('circle', {
        cx: x, cy: y, r: '3.5', fill: col,
      }));

      // Etiqueta: nombre del marcador + coordenadas de pantalla
      const txt = svgEl('text', {
        x: x + 13, y: y + 4,
        fill: col,
        'font-size': '11',
        'font-family': 'monospace',
      });
      txt.textContent = `${marker.name.replace('ref_', '')}  (${Math.round(x)}, ${Math.round(y)})`;
      svg.appendChild(txt);
    });

    valPts.textContent = visible;
  }

  return { updateOverlay };
}
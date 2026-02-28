"""
Parámetros Intrínsecos - Matriz K
Demuestra cómo fx, fy, cx, cy afectan la proyección
"""

import numpy as np
import matplotlib.pyplot as plt


def build_K(fx, fy, cx, cy):
    """Construye la matriz intrínseca 3x3."""
    return np.array([
        [fx,  0, cx],
        [ 0, fy, cy],
        [ 0,  0,  1]
    ], dtype=float)


def project_with_K(points_3d, K):
    """
    Proyecta puntos 3D con la matriz K completa.
    Primero divide por Z (normalización), luego aplica K.
    """
    X = points_3d[:, 0]
    Y = points_3d[:, 1]
    Z = points_3d[:, 2]
    Z = np.where(Z == 0, 1e-6, Z)
    
    # Coordenadas normalizadas (en el plano Z=1)
    x_norm = X / Z
    y_norm = Y / Z
    
    # Coordenadas homogéneas normalizadas
    ones = np.ones_like(x_norm)
    points_norm = np.stack([x_norm, y_norm, ones], axis=0)  # (3, N)
    
    # Aplicar K: p_pixel = K @ p_norm
    p_pixel = K @ points_norm  # (3, N)
    
    return p_pixel[:2, :].T  # (N, 2)


def create_cube(size=1.0, z_offset=5.0):
    s = size / 2
    vertices = np.array([
        [-s,-s,z_offset-s], [s,-s,z_offset-s],
        [s,s,z_offset-s],   [-s,s,z_offset-s],
        [-s,-s,z_offset+s], [s,-s,z_offset+s],
        [s,s,z_offset+s],   [-s,s,z_offset+s],
    ])
    edges = [(0,1),(1,2),(2,3),(3,0),(4,5),(5,6),(6,7),(7,4),
             (0,4),(1,5),(2,6),(3,7)]
    return vertices, edges


def draw_cube_2d(ax, projected, edges, color='blue'):
    for (i, j) in edges:
        ax.plot([projected[i,0], projected[j,0]],
                [projected[i,1], projected[j,1]], color=color, lw=1.5)
    ax.scatter(projected[:,0], projected[:,1], color=color, s=30, zorder=5)


vertices, edges = create_cube(size=1.0, z_offset=5.0)
IMAGE_W, IMAGE_H = 640, 480

# ─────────────────────────────────────────────
# Experimento 1: Variar fx (zoom horizontal)
# ─────────────────────────────────────────────
fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.suptitle('Efecto de fx (focal horizontal) — punto principal centrado', fontsize=13)

for ax, fx in zip(axes, [200, 400, 800]):
    K = build_K(fx=fx, fy=400, cx=IMAGE_W/2, cy=IMAGE_H/2)
    proj = project_with_K(vertices, K)
    draw_cube_2d(ax, proj, edges, color='royalblue')
    ax.set_xlim(0, IMAGE_W)
    ax.set_ylim(IMAGE_H, 0)  # Y invertido como en imágenes
    ax.set_title(f'fx={fx}, fy=400')
    ax.set_aspect('equal')
    ax.grid(True, alpha=0.3)
    # Marcar punto principal
    ax.scatter([IMAGE_W/2], [IMAGE_H/2], color='red', s=100, marker='+', 
               linewidths=2, zorder=10, label='Punto principal')
    ax.legend()

plt.tight_layout()
plt.savefig('../media/02_intrinsic_fx.png', dpi=150, bbox_inches='tight')
plt.show()

# ─────────────────────────────────────────────
# Experimento 2: Variar punto principal (cx, cy)
# ─────────────────────────────────────────────
fig, axes = plt.subplots(1, 3, figsize=(15, 5))
fig.suptitle('Efecto del Punto Principal (cx, cy)', fontsize=13)

configs = [
    (IMAGE_W/2, IMAGE_H/2, 'Centro (320, 240)'),
    (100,       IMAGE_H/2, 'Izquierda (100, 240)'),
    (IMAGE_W/2, 100,       'Arriba (320, 100)'),
]

for ax, (cx, cy, title) in zip(axes, configs):
    K = build_K(fx=400, fy=400, cx=cx, cy=cy)
    proj = project_with_K(vertices, K)
    draw_cube_2d(ax, proj, edges, color='darkorange')
    ax.set_xlim(0, IMAGE_W)
    ax.set_ylim(IMAGE_H, 0)
    ax.set_title(title)
    ax.set_aspect('equal')
    ax.grid(True, alpha=0.3)
    ax.scatter([cx], [cy], color='red', s=150, marker='+',
               linewidths=3, zorder=10, label=f'PP ({int(cx)},{int(cy)})')
    ax.legend()

plt.tight_layout()
plt.savefig('../media/02_principal_point.png', dpi=150, bbox_inches='tight')
plt.show()
print("Guardados: media/02_intrinsic_fx.png y media/02_principal_point.png")
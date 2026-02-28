"""
Modelo de Cámara Pinhole desde cero
Proyección de puntos 3D a 2D usando ecuaciones fundamentales
"""

import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

# ─────────────────────────────────────────────
# FUNCIÓN DE PROYECCIÓN BÁSICA (sin matriz K)
# Ecuación: x' = f * X/Z,  y' = f * Y/Z
# ─────────────────────────────────────────────
def project_pinhole(points_3d, focal_length):
    """
    Proyecta puntos 3D a 2D usando modelo pinhole básico.
    points_3d: array (N, 3) con columnas [X, Y, Z]
    focal_length: distancia focal f
    """
    X = points_3d[:, 0]
    Y = points_3d[:, 1]
    Z = points_3d[:, 2]
    
    # Evitar división por cero
    Z = np.where(Z == 0, 1e-6, Z)
    
    x_proj = focal_length * X / Z
    y_proj = focal_length * Y / Z
    
    return np.stack([x_proj, y_proj], axis=1)


# ─────────────────────────────────────────────
# DEFINIR UN CUBO 3D (8 vértices)
# ─────────────────────────────────────────────
def create_cube(size=1.0, z_offset=5.0):
    """
    Crea un cubo centrado en el eje Z a distancia z_offset.
    size: tamaño del lado
    z_offset: distancia a la cámara
    """
    s = size / 2
    vertices = np.array([
        [-s, -s, z_offset - s],  # 0
        [ s, -s, z_offset - s],  # 1
        [ s,  s, z_offset - s],  # 2
        [-s,  s, z_offset - s],  # 3
        [-s, -s, z_offset + s],  # 4
        [ s, -s, z_offset + s],  # 5
        [ s,  s, z_offset + s],  # 6
        [-s,  s, z_offset + s],  # 7
    ])
    
    # Aristas del cubo: pares de índices de vértices
    edges = [
        (0,1),(1,2),(2,3),(3,0),  # cara frontal
        (4,5),(5,6),(6,7),(7,4),  # cara trasera
        (0,4),(1,5),(2,6),(3,7),  # aristas laterales
    ]
    return vertices, edges


# ─────────────────────────────────────────────
# VISUALIZACIÓN
# ─────────────────────────────────────────────
def draw_cube_2d(ax, projected, edges, color='blue', label=''):
    """Dibuja el cubo proyectado en 2D."""
    for (i, j) in edges:
        x_vals = [projected[i, 0], projected[j, 0]]
        y_vals = [projected[i, 1], projected[j, 1]]
        ax.plot(x_vals, y_vals, color=color, linewidth=1.5)
    ax.scatter(projected[:, 0], projected[:, 1], color=color, s=30, zorder=5)
    if label:
        ax.set_title(label)


# ─────────────────────────────────────────────
# EXPERIMENTO: Distintas distancias focales
# ─────────────────────────────────────────────
vertices, edges = create_cube(size=1.0, z_offset=5.0)

focal_lengths = [50, 100, 200, 400]
colors = ['blue', 'green', 'red', 'orange']

fig, axes = plt.subplots(1, 4, figsize=(16, 4))
fig.suptitle('Efecto de la Distancia Focal en la Proyección Pinhole', fontsize=14)

for ax, f, color in zip(axes, focal_lengths, colors):
    projected = project_pinhole(vertices, focal_length=f)
    draw_cube_2d(ax, projected, edges, color=color, label=f'f = {f}px')
    ax.set_xlim(-150, 150)
    ax.set_ylim(-150, 150)
    ax.set_aspect('equal')
    ax.grid(True, alpha=0.3)
    ax.axhline(0, color='gray', linewidth=0.5)
    ax.axvline(0, color='gray', linewidth=0.5)
    ax.set_xlabel('x (píxeles)')
    ax.set_ylabel('y (píxeles)')

plt.tight_layout()
plt.savefig('../media/01_focal_lengths.png', dpi=150, bbox_inches='tight')
plt.show()
print("Guardado: media/01_focal_lengths.png")


# ─────────────────────────────────────────────
# EXPERIMENTO: Cubo a diferentes distancias Z
# ─────────────────────────────────────────────
fig, axes = plt.subplots(1, 4, figsize=(16, 4))
fig.suptitle('Efecto de la Distancia Z (perspectiva)', fontsize=14)

z_distances = [3, 5, 8, 15]
for ax, z, color in zip(axes, z_distances, colors):
    verts, _ = create_cube(size=1.0, z_offset=z)
    projected = project_pinhole(verts, focal_length=100)
    draw_cube_2d(ax, projected, edges, color=color, label=f'Z = {z} unidades')
    ax.set_xlim(-100, 100)
    ax.set_ylim(-100, 100)
    ax.set_aspect('equal')
    ax.grid(True, alpha=0.3)
    ax.set_xlabel('x (píxeles)')
    ax.set_ylabel('y (píxeles)')

plt.tight_layout()
plt.savefig('../media/01_z_distances.png', dpi=150, bbox_inches='tight')
plt.show()
print("Guardado: media/01_z_distances.png")
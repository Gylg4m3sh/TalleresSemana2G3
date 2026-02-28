"""
Parámetros Extrínsecos: Rotación R y Traslación t
Transforma puntos del mundo 3D al sistema de coordenadas de la cámara
"""

import numpy as np
import matplotlib.pyplot as plt


def rotation_x(angle_deg):
    """Matriz de rotación alrededor del eje X."""
    a = np.radians(angle_deg)
    return np.array([
        [1,      0,       0],
        [0, np.cos(a), -np.sin(a)],
        [0, np.sin(a),  np.cos(a)]
    ])

def rotation_y(angle_deg):
    """Matriz de rotación alrededor del eje Y."""
    a = np.radians(angle_deg)
    return np.array([
        [ np.cos(a), 0, np.sin(a)],
        [0,          1,          0],
        [-np.sin(a), 0, np.cos(a)]
    ])

def rotation_z(angle_deg):
    """Matriz de rotación alrededor del eje Z."""
    a = np.radians(angle_deg)
    return np.array([
        [np.cos(a), -np.sin(a), 0],
        [np.sin(a),  np.cos(a), 0],
        [0,          0,         1]
    ])

def build_K(fx=400, fy=400, cx=320, cy=240):
    return np.array([[fx,0,cx],[0,fy,cy],[0,0,1]], dtype=float)

def project_full(points_world, K, R, t):
    """
    Proyección completa: mundo → cámara → imagen.
    P_cam = R @ P_world + t
    p_img = K @ P_cam / Z
    """
    # Transformar a coordenadas de cámara
    # points_world: (N, 3)
    P_cam = (R @ points_world.T).T + t  # (N, 3)
    
    Z = P_cam[:, 2]
    Z = np.where(Z <= 0, 1e-6, Z)
    
    x_norm = P_cam[:, 0] / Z
    y_norm = P_cam[:, 1] / Z
    ones = np.ones_like(x_norm)
    
    p_norm = np.stack([x_norm, y_norm, ones], axis=0)
    p_img = K @ p_norm
    
    return p_img[:2, :].T


def create_cube(size=1.0, z_offset=5.0):
    s = size / 2
    v = np.array([
        [-s,-s,z_offset-s],[s,-s,z_offset-s],[s,s,z_offset-s],[-s,s,z_offset-s],
        [-s,-s,z_offset+s],[s,-s,z_offset+s],[s,s,z_offset+s],[-s,s,z_offset+s],
    ])
    edges = [(0,1),(1,2),(2,3),(3,0),(4,5),(5,6),(6,7),(7,4),(0,4),(1,5),(2,6),(3,7)]
    return v, edges

def draw_cube_2d(ax, projected, edges, color='blue', title=''):
    for (i,j) in edges:
        ax.plot([projected[i,0],projected[j,0]],
                [projected[i,1],projected[j,1]], color=color, lw=1.5)
    ax.scatter(projected[:,0], projected[:,1], color=color, s=30)
    if title: ax.set_title(title, fontsize=10)


K = build_K()
vertices, edges = create_cube(size=1.5, z_offset=0.0)  # Cubo centrado en origen

# ─────────────────────────────────────────────
# Experimento: Rotar la cámara alrededor del cubo
# ─────────────────────────────────────────────
fig, axes = plt.subplots(2, 4, figsize=(16, 8))
fig.suptitle('Simulación de Movimiento de Cámara alrededor de un Cubo', fontsize=13)

angles_y = [0, 15, 30, 45, 60, 90, 120, 160]
t = np.array([0, 0, 5])  # Cámara a 5 unidades frente al cubo

for ax, angle in zip(axes.flat, angles_y):
    R = rotation_y(angle)
    proj = project_full(vertices, K, R, t)
    draw_cube_2d(ax, proj, edges, color='steelblue',
                 title=f'Rotación Y = {angle}°')
    ax.set_xlim(0, 640); ax.set_ylim(480, 0)
    ax.set_aspect('equal'); ax.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('../media/03_camera_rotation.png', dpi=150, bbox_inches='tight')
plt.show()

# ─────────────────────────────────────────────
# Experimento: Traslación de la cámara
# ─────────────────────────────────────────────
fig, axes = plt.subplots(1, 4, figsize=(16, 4))
fig.suptitle('Efecto de la Traslación de la Cámara', fontsize=13)

translations = [
    (np.array([ 0, 0, 5]), 'Frontal\nt=[0,0,5]'),
    (np.array([-2, 0, 5]), 'Derecha\nt=[-2,0,5]'),
    (np.array([ 0,-2, 5]), 'Abajo\nt=[0,-2,5]'),
    (np.array([ 2, 2, 5]), 'Diagonal\nt=[2,2,5]'),
]
R = np.eye(3)  # Sin rotación

for ax, (t_vec, title) in zip(axes, translations):
    proj = project_full(vertices, K, R, t_vec)
    draw_cube_2d(ax, proj, edges, color='darkorange', title=title)
    ax.set_xlim(0, 640); ax.set_ylim(480, 0)
    ax.set_aspect('equal'); ax.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('../media/03_camera_translation.png', dpi=150, bbox_inches='tight')
plt.show()
print("Guardados en media/")
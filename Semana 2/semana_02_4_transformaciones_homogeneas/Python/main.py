
# TALLER 2.4 - TRANSFORMACIONES HOMOGÉNEAS


import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

# COORDENADAS HOMOGÉNEAS EN 2D

def traslacion(tx, ty):
    return np.array([
        [1, 0, tx],
        [0, 1, ty],
        [0, 0, 1]
    ])

def rotacion(angulo_rad):
    c, s = np.cos(angulo_rad), np.sin(angulo_rad)
    return np.array([
        [c, -s, 0],
        [s,  c, 0],
        [0,  0, 1]
    ])

def escalamiento(sx, sy):
    return np.array([
        [sx, 0,  0],
        [0,  sy, 0],
        [0,  0,  1]
    ])

def reflexion(eje='x'):
    if eje == 'x':
        return np.array([[1, 0, 0], [0, -1, 0], [0, 0, 1]])
    elif eje == 'y':
        return np.array([[-1, 0, 0], [0, 1, 0], [0, 0, 1]])
    else:
        raise ValueError("Eje debe ser 'x' o 'y'")

def aplicar_transformacion(puntos_hom, matriz):
    return matriz @ puntos_hom

def demo_2d():
    # Puntos de un triángulo
    puntos = np.array([
        [0, 0],
        [1, 0],
        [0.5, 1],
        [0, 0]
    ]).T
    puntos_hom = np.vstack([puntos, np.ones(puntos.shape[1])])

    T = traslacion(2, 1)
    R = rotacion(np.pi/4)
    M = R @ T
    pts_trans = aplicar_transformacion(puntos_hom, M)[:2, :]

    plt.figure()
    plt.plot(puntos[0, :], puntos[1, :], 'b-o', label='Original')
    plt.plot(pts_trans[0, :], pts_trans[1, :], 'r-o', label='Transformado')
    plt.axis('equal')
    plt.grid(True)
    plt.legend()
    plt.title('Transformación 2D: Traslación + Rotación')
    plt.savefig('media/transformacion_2d.png')
    plt.close()
    print("Guardado: media/transformacion_2d.png")


# COMPOSICIÓN DE TRANSFORMACIONES (EL ORDEN SI IMPORTA)


def demo_composicion():
    puntos = np.array([
        [0, 0],
        [1, 0],
        [0.5, 1],
        [0, 0]
    ]).T
    puntos_hom = np.vstack([puntos, np.ones(puntos.shape[1])])

    R = rotacion(np.pi/2)
    T = traslacion(2, 0)

    RT = T @ R
    TR = R @ T

    pts_RT = aplicar_transformacion(puntos_hom, RT)[:2, :]
    pts_TR = aplicar_transformacion(puntos_hom, TR)[:2, :]

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))
    ax1.plot(puntos[0,:], puntos[1,:], 'b-o')
    ax1.plot(pts_RT[0,:], pts_RT[1,:], 'r-o')
    ax1.set_title('R luego T')
    ax1.axis('equal')
    ax1.grid(True)

    ax2.plot(puntos[0,:], puntos[1,:], 'b-o')
    ax2.plot(pts_TR[0,:], pts_TR[1,:], 'r-o')
    ax2.set_title('T luego R')
    ax2.axis('equal')
    ax2.grid(True)

    plt.tight_layout()
    plt.savefig('media/composicion_orden.png')
    plt.close()
    print("Guardado: media/composicion_orden.png")


# 3. TRANSFORMACIONES EN 3D


def traslacion_3d(tx, ty, tz):
    return np.array([
        [1, 0, 0, tx],
        [0, 1, 0, ty],
        [0, 0, 1, tz],
        [0, 0, 0, 1]
    ])

def rotacion_x_3d(angulo_rad):
    c, s = np.cos(angulo_rad), np.sin(angulo_rad)
    return np.array([
        [1, 0,   0,   0],
        [0, c, -s,   0],
        [0, s,  c,   0],
        [0, 0,   0,   1]
    ])

def rotacion_y_3d(angulo_rad):
    c, s = np.cos(angulo_rad), np.sin(angulo_rad)
    return np.array([
        [c,  0, s, 0],
        [0,  1, 0, 0],
        [-s, 0, c, 0],
        [0,  0, 0, 1]
    ])

def rotacion_z_3d(angulo_rad):
    c, s = np.cos(angulo_rad), np.sin(angulo_rad)
    return np.array([
        [c, -s, 0, 0],
        [s,  c, 0, 0],
        [0,  0, 1, 0],
        [0,  0, 0, 1]
    ])

def escala_3d(sx, sy, sz):
    return np.array([
        [sx, 0,  0,  0],
        [0,  sy, 0,  0],
        [0,  0,  sz, 0],
        [0,  0,  0,  1]
    ])

def dibujar_cubo(ax, vertices, aristas, color='b'):
    for i, j in aristas:
        ax.plot3D(vertices[0, [i, j]], vertices[1, [i, j]], vertices[2, [i, j]], color=color)
    ax.scatter(vertices[0, :], vertices[1, :], vertices[2, :], color=color, s=30)

def demo_3d():
    # Vértices de un cubo de lado 2 centrado en el origen
    vertices = np.array([
        [-1, -1, -1],
        [ 1, -1, -1],
        [ 1,  1, -1],
        [-1,  1, -1],
        [-1, -1,  1],
        [ 1, -1,  1],
        [ 1,  1,  1],
        [-1,  1,  1]
    ]).T
    aristas = [
        (0,1), (1,2), (2,3), (3,0),
        (4,5), (5,6), (6,7), (7,4),
        (0,4), (1,5), (2,6), (3,7)
    ]
    vertices_hom = np.vstack([vertices, np.ones(vertices.shape[1])])

    T = traslacion_3d(3, 1, 2)
    R = rotacion_y_3d(np.pi/3)
    M = T @ R
    vertices_trans = (M @ vertices_hom)[:3, :]

    fig = plt.figure()
    ax = fig.add_subplot(111, projection='3d')
    dibujar_cubo(ax, vertices, aristas, color='b')
    dibujar_cubo(ax, vertices_trans, aristas, color='r')
    ax.set_xlabel('X')
    ax.set_ylabel('Y')
    ax.set_zlabel('Z')
    ax.set_title('Cubo 3D transformado')
    plt.savefig('media/cubo_3d.png')
    plt.close()
    print("Guardado: media/cubo_3d.png")

#  CAMBIOS DE BASE


def dibujar_ejes(ax, origen, R, longitud=1):
    colores = ['r', 'g', 'b']
    for i in range(3):
        eje = R[:, i] * longitud
        ax.quiver(origen[0], origen[1], origen[2],
                  eje[0], eje[1], eje[2], color=colores[i], arrow_length_ratio=0.1)

def demo_cambio_base():
    pos_cam = np.array([1, 2, 3])
    R_cam = rotacion_y_3d(np.radians(30))

    T_mundo_cam = np.eye(4)
    T_mundo_cam[:3, :3] = R_cam[:3, :3].T
    T_mundo_cam[:3, 3] = -R_cam[:3, :3].T @ pos_cam

    p_mundo = np.array([2, 1, 0, 1])
    p_cam = T_mundo_cam @ p_mundo
    print("Punto en cámara:", p_cam[:3])

    # Visualización
    origen_mundo = np.array([0,0,0])
    R_mundo = np.eye(3)

    fig = plt.figure()
    ax = fig.add_subplot(111, projection='3d')
    dibujar_ejes(ax, origen_mundo, R_mundo, longitud=2)
    dibujar_ejes(ax, pos_cam, R_cam[:3,:3], longitud=1)
    ax.set_xlabel('X')
    ax.set_ylabel('Y')
    ax.set_zlabel('Z')
    ax.set_title('Sistemas de coordenadas')
    ax.set_xlim(-2,5); ax.set_ylim(-2,5); ax.set_zlim(-2,5)
    plt.savefig('media/cambio_base.png')
    plt.close()
    print("Guardado: media/cambio_base.png")


#  TRANSFORMACIONES INVERSAS


def demo_inversa():
    T_compuesta = traslacion_3d(3,1,2) @ rotacion_y_3d(0.5)
    T_inv = np.linalg.inv(T_compuesta)
    identidad = T_compuesta @ T_inv
    error = np.linalg.norm(identidad - np.eye(4))
    print("Error de inversa (debe ser cercano a 0):", error)


#  APLICACIÓN EN ROBÓTICA: BRAZO DE 2 ESLABONES


def demo_brazo_robotico():
    L1 = 2
    L2 = 1.5
    theta1 = np.radians(30)
    theta2 = np.radians(45)

    T01 = rotacion(theta1) @ traslacion(0,0)
    T12 = rotacion(theta2) @ traslacion(0,0)

    p_efector_local = np.array([L2, 0, 1])
    p_efector_base = T01 @ T12 @ p_efector_local

    base = np.array([0,0,1])
    p1 = T01 @ np.array([L1,0,1])

    base_xy = base[:2]
    p1_xy = p1[:2]
    p2_xy = p_efector_base[:2]

    plt.figure()
    plt.plot([base_xy[0], p1_xy[0]], [base_xy[1], p1_xy[1]], 'b-o', linewidth=3, label='Eslabón1')
    plt.plot([p1_xy[0], p2_xy[0]], [p1_xy[1], p2_xy[1]], 'r-o', linewidth=3, label='Eslabón2')
    plt.scatter(*base_xy, color='k', s=100, label='Base')
    plt.scatter(*p1_xy, color='b', s=80, label='Articulación1')
    plt.scatter(*p2_xy, color='r', s=80, label='Efector')
    plt.axis('equal')
    plt.grid(True)
    plt.legend()
    plt.title('Brazo robótico de 2 eslabones')
    plt.savefig('media/brazo_robotico.png')
    plt.close()
    print("Guardado: media/brazo_robotico.png")

# EJECUCIÓN 


if __name__ == "__main__":
    print("Ejecutando demostraciones del Taller 2.4...")
    demo_2d()
    demo_composicion()
    demo_3d()
    demo_cambio_base()
    demo_inversa()
    demo_brazo_robotico()
    print("Todas las imágenes han sido guardadas en la carpeta 'media/'.")
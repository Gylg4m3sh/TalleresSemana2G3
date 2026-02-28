"""
Genera imágenes sintéticas del patrón de ajedrez para calibración.
Enfoque correcto: renderizar el patrón directamente desde las esquinas
proyectadas, sin usar warpPerspective (que ignora la distorsión radial).
"""
import cv2
import numpy as np
import os

os.makedirs('../calibration_images', exist_ok=True)

# ── Configuración ─────────────────────────────────────────────
COLS = 9        # Esquinas INTERNAS en X  (cuadros = COLS+1)
ROWS = 6        # Esquinas INTERNAS en Y  (cuadros = ROWS+1)
SQUARE_MM = 30.0  # Tamaño real del cuadrado (mm)

IMG_W = 1280
IMG_H = 960

# Matriz intrínseca simulada (cámara razonablemente realista)
K_real = np.array([
    [900,   0, IMG_W / 2],
    [  0, 900, IMG_H / 2],
    [  0,   0,          1]
], dtype=np.float64)

# Distorsión suave — suficiente para que exista pero no tanto
# que rompa la detección de esquinas
dist_real = np.array([-0.15, 0.05, 0.0, 0.0, 0.0], dtype=np.float64)

# ── Puntos 3D del tablero (plano Z=0) ────────────────────────
# Solo las esquinas INTERNAS (las que detecta findChessboardCorners)
objp = np.zeros((ROWS * COLS, 3), dtype=np.float32)
objp[:, :2] = np.mgrid[0:COLS, 0:ROWS].T.reshape(-1, 2) * SQUARE_MM

# ── Vistas: (rot_x°, rot_y°, rot_z°,  tx,   ty,   tz_mm) ────
# tz grande = más lejos = patrón más pequeño = más margen
views_params = [
    (  0,   0,  0,    0,    0, 400),   # Frontal limpio
    ( 12,   0,  0,    0,   30, 420),   # Inclinado arriba
    (-12,   0,  0,    0,  -30, 420),   # Inclinado abajo
    (  0,  15,  0,   40,    0, 450),   # Girado derecha
    (  0, -15,  0,  -40,    0, 450),   # Girado izquierda
    (  8,  10,  0,   30,   25, 430),   # Diagonal 1
    ( -8, -10,  0,  -30,  -25, 430),   # Diagonal 2
    ( 15,  10,  3,   35,   40, 460),   # Ángulo pronunciado 1
    (-10,  15,  0,   40,  -20, 450),   # Ángulo pronunciado 2
    (  5, -15, -3,  -40,   15, 450),   # Ángulo pronunciado 3
    ( 18,   5,  0,   10,   45, 470),   # Muy inclinado arriba
    (-18,  -5,  0,  -10,  -45, 470),   # Muy inclinado abajo
    (  5,   5,  8,   20,   20, 410),   # Ligera rotación Z
    ( -5,  -5, -8,  -20,  -20, 410),   # Ligera rotación Z opuesta
]


def euler_to_rvec(rx_deg, ry_deg, rz_deg):
    """Convierte ángulos de Euler (grados) a vector de rotación de Rodrigues."""
    rx = np.radians(rx_deg)
    ry = np.radians(ry_deg)
    rz = np.radians(rz_deg)

    Rx = np.array([[1, 0, 0],
                   [0, np.cos(rx), -np.sin(rx)],
                   [0, np.sin(rx),  np.cos(rx)]])
    Ry = np.array([[ np.cos(ry), 0, np.sin(ry)],
                   [0,           1, 0          ],
                   [-np.sin(ry), 0, np.cos(ry)]])
    Rz = np.array([[np.cos(rz), -np.sin(rz), 0],
                   [np.sin(rz),  np.cos(rz), 0],
                   [0,           0,          1]])

    R = Rz @ Ry @ Rx
    rvec, _ = cv2.Rodrigues(R)
    return rvec


def render_chessboard(projected_corners, img_w, img_h, cols, rows):
    """
    Renderiza el tablero de ajedrez dibujando cada cuadro como un
    polígono convexo usando las esquinas proyectadas.

    projected_corners: (rows*cols, 2) — esquinas INTERNAS proyectadas
    """
    img = np.ones((img_h, img_w), dtype=np.uint8) * 200  # Fondo gris claro

    # Reconstruir la grilla completa de esquinas (incluyendo borde exterior)
    # Las esquinas internas van de 0..COLS-1 y 0..ROWS-1
    # Necesitamos extender al borde exterior añadiendo una fila/columna extra

    # Reshape a grilla (rows, cols, 2)
    grid = projected_corners.reshape(rows, cols, 2)

    # Estimar el tamaño de celda promedio para extrapolar el borde
    # Usamos diferencias entre puntos adyacentes
    def extrapolate_border(grid, rows, cols):
        """Añade una fila/columna de borde alrededor de la grilla interna."""
        full = np.zeros((rows + 2, cols + 2, 2), dtype=np.float32)

        # Copiar interior
        full[1:rows+1, 1:cols+1] = grid

        # Borde izquierdo y derecho (extrapolar horizontalmente)
        for r in range(1, rows + 1):
            left_step  = grid[r-1, 0] - grid[r-1, 1]   # hacia izquierda
            right_step = grid[r-1, cols-1] - grid[r-1, cols-2]  # hacia derecha
            full[r, 0]      = grid[r-1, 0]  + left_step
            full[r, cols+1] = grid[r-1, cols-1] + right_step

        # Borde superior e inferior
        for c in range(cols + 2):
            top_step    = full[1, c] - full[2, c]
            bottom_step = full[rows, c] - full[rows-1, c]
            full[0, c]      = full[1, c]    + top_step
            full[rows+1, c] = full[rows, c] + bottom_step

        return full

    full_grid = extrapolate_border(grid, rows, cols)
    full_rows, full_cols = rows + 1, cols + 1

    # Dibujar cada celda del tablero
    for r in range(full_rows):
        for c in range(full_cols):
            # Color alternado: negro o blanco
            color = 0 if (r + c) % 2 == 0 else 255

            # Las 4 esquinas de esta celda en la grilla completa
            pts = np.array([
                full_grid[r,     c    ],
                full_grid[r,     c + 1],
                full_grid[r + 1, c + 1],
                full_grid[r + 1, c    ],
            ], dtype=np.int32)

            cv2.fillConvexPoly(img, pts, color)

    # Dibujar borde blanco alrededor del tablero
    border_pts = np.array([
        full_grid[0,          0         ],
        full_grid[0,          full_cols ],
        full_grid[full_rows,  full_cols ],
        full_grid[full_rows,  0         ],
    ], dtype=np.int32)
    cv2.polylines(img, [border_pts], isClosed=True, color=255, thickness=3)

    return img


# ── Generar cada vista ────────────────────────────────────────
generated = 0

for i, (rx, ry, rz, tx, ty, tz) in enumerate(views_params):
    rvec = euler_to_rvec(rx, ry, rz)
    tvec = np.array([[tx], [ty], [tz]], dtype=np.float64)

    # Proyectar las esquinas internas con distorsión
    proj, _ = cv2.projectPoints(objp, rvec, tvec, K_real, dist_real)
    proj = proj.reshape(-1, 2)

    # Verificar que todos los puntos estén dentro de la imagen
    margin = 20
    if (np.all(proj[:, 0] > margin) and np.all(proj[:, 0] < IMG_W - margin) and
            np.all(proj[:, 1] > margin) and np.all(proj[:, 1] < IMG_H - margin)):

        # Renderizar el tablero
        img = render_chessboard(proj, IMG_W, IMG_H, COLS, ROWS)

        # Añadir ruido gaussiano suave (simula sensor real)
        noise = np.random.normal(0, 3, img.shape).astype(np.int16)
        img = np.clip(img.astype(np.int16) + noise, 0, 255).astype(np.uint8)

        fname = f'../calibration_images/calib_{i:03d}.jpg'
        cv2.imwrite(fname, img, [cv2.IMWRITE_JPEG_QUALITY, 95])
        print(f"✓ Generada: calib_{i:03d}.jpg  (rot={rx}°,{ry}°,{rz}°)")
        generated += 1

        # Verificar que OpenCV puede detectar las esquinas
        gray = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
        gray_check = cv2.cvtColor(gray, cv2.COLOR_BGR2GRAY)
        ret_check, _ = cv2.findChessboardCorners(gray_check, (COLS, ROWS), None)
        if ret_check:
            print(f"  → Esquinas detectables por OpenCV")
        else:
            print(f"  → OpenCV no detectó esquinas (puede que el ángulo sea muy extremo)")
    else:
        print(f"✗ Vista {i} descartada: puntos fuera de la imagen (ángulo demasiado extremo)")

print(f"\n{'='*50}")
print(f"Generadas: {generated} imágenes en calibration_images/")
print(f"Ahora ejecuta: python 04_calibration.py")
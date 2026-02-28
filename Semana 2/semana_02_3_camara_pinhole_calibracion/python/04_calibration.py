"""
Calibración de Cámara con Patrón de Ajedrez
Usa cv2.calibrateCamera() para obtener K y coeficientes de distorsión
"""

import cv2
import numpy as np
import matplotlib.pyplot as plt
import glob
import os

# ─────────────────────────────────────────────
# CONFIGURACIÓN
# Ajusta estos valores según tu patrón de ajedrez
# ─────────────────────────────────────────────
CHESSBOARD_COLS = 9   # Número de esquinas INTERNAS en columnas
CHESSBOARD_ROWS = 6   # Número de esquinas INTERNAS en filas
SQUARE_SIZE_MM  = 25.0  # Tamaño real del cuadrado en mm (ajustar si imprimes)
IMAGES_PATH     = '../calibration_images/*.jpg'  # Ruta a las imágenes


def generate_chessboard_image(save_path, cols=10, rows=7, square_size=80):
    """
    Genera y guarda una imagen de patrón de ajedrez digital.
    Puedes imprimirla o usarla en pantalla para fotografiarla.
    cols, rows: número de CUADROS (no esquinas)
    """
    img_h = rows * square_size
    img_w = cols * square_size
    img = np.zeros((img_h, img_w), dtype=np.uint8)
    
    for r in range(rows):
        for c in range(cols):
            if (r + c) % 2 == 0:
                y1, y2 = r * square_size, (r + 1) * square_size
                x1, x2 = c * square_size, (c + 1) * square_size
                img[y1:y2, x1:x2] = 255
    
    cv2.imwrite(save_path, img)
    print(f"Patrón generado: {save_path}")
    return img


def calibrate_camera(images_path, chessboard_size, square_size_mm):
    """
    Calibra la cámara usando imágenes del patrón de ajedrez.
    
    Retorna:
        ret: error RMS de reproyección
        K: matriz intrínseca 3x3
        dist: coeficientes de distorsión [k1,k2,p1,p2,k3]
        rvecs, tvecs: vectores de rotación y traslación por imagen
    """
    cols, rows = chessboard_size
    
    # Puntos 3D del patrón en el mundo real
    # El patrón está en el plano Z=0
    objp = np.zeros((rows * cols, 3), dtype=np.float32)
    objp[:, :2] = np.mgrid[0:cols, 0:rows].T.reshape(-1, 2)
    objp *= square_size_mm  # Escalar a unidades reales (mm)
    
    obj_points = []  # Puntos 3D reales
    img_points = []  # Puntos 2D detectados en imagen
    
    images = glob.glob(images_path)
    if not images:
        print(f"No se encontraron imágenes en: {images_path}")
        return None
    
    print(f"Encontradas {len(images)} imágenes para calibración")
    
    successful = 0
    img_shape = None
    detection_results = []
    
    for fname in sorted(images):
        img = cv2.imread(fname)
        if img is None:
            print(f"No se pudo leer: {fname}")
            continue
        
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        img_shape = gray.shape[::-1]  # (width, height)
        
        # Detectar esquinas del ajedrez
        ret, corners = cv2.findChessboardCorners(gray, (cols, rows), None)
        
        if ret:
            # Refinar posición de esquinas con subpíxel
            criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 0.001)
            corners_refined = cv2.cornerSubPix(gray, corners, (11, 11), (-1, -1), criteria)
            
            obj_points.append(objp)
            img_points.append(corners_refined)
            successful += 1
            detection_results.append((fname, img, corners_refined, True))
            print(f"  ✓ {os.path.basename(fname)}: esquinas detectadas")
        else:
            detection_results.append((fname, img, None, False))
            print(f"  ✗ {os.path.basename(fname)}: esquinas NO detectadas")
    
    if successful < 3:
        print(f"Se necesitan al menos 3 imágenes exitosas. Solo {successful} funcionaron.")
        return None
    
    print(f"\nCalibrando con {successful} imágenes...")
    
    # ¡La función clave!
    ret, K, dist, rvecs, tvecs = cv2.calibrateCamera(
        obj_points, img_points, img_shape, None, None
    )
    
    print(f"\n{'='*50}")
    print("RESULTADOS DE CALIBRACIÓN")
    print(f"{'='*50}")
    print(f"Error RMS de reproyección: {ret:.4f} píxeles")
    print(f"\nMatriz Intrínseca K:")
    print(K)
    print(f"\nCoeficientes de distorsión [k1, k2, p1, p2, k3]:")
    print(dist)
    
    return ret, K, dist, rvecs, tvecs, obj_points, img_points, img_shape, detection_results


def visualize_detections(detection_results, save_path):
    """Visualiza las detecciones de esquinas."""
    n = min(6, len(detection_results))
    fig, axes = plt.subplots(2, 3, figsize=(15, 10))
    fig.suptitle('Detección de Esquinas del Patrón de Ajedrez', fontsize=13)
    
    for idx, ax in enumerate(axes.flat):
        if idx >= len(detection_results):
            ax.axis('off')
            continue
        
        fname, img, corners, found = detection_results[idx]
        img_draw = img.copy()
        
        if found and corners is not None:
            cv2.drawChessboardCorners(img_draw, (CHESSBOARD_COLS, CHESSBOARD_ROWS),
                                       corners, found)
            status = '✓ Detectado'
            color_title = 'green'
        else:
            status = '✗ No detectado'
            color_title = 'red'
        
        ax.imshow(cv2.cvtColor(img_draw, cv2.COLOR_BGR2RGB))
        ax.set_title(f'{os.path.basename(fname)}\n{status}', color=color_title)
        ax.axis('off')
    
    plt.tight_layout()
    plt.savefig(save_path, dpi=150, bbox_inches='tight')
    plt.show()


# ─────────────────────────────────────────────
# GENERAR PATRÓN si no tienes imágenes aún
# ─────────────────────────────────────────────
os.makedirs('../calibration_images', exist_ok=True)
os.makedirs('../media', exist_ok=True)

# Genera el patrón de ajedrez para imprimir/fotografiar
chessboard_img = generate_chessboard_image(
    '../media/chessboard_pattern.png',
    cols=CHESSBOARD_COLS + 1,
    rows=CHESSBOARD_ROWS + 1,
    square_size=80
)

# ─────────────────────────────────────────────
# CALIBRAR
# ─────────────────────────────────────────────
result = calibrate_camera(
    IMAGES_PATH,
    chessboard_size=(CHESSBOARD_COLS, CHESSBOARD_ROWS),
    square_size_mm=SQUARE_SIZE_MM
)

if result:
    ret, K, dist, rvecs, tvecs, obj_pts, img_pts, img_shape, detections = result
    
    # Visualizar detecciones
    visualize_detections(detections, '../media/04_corner_detections.png')
    
    # Guardar parámetros de calibración
    np.save('../python/calibration_K.npy', K)
    np.save('../python/calibration_dist.npy', dist)
    print("\nParámetros guardados en python/calibration_K.npy y calibration_dist.npy")
else:
    print("\nNo se pudo calibrar. Coloca imágenes en la carpeta calibration_images/")
    print("Tip: Fotografía el patrón generado en media/chessboard_pattern.png desde")
    print("     diferentes ángulos y guarda las fotos como .jpg en calibration_images/")
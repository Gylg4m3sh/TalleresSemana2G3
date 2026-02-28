"""
Corrección de Distorsión y Validación de Calibración
Aplica undistort y calcula error de reproyección
"""

import cv2
import numpy as np
import matplotlib.pyplot as plt
import glob
import os


def apply_undistortion(image_path, K, dist, save_path=None):
    """Aplica corrección de distorsión a una imagen."""
    img = cv2.imread(image_path)
    if img is None:
        print(f"No se pudo leer: {image_path}")
        return None, None
    
    h, w = img.shape[:2]
    
    # Calcular nueva matriz de cámara óptima
    # alpha=0: recorta la imagen para eliminar bordes negros
    # alpha=1: conserva todos los píxeles
    new_K, roi = cv2.getOptimalNewCameraMatrix(K, dist, (w, h), alpha=1)
    
    # Corregir distorsión
    undistorted = cv2.undistort(img, K, dist, None, new_K)
    
    # Recortar región válida
    x, y, w_roi, h_roi = roi
    undistorted_cropped = undistorted[y:y+h_roi, x:x+w_roi]
    
    if save_path:
        cv2.imwrite(save_path, undistorted_cropped)
    
    return img, undistorted


def compute_reprojection_error(obj_points, img_points, rvecs, tvecs, K, dist):
    """
    Calcula el error de reproyección para cada imagen.
    Error bajo (< 1 px) = buena calibración.
    """
    errors = []
    
    for i, (obj_pts, img_pts, rvec, tvec) in enumerate(
            zip(obj_points, img_points, rvecs, tvecs)):
        
        # Reproyectar puntos 3D usando los parámetros de calibración
        proj_pts, _ = cv2.projectPoints(obj_pts, rvec, tvec, K, dist)
        proj_pts = proj_pts.reshape(-1, 2)
        img_pts_flat = img_pts.reshape(-1, 2)
        
        # Error euclidiano promedio
        error = np.sqrt(np.mean(np.sum((proj_pts - img_pts_flat)**2, axis=1)))
        errors.append(error)
        print(f"  Imagen {i+1}: error de reproyección = {error:.4f} px")
    
    mean_error = np.mean(errors)
    print(f"\nError promedio total: {mean_error:.4f} px")
    print("  < 0.5 px = Excelente calibración")
    print("  0.5-1.0 px = Buena calibración")
    print("  > 1.0 px = Calibración mejorable")
    
    return errors


# ─────────────────────────────────────────────
# CARGAR PARÁMETROS DE CALIBRACIÓN
# ─────────────────────────────────────────────
K_path    = '../python/calibration_K.npy'
dist_path = '../python/calibration_dist.npy'

if not (os.path.exists(K_path) and os.path.exists(dist_path)):
    print("ERROR: Primero ejecuta 04_calibration.py para obtener los parámetros.")
    exit()

K    = np.load(K_path)
dist = np.load(dist_path)

print("Parámetros de calibración cargados:")
print(f"K =\n{K}")
print(f"dist = {dist}")

# ─────────────────────────────────────────────
# APLICAR UNDISTORT A TODAS LAS IMÁGENES
# ─────────────────────────────────────────────
images = sorted(glob.glob('../calibration_images/*.jpg'))

if images:
    # Mostrar comparación para la primera imagen
    img_orig, img_undist = apply_undistortion(images[0], K, dist)
    
    if img_orig is not None:
        fig, axes = plt.subplots(1, 2, figsize=(14, 6))
        fig.suptitle('Corrección de Distorsión', fontsize=14)
        
        axes[0].imshow(cv2.cvtColor(img_orig, cv2.COLOR_BGR2RGB))
        axes[0].set_title('Original (con distorsión)', fontsize=12)
        axes[0].axis('off')
        
        axes[1].imshow(cv2.cvtColor(img_undist, cv2.COLOR_BGR2RGB))
        axes[1].set_title('Corregida (sin distorsión)', fontsize=12)
        axes[1].axis('off')
        
        plt.tight_layout()
        plt.savefig('../media/05_undistortion_comparison.png', dpi=150, bbox_inches='tight')
        plt.show()
        print("Guardado: media/05_undistortion_comparison.png")

# ─────────────────────────────────────────────
# VISUALIZAR PARÁMETROS DE DISTORSIÓN
# ─────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(10, 6))

params = ['k1', 'k2', 'p1', 'p2', 'k3']
values = dist.flatten()[:5]
colors = ['steelblue' if v >= 0 else 'salmon' for v in values]

bars = ax.bar(params, values, color=colors, edgecolor='black', linewidth=0.8)
ax.axhline(0, color='black', linewidth=0.8, linestyle='--')
ax.set_title('Coeficientes de Distorsión de la Lente', fontsize=13)
ax.set_ylabel('Valor del coeficiente')
ax.grid(True, axis='y', alpha=0.3)

for bar, val in zip(bars, values):
    ax.text(bar.get_x() + bar.get_width()/2., bar.get_height() + 0.001,
            f'{val:.5f}', ha='center', va='bottom', fontsize=9)

plt.tight_layout()
plt.savefig('../media/05_distortion_coefficients.png', dpi=150, bbox_inches='tight')
plt.show()
print("Guardado: media/05_distortion_coefficients.png")
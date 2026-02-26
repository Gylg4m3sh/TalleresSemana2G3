
# Taller - Modelo de Cámara Pinhole y Calibración

## Objetivo del taller

Implementar el modelo matemático de cámara pinhole, comprender parámetros intrínsecos y extrínsecos, y realizar calibración de cámara usando patrones de ajedrez. Aplicar corrección de distorsión y proyecciones 3D a 2D.

---

## Actividades por entorno

Este taller se desarrolla principalmente en **Python** con OpenCV y en **Three.js**.

---

### Python (OpenCV y NumPy)

**Herramientas necesarias:**
- `opencv-python`
- `numpy`
- `matplotlib`

**Pasos a implementar:**

1. **Modelo de cámara pinhole desde cero:**
   - Implementar proyección perspectiva básica
   - Ecuaciones: `x' = f * X/Z`, `y' = f * Y/Z`
   - Crear función de proyección 3D → 2D
   - Visualizar cubos 3D proyectados a 2D
   - Aplicar diferentes distancias focales

2. **Parámetros intrínsecos:**
   - Matriz intrínseca K (3x3):
     ```
     [fx  0  cx]
     [0  fy  cy]
     [0   0   1]
     ```
   - fx, fy: focal length en píxeles
   - cx, cy: principal point (centro de imagen)
   - Experimentar con diferentes valores
   - Visualizar efecto en proyección

3. **Parámetros extrínsecos:**
   - Matriz de rotación R (3x3)
   - Vector de traslación t (3x1)
   - Transformar puntos del mundo a cámara
   - Componer transformaciones
   - Simular movimiento de cámara

4. **Calibración de cámara con patrón:**
   - Imprimir o usar patrón de ajedrez digital
   - Capturar múltiples imágenes del patrón (10-20)
   - Detectar esquinas: `cv2.findChessboardCorners()`
   - Calibrar: `cv2.calibrateCamera()`
   - Extraer matriz intrínseca y coeficientes de distorsión
   - Guardar parámetros de calibración

5. **Corrección de distorsión:**
   - Aplicar `cv2.undistort()` con parámetros calculados
   - Comparar imagen original vs sin distorsión
   - Visualizar lado a lado
   - Analizar mejora en líneas rectas

6. **Validación de calibración:**
   - Reproyectar puntos 3D conocidos
   - Calcular error de reproyección
   - Visualizar puntos reproyectados vs reales
   - Evaluar calidad de calibración

**Bonus:**
- Implementar calibración estéreo (dos cámaras)
- Calcular mapa de profundidad desde estéreo
- Aplicar a realidad aumentada simple

---

### Three.js (Opcional)

**Escenario:**

- Crear escena 3D con objetos conocidos
- Implementar PerspectiveCamera con parámetros configurables
- Función para convertir coordenadas 3D a 2D de pantalla
- Visualizar frustum de cámara
- Simular distorsión de lente radial
- Crear herramienta interactiva para ajustar parámetros

---

## Entrega

Crear carpeta con el nombre: `semana_2_3_camara_pinhole_calibracion` en tu repositorio de GitLab.

Dentro de la carpeta, crear la siguiente estructura:

```
semana_2_3_camara_pinhole_calibracion/
├── python/
├── threejs/  # Si se implementa
├── media/  # Imágenes, videos, GIFs de resultados
├── calibration_images/  # Imágenes del patrón de ajedrez
└── README.md
```

### Requisitos del README.md

El archivo `README.md` debe contener obligatoriamente:

1. **Título del taller**: Taller Camara Pinhole Calibracion
2. **Nombre del estudiante**
3. **Fecha de entrega**
4. **Descripción breve**: Explicación del objetivo y lo desarrollado
5. **Implementaciones**: Descripción de cada implementación realizada por entorno
6. **Resultados visuales**:
   - **Imágenes, videos o GIFs** que muestren el funcionamiento
   - Deben estar en la carpeta `media/` y referenciados en el README
   - Mínimo 2 capturas/GIFs por implementación
7. **Código relevante**: Snippets importantes o enlaces al código
8. **Prompts utilizados**: Descripción de prompts usados (si aplicaron IA generativa)
9. **Aprendizajes y dificultades**: Reflexión personal sobre el proceso

### Estructura de carpetas

- Cada entorno de desarrollo debe tener su propia subcarpeta (`python/`, `unity/`, `threejs/`, etc.)
- La carpeta `media/` debe contener todos los recursos visuales (imágenes, GIFs, videos)
- Nombres de archivos en minúsculas, sin espacios (usar guiones bajos o guiones medios)

---

## Criterios de evaluación

- Cumplimiento de los objetivos del taller
- Código limpio, comentado y bien estructurado
- README.md completo con toda la información requerida
- Evidencias visuales claras (imágenes/GIFs/videos en carpeta `media/`)
- Repositorio organizado siguiendo la estructura especificada
- Commits descriptivos en inglés
- Nombre de carpeta correcto: `semana_2_3_camara_pinhole_calibracion`
- Implementación correcta del modelo pinhole
- Calibración exitosa con error de reproyección bajo
- Corrección de distorsión visible y efectiva
- Documentación clara de parámetros obtenidos

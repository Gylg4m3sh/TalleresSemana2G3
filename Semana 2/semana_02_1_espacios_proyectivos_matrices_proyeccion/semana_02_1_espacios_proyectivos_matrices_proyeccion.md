# 🧠 Taller 57 - Espacios Proyectivos y Matrices de Proyección

## Objetivo del Taller

Comprender y aplicar los conceptos fundamentales de **geometría proyectiva** y el uso de **matrices de proyección** para representar escenas tridimensionales en un plano bidimensional, base esencial del pipeline gráfico moderno.

---

## 📘 Contenidos Clave

- Fundamentos de espacios proyectivos y coordenadas homogéneas.
- Diferencia entre geometría euclidiana, afín y proyectiva.
- Matrices de proyección ortogonal y perspectiva.
- Simulación de la cámara en sistemas gráficos.

---

## Actividades

### 1. Python: Visualización y Cálculo de Proyección

**Herramientas:** `matplotlib`, `numpy`

- Representar puntos en 3D con coordenadas homogéneas.
- Implementar matrices de proyección ortogonal y perspectiva.
- Mostrar gráficamente el efecto de aplicar cada matriz sobre un conjunto de puntos.
- Probar cómo la variación de la distancia focal afecta la proyección perspectiva.

```python
import numpy as np

def proyectar_perspectiva(puntos, d=1.0):
 P = np.array([
 [1, 0, 0, 0],
 [0, 1, 0, 0],
 [0, 0, 1, 0],
 [0, 0, 1/d, 0]
 ])
 puntos_hom = np.vstack((puntos, np.ones((1, puntos.shape[1]))))
 proy = P @ puntos_hom
 proy /= proy[-1, :]
 return proy[:-1]

# Generar puntos y proyectar
````

---

### 2. Unity (Opcional)

**Escenario:**

* Crear una escena simple con varios cubos alineados en Z.
* Visualizar la diferencia entre una cámara con proyección ortográfica y una con perspectiva.
* Capturar los efectos del ángulo de campo y el plano cercano/lejos.

---

### 3. Three.js con React Three Fiber

**Escenario:**

* Crear una escena con tres objetos posicionados a diferentes profundidades.
* Implementar una **cámara ortográfica** y una **perspectiva**, con botones o controles para cambiar entre ellas.
* Usar `OrbitControls` para permitir navegación libre alrededor de los objetos.
* Mostrar cómo cambia la percepción de la profundidad con cada cámara.

📦 Puedes usar la librería `@react-three/drei` para integrar fácilmente `OrbitControls`.

```tsx
import { OrbitControls, PerspectiveCamera, OrthographicCamera } from '@react-three/drei'
```

---

### 4. 🎨 Processing (2D/3D)

* Crear un entorno 3D básico con objetos en el eje Z.
* Simular el cambio de cámara con `perspective()` y `ortho()`.

---

## Entrega

Crear carpeta con el nombre: `semana_2_1_espacios_proyectivos_matrices_proyeccion` en tu repositorio de GitLab.

Dentro de la carpeta, crear la siguiente estructura:

```
semana_2_1_espacios_proyectivos_matrices_proyeccion/
├── python/
├── unity/
├── threejs/
├── media/ # Imágenes, videos, GIFs de resultados
└── README.md
```

### Requisitos del README.md

El archivo `README.md` debe contener obligatoriamente:

1. **Título del taller**: Taller Espacios Proyectivos Matrices Proyeccion
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
- Nombre de carpeta correcto: `semana_2_1_espacios_proyectivos_matrices_proyeccion`

## 📄 Contenido del `README.md`

* Explicación breve de cada tipo de proyección.
* Comparación visual entre ortogonal y perspectiva.
* GIFs, capturas o videos que muestren las diferencias y el uso de `OrbitControls`.

---

## Criterios de Evaluación

 Aplicación correcta de las proyecciones
 Comparación gráfica entre métodos
 Uso de `OrbitControls` en Three.js
 Código documentado
 README claro con visualizaciones
 Organización en carpetas por entorno

---

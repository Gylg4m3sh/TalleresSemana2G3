
# Taller - Proyecciones 3D: Cómo ve una Cámara Virtual

## Objetivo del taller

Entender cómo se genera una escena tridimensional desde el punto de vista de una cámara, explorando los efectos de proyección en perspectiva y ortográfica. El propósito es visualizar cómo los cambios en la cámara afectan directamente la representación en pantalla, y comprender el papel de las matrices de proyección.

---

## Actividades por entorno

Este taller puede desarrollarse en **Unity** o **Three.js con React Three Fiber**. Se recomienda observar comparativamente los modos de cámara y su impacto visual.

---

### Unity (versión LTS) – Ejemplo práctico

**Escenario:**

- Crear una escena con varios objetos (`Cube`, `Sphere`, `Plane`) distribuidos en diferentes profundidades (Z).
- Agregar una **Cámara** (`Camera`) con proyección en **modo perspectiva**.
- Añadir un botón o `Slider` que permita cambiar a **modo ortográfico** y ajustar su `Size`.
- Mostrar visualmente cómo cambian las proporciones y ángulos al cambiar de modo.
- *Opcional:* Mostrar en consola la matriz de proyección con `camera.projectionMatrix`.

**Objetivo visual claro:** comparar deformaciones visuales entre cámaras perspectiva y ortográfica.

---

### Three.js con React Three Fiber – Escenario replicable

**Escenario:**

- Crear una escena básica con varios `<Box />` o `<Sphere />` distribuidos a diferentes distancias del usuario.
- Usar una `<PerspectiveCamera>` y un `<OrthographicCamera>`, alternables con un botón o estado React.
- Utilizar `OrbitControls` para permitir manipulación de la cámara en tiempo real.
- Mostrar información textual en pantalla:
 - Tipo de cámara activa.
 - Valores de `fov`, `aspect`, `near`, `far` (para perspectiva).
 - Tamaños de `left`, `right`, `top`, `bottom` (para ortográfica).
- *Bonus:* Mostrar cómo una posición en coordenadas 3D se transforma hasta el plano 2D usando `Vector3.project(camera)`.

---

## Entrega

Crear carpeta con el nombre: `semana_2_2_proyecciones_camara_virtual` en tu repositorio de GitLab.

Dentro de la carpeta, crear la siguiente estructura:

```
semana_2_2_proyecciones_camara_virtual/
├── unity/
├── threejs/
├── media/ # Imágenes, videos, GIFs de resultados
└── README.md
```

### Requisitos del README.md

El archivo `README.md` debe contener obligatoriamente:

1. **Título del taller**: Taller Proyecciones Camara Virtual
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
- Nombre de carpeta correcto: `semana_2_2_proyecciones_camara_virtual`

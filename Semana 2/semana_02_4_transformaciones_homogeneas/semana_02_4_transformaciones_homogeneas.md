
# Taller - Transformaciones Homogéneas y Cambios de Base

## Objetivo del taller

Aplicar transformaciones homogéneas en coordenadas 2D y 3D, comprender la composición de transformaciones, realizar cambios de base entre sistemas de referencia, y aplicar estos conceptos en robótica y gráficos por computador.

---

## Actividades por entorno

Este taller puede desarrollarse en **Python**, **Unity** y **Three.js**.

---

### Python (NumPy y Matplotlib)

**Herramientas necesarias:**
- `numpy`
- `matplotlib`
- `scipy` (opcional)

**Pasos a implementar:**

1. **Coordenadas homogéneas en 2D:**
   - Representar puntos 2D en coordenadas homogéneas (x, y, 1)
   - Crear matrices de transformación 3x3:
     - Traslación
     - Rotación
     - Escalamiento
     - Reflexión
   - Aplicar transformaciones a conjunto de puntos
   - Visualizar resultado con matplotlib

2. **Composición de transformaciones:**
   - Crear secuencia de transformaciones
   - Multiplicar matrices en orden correcto
   - Demostrar que el orden importa (no conmutativo)
   - Aplicar transformación compuesta
   - Comparar con aplicar transformaciones secuencialmente

3. **Coordenadas homogéneas en 3D:**
   - Representar puntos 3D (x, y, z, 1)
   - Matrices 4x4 para transformaciones 3D
   - Implementar todas las transformaciones básicas
   - Visualizar cubo transformado en 3D

4. **Cambios de base:**
   - Definir múltiples sistemas de coordenadas
   - Calcular matriz de cambio de base
   - Transformar puntos entre sistemas
   - Visualizar múltiples marcos de referencia
   - Aplicar en cadenas cinemáticas

5. **Transformaciones inversas:**
   - Calcular inversa de matriz de transformación
   - Verificar: T * T^(-1) = I
   - Aplicar transformación y luego su inversa
   - Uso en "deshacer" transformaciones

6. **Aplicación en robótica:**
   - Modelar brazo robótico con múltiples articulaciones
   - Cada articulación tiene su sistema de referencia
   - Calcular forward kinematics con transformaciones
   - Transformar de espacio de articulación a espacio del mundo
   - Visualizar cadena cinemática

**Ejemplo de matriz de traslación 3D:**
```python
def translation_matrix(tx, ty, tz):
    return np.array([
        [1, 0, 0, tx],
        [0, 1, 0, ty],
        [0, 0, 1, tz],
        [0, 0, 0, 1]
    ])
```

---

### Unity

**Escenario:**

- Crear jerarquía de GameObjects (padre-hijo)
- Usar Transform.localPosition vs Transform.position
- Implementar script para visualizar sistemas de coordenadas
- Dibujar ejes X, Y, Z de cada objeto
- Crear transformaciones programáticas con Matrix4x4
- Aplicar a animación de robot o vehículo

**Ejemplo:**
```csharp
Matrix4x4 translation = Matrix4x4.Translate(new Vector3(1, 0, 0));
Matrix4x4 rotation = Matrix4x4.Rotate(Quaternion.Euler(0, 45, 0));
Matrix4x4 composite = translation * rotation; // Orden importa
```

---

### Three.js con React Three Fiber

**Escenario:**

- Crear objetos 3D anidados con transformaciones
- Usar THREE.Matrix4 para transformaciones manuales
- Crear sistema de coordenadas local vs global
- Implementar composición de transformaciones
- Visualizar matriz de transformación de objetos
- Aplicar en animación o control de cámara

**Ejemplo:**
```javascript
const matrix = new THREE.Matrix4();
matrix.makeTranslation(1, 0, 0);
matrix.multiply(new THREE.Matrix4().makeRotationY(Math.PI / 4));
object.applyMatrix4(matrix);
```

---

## Entrega

Crear carpeta con el nombre: `semana_2_4_transformaciones_homogeneas` en tu repositorio de GitLab.

Dentro de la carpeta, crear la siguiente estructura:

```
semana_2_4_transformaciones_homogeneas/
├── python/
├── unity/
├── threejs/
├── media/  # Imágenes, videos, GIFs de resultados
└── README.md
```

### Requisitos del README.md

El archivo `README.md` debe contener obligatoriamente:

1. **Título del taller**: Taller Transformaciones Homogeneas
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
- Nombre de carpeta correcto: `semana_2_4_transformaciones_homogeneas`
- Implementación correcta de matrices homogéneas 2D y 3D
- Composición correcta de transformaciones
- Cambios de base funcionando correctamente
- Aplicación en robótica o gráficos demostrada
- Visualización clara de sistemas de coordenadas múltiples

# Taller Transformaciones Homogeneas

 Grupo 3  
 
 27/02/26  

## Descripcion breve

En este taller se aplican conceptos clave de transformaciones homogeneas en 2D y 3D: composicion de transformaciones (y su no conmutatividad), cambios de base entre sistemas de referencia, y ejemplos de uso en robotica y graficos por computador. Se desarrollaron dos implementaciones: una en **Python** con NumPy y Matplotlib, y otra en **Three.js** con React Three Fiber.

La version inicial de Three.js mostraba cubos con matrices y un brazo robotico simple; posteriormente se solicito a **Kimi AI** ayuda para hacer la presentacion mas atractiva e interactiva. El resultado supero las expectativas, anadiendo multiples mejoras visuales y de interaccion — puede verse ejecutando `npm install` y luego `npm run dev` en la carpeta `app` dentro de `treejs`.

---

## Implementaciones

### Python (NumPy y Matplotlib)

Se creo un unico script (`main.py`) que cubre los puntos exigidos en el taller:

1. **Coordenadas homogeneas en 2D**  
   - Se implementaron funciones para generar matrices de traslacion, rotacion, escalado y reflexion.  
   - Se aplicaron a un triangulo y se visualizo el resultado con Matplotlib.  
   - La imagen generada se guarda como `media/transformacion_2d.png`.

2. **Composicion de transformaciones**  
   - Se demostro que el orden importa comparando `R·T` vs `T·R`.  
   - Se genero una figura con dos subplots (`media/composicion_orden.png`).

3. **Transformaciones en 3D**  
   - Se construyeron matrices 4x4 para traslacion, rotacion (alrededor de X, Y, Z) y escalado.  
   - Se visualizo un cubo original y otro transformado en 3D (`media/cubo_3d.png`).

4. **Cambios de base**  
   - Se definieron dos sistemas de coordenadas (mundo y camara).  
   - Se calculo la matriz de cambio de base y se transformo un punto.  
   - Se mostraron los ejes de ambos sistemas en una grafica (`media/cambio_base.png`).

5. **Transformaciones inversas**  
   - Se calculo la inversa de una matriz compuesta y se comprobo que `T · T⁻¹ = I`.  
   - El error numerico (muy cercano a cero) se imprime por consola.

6. **Aplicacion en robotica**  
   - Se modeló un brazo de dos eslabones usando cinematica directa.  
   - Se visualizo la cadena cinematica (`media/brazo_robotico.png`).

Todas las imagenes se guardan automaticamente en la carpeta `media/` al ejecutar `python main.py`.

### Three.js (React Three Fiber)

**Version inicial** (antes de la mejora con IA):
- Dos cubos que ilustran la no conmutatividad aplicando matrices manualmente (`T·R` y `R·T`), cada uno con su matriz de transformacion mostrada como texto 3D.
- Un brazo robotico jerarquico de tres articulaciones (base, hombro, codo) con ejes de coordenadas locales visibles (rojo X, verde Y, azul Z).
- Un componente `CoordinateAxes` para dibujar los ejes en cada objeto.

**Mejoras solicitadas a Kimi AI**:
Se le pidio al agente que ayudara a hacer la presentacion mas atractiva y mejor organizada, para que el usuario pudiera interactuar facilmente con las transformaciones. La IA propuso e implemento las siguientes mejoras, superando con creces lo esperado y generando el codigo extenso que se entrega.

La idea era que el usuario pudiera experimentar directamente con las transformaciones, observar como cada rotacion afecta la posicion del efector final y comprender visualmente los cambios de base. La aplicacion final es interactiva, profesional y didactica, superando los requisitos basicos del taller y lo que se habia hecho previamente sin ayuda de la IA.

Agente utilizado: **Kimi AI**

---

## Codigo relevante

### Python (fragmentos)

```python
# Matriz de traslacion 2D
def traslacion(tx, ty):
    return np.array([[1, 0, tx],
                     [0, 1, ty],
                     [0, 0, 1]])

# Matriz de rotacion 2D
def rotacion(angulo_rad):
    c, s = np.cos(angulo_rad), np.sin(angulo_rad)
    return np.array([[c, -s, 0],
                     [s,  c, 0],
                     [0,  0, 1]])

# Composicion (R luego T vs T luego R)
RT = T @ R
TR = R @ T
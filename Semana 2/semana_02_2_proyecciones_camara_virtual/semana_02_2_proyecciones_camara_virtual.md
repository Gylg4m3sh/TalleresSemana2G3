# Computación Visual Semana 1

## Info
- Taller Proyecciones Camara Virtual
- Integrantes
    - Forero Narvaez, Melissa Dayanna
    - GALINDO GONZÁLEZ, ANDRÉS FELIPE
    - Garcia Martiquet, Stephan Alain Roland
    - Herrera Rivera, Jose Arturo
    - Lopez Bustos, Juan Camilo
    - Martinez Martinez, Oscar Javier
- 25/02/2025

## Descripción:
Este taller tuvo como objetivo comprender cómo se genera y representa una escena tridimensional desde el punto de vista de una cámara, comparando proyección perspectiva y ortográfica. Se buscó analizar visualmente cómo los cambios en la configuración de la cámara afectan la percepción de profundidad y proporciones. Además, permitió relacionar estos efectos con el papel matemático de la matriz de proyección.


## Implementaciones:
Se desarrolló una escena en Unity con varios objetos 3D ubicados a distintas profundidades en el eje Z para analizar visualmente las diferencias entre proyección perspectiva y ortográfica. Se configuró una cámara principal inicialmente en modo perspectiva y se implementó un botón en la interfaz que permite alternar dinámicamente entre ambos modos.Tambien se creó un script para cumplir con los requisitos propuestos.

## Resultados visuales:
En la carpeta /media se incluyen los siguientes resultados visuales:
- Imagen consola
- Imagen vista ortográfica
- Imagen vista perspectiva
- Gif del funcionamiento

## Código relevante: Snippets importantes o enlaces al código
Cambio de proyección se hace con
```
cam.orthographic = !cam.orthographic;
```

Ajuste del tamaño en modo ortográfico
```
cam.orthographicSize = 5f;
```

## Aprendizajes y dificultades
En este taller comprendimos mejor cómo la matriz de proyección afecta directamente la representación visual de una escena 3D y cómo la diferencia entre perspectiva y ortográfica no es solo visual sino matemática. Aprendimos a manipular las propiedades de la cámara desde código. La principal dificultad fue entender cómo funciona internamente la proyección ortográfica, especialmente el significado de orthographicSize y cómo impacta el volumen visible, además de relacionar la teoría de matrices con lo que realmente se observa en pantalla.
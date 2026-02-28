# Transformaciones Homogéneas 3D

Aplicación interactiva para visualizar transformaciones homogéneas en 2D y 3D usando React y Three.js.

## Características

- **Transformaciones**: Traslación, rotación y escala en tiempo real
- **Composición**: Encadenar múltiples transformaciones y ver el resultado
- **Brazo Robot**: Cinemática directa con 4 articulaciones controlables
- **Sistemas de Coordenadas**: Visualización de múltiples marcos de referencia

## Tecnologías

- React 18 + TypeScript
- Three.js + React Three Fiber
- Tailwind CSS + shadcn/ui
- Vite

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173)

## Build

```bash
npm run build
```

Los archivos se generan en la carpeta `dist/`.

## Prompt Utilizado

Para mejorar código existente y llegar a este resultado:

> "Help me do this, using react and node for the three js part, i need it like it was almost all made by a human, and it to be functional"

Luego se solicitó:
> "make it in spanish please, and dont put the definitions of everything at the bottom, remove what seem unnecesary, do all in spanish, dont put hundreds of comments just the bare minimum in each file"

## Estructura

```
src/
├── components/
│   ├── three/           # Escena 3D, brazo robot, objetos transformables
│   └── ui-custom/       # Controles, visualización de matrices
├── lib/
│   └── transformations.ts  # Funciones matemáticas
├── types/
│   └── index.ts         # Tipos TypeScript
└── App.tsx              # App principal
```

## Autor

Desarrollado por el grupo 3 usando IA Generativa a partir de archivos dados a la propia ia y al agente de KIMI IA

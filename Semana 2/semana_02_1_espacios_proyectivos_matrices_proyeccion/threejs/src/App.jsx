import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, OrthographicCamera, OrbitControls } from '@react-three/drei'
import Scene from './components/Scene'
import './App.css'

const CAM_POSITION = [0, 3, 14]
const CAM_TARGET   = [0, 0, 0]

export default function App() {
  const [camType, setCamType] = useState('perspective')
  const isPerspective = camType === 'perspective'

  return (
    <div className="app-wrapper">
      <div className="ui-panel">
        <h2 className="ui-title">Proyección</h2>

        <div className="btn-group">
          <button
            className={isPerspective ? 'cam-btn active' : 'cam-btn'}
            onClick={() => setCamType('perspective')}
          >
            Perspectiva
          </button>
          <button
            className={!isPerspective ? 'cam-btn active' : 'cam-btn'}
            onClick={() => setCamType('orthographic')}
          >
            Ortográfica
          </button>
        </div>

        <div className="ui-desc">
          {isPerspective
            ? '📐 Proyección cónica — objetos lejanos se ven más pequeños.'
            : '📏 Proyección paralela — tamaño independiente de la profundidad.'}
        </div>

        <ul className="legend">
          <li><span className="dot blue" />  Caja&nbsp;&nbsp;&nbsp;— z = −6 (lejana)</li>
          <li><span className="dot red"  />  Esfera — z =  0 (media)</li>
          <li><span className="dot green"/>  Torus  — z = +6 (cercana)</li>
        </ul>
      </div>

      <Canvas>
        <PerspectiveCamera
          makeDefault={isPerspective}
          fov={60}
          near={0.1}
          far={1000}
          position={CAM_POSITION}
        />
        <OrthographicCamera
          makeDefault={!isPerspective}
          zoom={50}
          near={0.1}
          far={1000}
          position={CAM_POSITION}
        />

        <OrbitControls
          key={camType}
          target={CAM_TARGET}
          enablePan
          enableZoom
          enableRotate
        />

        <Scene />
      </Canvas>

    </div>
  )
}

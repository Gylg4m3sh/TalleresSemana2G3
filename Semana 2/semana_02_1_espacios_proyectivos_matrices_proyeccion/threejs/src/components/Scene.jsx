import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Grid } from '@react-three/drei'

function AnimatedMesh({ children, speed = 0.4 }) {
  const ref = useRef()
  useFrame((_, delta) => {
    ref.current.rotation.y += delta * speed
    ref.current.rotation.x += delta * speed * 0.5
  })
  return <mesh ref={ref}>{children}</mesh>
}

export default function Scene() {
  return (
    <>
      {/* iluminación */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
      <pointLight position={[-10, -5, -5]} intensity={0.6} color="#aae" />

      <Grid
        position={[0, -2.5, 0]}
        args={[40, 40]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#444"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#666"
        fadeDistance={60}
        fadeStrength={1}
        infiniteGrid
      />

      {/* ── objeto lejano: caja ── z = -6 */}
      <AnimatedMesh speed={0.3}>
        <mesh position={[-2.5, 0, -6]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#4f8ef7" metalness={0.3} roughness={0.4} />
        </mesh>
      </AnimatedMesh>

      {/* ── objeto medio: esfera ── z = 0 */}
      <AnimatedMesh speed={0.5}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1.2, 64, 64]} />
          <meshStandardMaterial color="#f75f5f" metalness={0.2} roughness={0.3} />
        </mesh>
      </AnimatedMesh>

      {/* ── objeto cercano: torus ── z = 6 */}
      <AnimatedMesh speed={0.7}>
        <mesh position={[2.5, 0, 6]}>
          <torusGeometry args={[1.1, 0.42, 32, 64]} />
          <meshStandardMaterial color="#4ecb71" metalness={0.2} roughness={0.35} />
        </mesh>
      </AnimatedMesh>
    </>
  )
}

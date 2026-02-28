import * as THREE from 'three';
import { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid } from '@react-three/drei';
import { CoordinateSystem } from './CoordinateSystem';
import { TransformableObject, TransformationLines } from './TransformableObject';
import { RoboticArm } from './RoboticArm';
import type { JointConfig } from '@/types';

interface Scene3DProps {
  mode: 'transformations' | 'robot' | 'coordinates';
  transformMatrix?: THREE.Matrix4;
  joints?: JointConfig[];
  showOriginal?: boolean;
  showLines?: boolean;
  coordinateMatrices?: THREE.Matrix4[];
}

function Scene({
  mode,
  transformMatrix,
  joints,
  showOriginal,
  showLines,
  coordinateMatrices,
}: Scene3DProps) {
  const controlsRef = useRef<any>(null);

  return (
    <>
      <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />
      <OrbitControls 
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={20}
      />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <CoordinateSystem size={3} name="Mundo" />
      
      <Grid
        position={[0, -0.01, 0]}
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#374151"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#4b5563"
        fadeDistance={25}
        fadeStrength={1}
        infiniteGrid={false}
      />
      
      {mode === 'transformations' && transformMatrix && (
        <TransformationsScene 
          matrix={transformMatrix} 
          showOriginal={showOriginal}
          showLines={showLines}
        />
      )}
      
      {mode === 'robot' && joints && (
        <RobotScene joints={joints} />
      )}
      
      {mode === 'coordinates' && coordinateMatrices && (
        <CoordinatesScene matrices={coordinateMatrices} />
      )}
    </>
  );
}

function TransformationsScene({
  matrix,
  showOriginal,
  showLines,
}: {
  matrix: THREE.Matrix4;
  showOriginal?: boolean;
  showLines?: boolean;
}) {
  return (
    <group>
      <TransformableObject 
        matrix={matrix} 
        showOriginal={showOriginal}
        color="#8b5cf6"
      />
      
      {showLines && <TransformationLines matrix={matrix} />}
      
      <CoordinateSystem 
        size={1.5} 
        matrix={matrix} 
        name="Transformado"
        lineWidth={3}
      />
    </group>
  );
}

function RobotScene({ joints }: { joints: JointConfig[] }) {
  return (
    <group>
      <RoboticArm 
        joints={joints}
        showCoordinates={true}
        showJointLabels={true}
      />
    </group>
  );
}

function CoordinatesScene({ matrices }: { matrices: THREE.Matrix4[] }) {
  return (
    <group>
      {matrices.map((matrix, index) => (
        <CoordinateSystem
          key={index}
          size={1.5}
          matrix={matrix}
          name={`S${index + 1}`}
          lineWidth={2}
        />
      ))}
    </group>
  );
}

export function Scene3D(props: Scene3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Scene3D;

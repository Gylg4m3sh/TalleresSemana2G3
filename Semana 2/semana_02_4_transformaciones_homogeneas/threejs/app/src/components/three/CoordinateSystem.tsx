import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { Text } from '@react-three/drei';

interface CoordinateSystemProps {
  size?: number;
  matrix?: THREE.Matrix4;
  name?: string;
  showLabels?: boolean;
  lineWidth?: number;
}

export function CoordinateSystem({
  size = 2,
  matrix = new THREE.Matrix4().identity(),
  name = '',
  showLabels = true,
  lineWidth = 2,
}: CoordinateSystemProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const { origin, xEnd, yEnd, zEnd } = useMemo(() => {
    const origin = new THREE.Vector3(0, 0, 0).applyMatrix4(matrix);
    const xEnd = new THREE.Vector3(size, 0, 0).applyMatrix4(matrix);
    const yEnd = new THREE.Vector3(0, size, 0).applyMatrix4(matrix);
    const zEnd = new THREE.Vector3(0, 0, size).applyMatrix4(matrix);
    return { origin, xEnd, yEnd, zEnd };
  }, [matrix, size]);

  const xLineGeo = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints([origin, xEnd]);
  }, [origin, xEnd]);

  const yLineGeo = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints([origin, yEnd]);
  }, [origin, yEnd]);

  const zLineGeo = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints([origin, zEnd]);
  }, [origin, zEnd]);

  return (
    <group ref={groupRef}>
      <primitive object={new THREE.Line(xLineGeo, new THREE.LineBasicMaterial({ color: '#ef4444', linewidth: lineWidth }))} />
      <primitive object={new THREE.Line(yLineGeo, new THREE.LineBasicMaterial({ color: '#22c55e', linewidth: lineWidth }))} />
      <primitive object={new THREE.Line(zLineGeo, new THREE.LineBasicMaterial({ color: '#3b82f6', linewidth: lineWidth }))} />

      <mesh position={[origin.x, origin.y, origin.z]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {showLabels && (
        <>
          <Text
            position={[xEnd.x + 0.2, xEnd.y, xEnd.z]}
            fontSize={0.2}
            color="#ef4444"
            anchorX="left"
          >
            X{name ? ` (${name})` : ''}
          </Text>
          <Text
            position={[yEnd.x, yEnd.y + 0.2, yEnd.z]}
            fontSize={0.2}
            color="#22c55e"
            anchorY="bottom"
          >
            Y
          </Text>
          <Text
            position={[zEnd.x, zEnd.y, zEnd.z + 0.2]}
            fontSize={0.2}
            color="#3b82f6"
          >
            Z
          </Text>
        </>
      )}
    </group>
  );
}

interface GridHelperProps {
  size?: number;
  divisions?: number;
  matrix?: THREE.Matrix4;
}

export function GridHelper({
  size = 10,
  divisions = 10,
  matrix = new THREE.Matrix4().identity(),
}: GridHelperProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const lines = useMemo(() => {
    const lineArray: Array<THREE.Line> = [];
    const step = size / divisions;
    const halfSize = size / 2;
    const material = new THREE.LineBasicMaterial({ color: '#374151', transparent: true, opacity: 0.3 });
    
    for (let i = 0; i <= divisions; i++) {
      const pos = -halfSize + i * step;
      
      const startX = new THREE.Vector3(-halfSize, 0, pos).applyMatrix4(matrix);
      const endX = new THREE.Vector3(halfSize, 0, pos).applyMatrix4(matrix);
      const geoX = new THREE.BufferGeometry().setFromPoints([startX, endX]);
      lineArray.push(new THREE.Line(geoX, material));
      
      const startZ = new THREE.Vector3(pos, 0, -halfSize).applyMatrix4(matrix);
      const endZ = new THREE.Vector3(pos, 0, halfSize).applyMatrix4(matrix);
      const geoZ = new THREE.BufferGeometry().setFromPoints([startZ, endZ]);
      lineArray.push(new THREE.Line(geoZ, material));
    }
    
    return lineArray;
  }, [size, divisions, matrix]);

  return (
    <group ref={groupRef}>
      {lines.map((line, index) => (
        <primitive key={index} object={line} />
      ))}
    </group>
  );
}

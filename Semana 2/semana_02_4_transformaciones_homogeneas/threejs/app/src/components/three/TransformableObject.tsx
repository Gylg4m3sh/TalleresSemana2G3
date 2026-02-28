import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

interface TransformableObjectProps {
  matrix: THREE.Matrix4;
  originalVertices?: THREE.Vector3[];
  color?: string;
  wireframe?: boolean;
  showOriginal?: boolean;
}

const defaultCubeVertices: THREE.Vector3[] = [
  new THREE.Vector3(-0.5, -0.5, -0.5),
  new THREE.Vector3(0.5, -0.5, -0.5),
  new THREE.Vector3(0.5, 0.5, -0.5),
  new THREE.Vector3(-0.5, 0.5, -0.5),
  new THREE.Vector3(-0.5, -0.5, 0.5),
  new THREE.Vector3(0.5, -0.5, 0.5),
  new THREE.Vector3(0.5, 0.5, 0.5),
  new THREE.Vector3(-0.5, 0.5, 0.5),
];

const cubeFaces = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [0, 1, 5, 4],
  [2, 3, 7, 6],
  [0, 3, 7, 4],
  [1, 2, 6, 5],
];

export function TransformableObject({
  matrix,
  originalVertices = defaultCubeVertices,
  color = '#8b5cf6',
  wireframe = false,
  showOriginal = true,
}: TransformableObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const originalMeshRef = useRef<THREE.Mesh>(null);
  
  const transformedVertices = useMemo(() => {
    return originalVertices.map(v => v.clone().applyMatrix4(matrix));
  }, [originalVertices, matrix]);
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];
    const indices: number[] = [];
    
    transformedVertices.forEach(v => {
      positions.push(v.x, v.y, v.z);
    });
    
    cubeFaces.forEach(face => {
      indices.push(face[0], face[1], face[2]);
      indices.push(face[0], face[2], face[3]);
    });
    
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    
    return geo;
  }, [transformedVertices]);
  
  const originalGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];
    const indices: number[] = [];
    
    originalVertices.forEach(v => {
      positions.push(v.x, v.y, v.z);
    });
    
    cubeFaces.forEach(face => {
      indices.push(face[0], face[1], face[2]);
      indices.push(face[0], face[2], face[3]);
    });
    
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    
    return geo;
  }, [originalVertices]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group>
      {showOriginal && (
        <mesh ref={originalMeshRef} geometry={originalGeometry}>
          <meshBasicMaterial 
            color="#6b7280" 
            wireframe={true} 
            transparent 
            opacity={0.3}
          />
        </mesh>
      )}
      
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial 
          color={color} 
          wireframe={wireframe}
          transparent
          opacity={0.8}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      
      {transformedVertices.map((v, i) => (
        <mesh key={i} position={[v.x, v.y, v.z]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#fbbf24" />
        </mesh>
      ))}
    </group>
  );
}

export function TransformationLines({
  matrix,
  originalVertices = defaultCubeVertices,
}: Omit<TransformableObjectProps, 'color' | 'wireframe' | 'showOriginal'>) {
  const transformedVertices = useMemo(() => {
    return originalVertices.map(v => v.clone().applyMatrix4(matrix));
  }, [originalVertices, matrix]);
  
  const lines = useMemo(() => {
    const material = new THREE.LineBasicMaterial({ color: '#fbbf24', transparent: true, opacity: 0.5 });
    return originalVertices.map((orig, i) => {
      const geometry = new THREE.BufferGeometry().setFromPoints([orig, transformedVertices[i]]);
      return new THREE.Line(geometry, material);
    });
  }, [originalVertices, transformedVertices]);

  return (
    <group>
      {lines.map((line, index) => (
        <primitive key={index} object={line} />
      ))}
    </group>
  );
}

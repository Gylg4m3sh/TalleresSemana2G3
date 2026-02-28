import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { Text } from '@react-three/drei';
import type { JointConfig } from '@/types';

interface RoboticArmProps {
  joints: JointConfig[];
  showCoordinates?: boolean;
  showJointLabels?: boolean;
}

export function RoboticArm({
  joints,
  showCoordinates = true,
  showJointLabels = true,
}: RoboticArmProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const jointPositions = useMemo(() => {
    const positions: THREE.Vector3[] = [new THREE.Vector3(0, 0, 0)];
    const matrices: THREE.Matrix4[] = [new THREE.Matrix4().identity()];
    
    let currentMatrix = new THREE.Matrix4().identity();
    
    for (let i = 0; i < joints.length; i++) {
      const joint = joints[i];
      const angleRad = (joint.angle * Math.PI) / 180;
      
      let rotationMatrix: THREE.Matrix4;
      switch (joint.axis) {
        case 'x':
          rotationMatrix = new THREE.Matrix4().makeRotationX(angleRad);
          break;
        case 'y':
          rotationMatrix = new THREE.Matrix4().makeRotationY(angleRad);
          break;
        case 'z':
        default:
          rotationMatrix = new THREE.Matrix4().makeRotationZ(angleRad);
          break;
      }
      
      const translationMatrix = new THREE.Matrix4().makeTranslation(joint.length, 0, 0);
      
      currentMatrix.multiply(rotationMatrix);
      currentMatrix.multiply(translationMatrix);
      
      const position = new THREE.Vector3(0, 0, 0).applyMatrix4(currentMatrix);
      positions.push(position);
      matrices.push(currentMatrix.clone());
    }
    
    return { positions, matrices };
  }, [joints]);

  const { positions, matrices } = jointPositions;

  return (
    <group ref={groupRef}>
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.3, 32]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      
      {joints.map((joint, index) => {
        const startPos = positions[index];
        const endPos = positions[index + 1];
        const matrix = matrices[index];
        
        const direction = new THREE.Vector3().subVectors(endPos, startPos).normalize();
        const length = startPos.distanceTo(endPos);
        const midPoint = new THREE.Vector3().addVectors(startPos, endPos).multiplyScalar(0.5);
        
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), direction);
        
        return (
          <group key={joint.id}>
            <mesh position={[startPos.x, startPos.y, startPos.z]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color="#ef4444" />
            </mesh>
            
            {showJointLabels && (
              <Text
                position={[startPos.x, startPos.y + 0.3, startPos.z]}
                fontSize={0.15}
                color="#ffffff"
                anchorX="center"
              >
                {joint.name}: {joint.angle.toFixed(1)}°
              </Text>
            )}
            
            <mesh 
              position={[midPoint.x, midPoint.y, midPoint.z]}
              quaternion={quaternion}
            >
              <boxGeometry args={[length, 0.1, 0.1]} />
              <meshStandardMaterial color="#3b82f6" />
            </mesh>
            
            {showCoordinates && (
              <CoordinateSystemAtMatrix 
                matrix={matrix} 
                size={0.5} 
              />
            )}
          </group>
        );
      })}
      
      {positions.length > 1 && (
        <group>
          <mesh position={[positions[positions.length - 1].x, positions[positions.length - 1].y, positions[positions.length - 1].z]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>
          <Text
            position={[
              positions[positions.length - 1].x, 
              positions[positions.length - 1].y + 0.25, 
              positions[positions.length - 1].z
            ]}
            fontSize={0.12}
            color="#22c55e"
            anchorX="center"
          >
            Efector Final
          </Text>
          <Text
            position={[
              positions[positions.length - 1].x, 
              positions[positions.length - 1].y - 0.25, 
              positions[positions.length - 1].z
            ]}
            fontSize={0.1}
            color="#aaaaaa"
            anchorX="center"
          >
            ({positions[positions.length - 1].x.toFixed(2)}, {positions[positions.length - 1].y.toFixed(2)}, {positions[positions.length - 1].z.toFixed(2)})
          </Text>
        </group>
      )}
    </group>
  );
}

function CoordinateSystemAtMatrix({
  matrix,
  size = 0.5,
}: {
  matrix: THREE.Matrix4;
  size?: number;
}) {
  const origin = useMemo(() => {
    return new THREE.Vector3(0, 0, 0).applyMatrix4(matrix);
  }, [matrix]);
  
  const axes = useMemo(() => {
    const xAxis = new THREE.Vector3(size, 0, 0).applyMatrix4(matrix);
    const yAxis = new THREE.Vector3(0, size, 0).applyMatrix4(matrix);
    const zAxis = new THREE.Vector3(0, 0, size).applyMatrix4(matrix);
    return { xAxis, yAxis, zAxis };
  }, [matrix, size]);

  const xLineGeo = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints([origin, axes.xAxis]);
  }, [origin, axes.xAxis]);

  const yLineGeo = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints([origin, axes.yAxis]);
  }, [origin, axes.yAxis]);

  const zLineGeo = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints([origin, axes.zAxis]);
  }, [origin, axes.zAxis]);

  return (
    <group>
      <primitive object={new THREE.Line(xLineGeo, new THREE.LineBasicMaterial({ color: '#ef4444', linewidth: 2 }))} />
      <primitive object={new THREE.Line(yLineGeo, new THREE.LineBasicMaterial({ color: '#22c55e', linewidth: 2 }))} />
      <primitive object={new THREE.Line(zLineGeo, new THREE.LineBasicMaterial({ color: '#3b82f6', linewidth: 2 }))} />
    </group>
  );
}

import * as THREE from 'three';

export interface TransformParams {
  translation: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

export interface Matrix4x4 {
  elements: number[][];
}

export interface JointConfig {
  id: number;
  name: string;
  angle: number;
  length: number;
  minAngle: number;
  maxAngle: number;
  axis: 'x' | 'y' | 'z';
}

export interface RobotArmState {
  joints: JointConfig[];
  endEffectorPosition: THREE.Vector3;
}

export interface CoordinateSystem {
  name: string;
  matrix: THREE.Matrix4;
  color: string;
}

export type TransformationType = 'translation' | 'rotation' | 'scale' | 'reflection';

export interface TransformationStep {
  id: number;
  type: TransformationType;
  params: Record<string, number>;
  matrix: THREE.Matrix4;
}

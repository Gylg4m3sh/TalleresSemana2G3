import * as THREE from 'three';
import type { TransformParams, TransformationType, TransformationStep } from '@/types';

export function createTranslationMatrix(tx: number, ty: number, tz: number): THREE.Matrix4 {
  const matrix = new THREE.Matrix4();
  matrix.makeTranslation(tx, ty, tz);
  return matrix;
}

export function createRotationXMatrix(angle: number): THREE.Matrix4 {
  const matrix = new THREE.Matrix4();
  matrix.makeRotationX(angle);
  return matrix;
}

export function createRotationYMatrix(angle: number): THREE.Matrix4 {
  const matrix = new THREE.Matrix4();
  matrix.makeRotationY(angle);
  return matrix;
}

export function createRotationZMatrix(angle: number): THREE.Matrix4 {
  const matrix = new THREE.Matrix4();
  matrix.makeRotationZ(angle);
  return matrix;
}

export function createScaleMatrix(sx: number, sy: number, sz: number): THREE.Matrix4 {
  const matrix = new THREE.Matrix4();
  matrix.makeScale(sx, sy, sz);
  return matrix;
}

export function createReflectionMatrix(axis: 'x' | 'y' | 'z' | 'xy' | 'xz' | 'yz'): THREE.Matrix4 {
  const matrix = new THREE.Matrix4();
  switch (axis) {
    case 'x':
      matrix.makeScale(-1, 1, 1);
      break;
    case 'y':
      matrix.makeScale(1, -1, 1);
      break;
    case 'z':
      matrix.makeScale(1, 1, -1);
      break;
    case 'xy':
      matrix.makeScale(-1, -1, 1);
      break;
    case 'xz':
      matrix.makeScale(-1, 1, -1);
      break;
    case 'yz':
      matrix.makeScale(1, -1, -1);
      break;
  }
  return matrix;
}

export function composeTransformations(params: TransformParams): THREE.Matrix4 {
  const translation = createTranslationMatrix(
    params.translation.x,
    params.translation.y,
    params.translation.z
  );
  
  const rotationX = createRotationXMatrix(params.rotation.x);
  const rotationY = createRotationYMatrix(params.rotation.y);
  const rotationZ = createRotationZMatrix(params.rotation.z);
  
  const scale = createScaleMatrix(
    params.scale.x,
    params.scale.y,
    params.scale.z
  );
  
  const result = new THREE.Matrix4();
  result.multiply(translation);
  result.multiply(rotationZ);
  result.multiply(rotationY);
  result.multiply(rotationX);
  result.multiply(scale);
  
  return result;
}

export function applyTransformation(
  vector: THREE.Vector3, 
  matrix: THREE.Matrix4
): THREE.Vector3 {
  return vector.clone().applyMatrix4(matrix);
}

export function matrixToArray(matrix: THREE.Matrix4): number[][] {
  const elements = matrix.elements;
  return [
    [elements[0], elements[4], elements[8], elements[12]],
    [elements[1], elements[5], elements[9], elements[13]],
    [elements[2], elements[6], elements[10], elements[14]],
    [elements[3], elements[7], elements[11], elements[15]],
  ];
}

export function formatMatrixElement(value: number): string {
  if (Math.abs(value) < 0.0001) return '0';
  if (Math.abs(value - Math.round(value)) < 0.0001) {
    return Math.round(value).toString();
  }
  return value.toFixed(3);
}

export function createTransformationStep(
  id: number,
  type: TransformationType,
  params: Record<string, number>
): TransformationStep {
  let matrix: THREE.Matrix4;
  
  switch (type) {
    case 'translation':
      matrix = createTranslationMatrix(params.x || 0, params.y || 0, params.z || 0);
      break;
    case 'rotation':
      matrix = createRotationYMatrix(params.angle || 0);
      break;
    case 'scale':
      matrix = createScaleMatrix(params.x || 1, params.y || 1, params.z || 1);
      break;
    case 'reflection':
      const axis = params.axis === 0 ? 'x' : params.axis === 1 ? 'y' : 'z';
      matrix = createReflectionMatrix(axis);
      break;
    default:
      matrix = new THREE.Matrix4().identity();
  }
  
  return { id, type, params, matrix };
}

export function composeSteps(steps: TransformationStep[]): THREE.Matrix4 {
  const result = new THREE.Matrix4().identity();
  
  for (const step of steps) {
    result.multiply(step.matrix);
  }
  
  return result;
}

export function inverseTransformation(matrix: THREE.Matrix4): THREE.Matrix4 {
  const inverse = new THREE.Matrix4();
  inverse.copy(matrix).invert();
  return inverse;
}

export function verifyInverse(matrix: THREE.Matrix4, inverse: THREE.Matrix4): boolean {
  const product = new THREE.Matrix4();
  product.multiplyMatrices(matrix, inverse);
  
  const identity = new THREE.Matrix4().identity();
  const productArray = matrixToArray(product);
  const identityArray = matrixToArray(identity);
  
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (Math.abs(productArray[i][j] - identityArray[i][j]) > 0.0001) {
        return false;
      }
    }
  }
  return true;
}

export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI);
}

export function calculateForwardKinematics(
  jointAngles: number[],
  jointLengths: number[]
): THREE.Vector3[] {
  const positions: THREE.Vector3[] = [new THREE.Vector3(0, 0, 0)];
  let currentMatrix = new THREE.Matrix4().identity();
  
  for (let i = 0; i < jointAngles.length; i++) {
    const rotation = createRotationZMatrix(jointAngles[i]);
    const translation = createTranslationMatrix(jointLengths[i], 0, 0);
    
    currentMatrix.multiply(rotation);
    currentMatrix.multiply(translation);
    
    const position = new THREE.Vector3(0, 0, 0);
    position.applyMatrix4(currentMatrix);
    positions.push(position);
  }
  
  return positions;
}

export function createChangeOfBasisMatrix(
  newOrigin: THREE.Vector3,
  newXAxis: THREE.Vector3,
  newYAxis: THREE.Vector3,
  newZAxis: THREE.Vector3
): THREE.Matrix4 {
  const matrix = new THREE.Matrix4();
  
  matrix.set(
    newXAxis.x, newYAxis.x, newZAxis.x, newOrigin.x,
    newXAxis.y, newYAxis.y, newZAxis.y, newOrigin.y,
    newXAxis.z, newYAxis.z, newZAxis.z, newOrigin.z,
    0, 0, 0, 1
  );
  
  return matrix;
}

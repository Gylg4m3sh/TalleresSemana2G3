import { useState, useEffect, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Box, 
  Bot, 
  GitCompare, 
  Calculator, 
  Info,
  Code,
  Github
} from 'lucide-react';
import { Scene3D } from '@/components/three/Scene3D';
import { TransformControls } from '@/components/ui-custom/TransformControls';
import { RobotControls } from '@/components/ui-custom/RobotControls';
import { MatrixDisplay, MatrixComparison } from '@/components/ui-custom/MatrixDisplay';
import { CompositionPanel } from '@/components/ui-custom/CompositionPanel';
import { 
  composeTransformations, 
  composeSteps,
  inverseTransformation,
  verifyInverse,
  degToRad
} from '@/lib/transformations';
import type { TransformParams, JointConfig, TransformationStep } from '@/types';
import * as THREE from 'three';
import './App.css';

const defaultTransformParams: TransformParams = {
  translation: { x: 1, y: 0.5, z: 0 },
  rotation: { x: 0, y: degToRad(45), z: 0 },
  scale: { x: 1, y: 1, z: 1 },
};

const defaultJoints: JointConfig[] = [
  { id: 0, name: 'Base', angle: 0, length: 1.5, minAngle: -180, maxAngle: 180, axis: 'z' },
  { id: 1, name: 'Hombro', angle: 30, length: 1.2, minAngle: -90, maxAngle: 90, axis: 'y' },
  { id: 2, name: 'Codo', angle: -20, length: 1.0, minAngle: -120, maxAngle: 120, axis: 'y' },
  { id: 3, name: 'Muñeca', angle: 0, length: 0.5, minAngle: -90, maxAngle: 90, axis: 'z' },
];

const defaultCoordinateMatrices = [
  new THREE.Matrix4().identity(),
  new THREE.Matrix4().makeTranslation(2, 1, 0).multiply(new THREE.Matrix4().makeRotationZ(degToRad(30))),
  new THREE.Matrix4().makeTranslation(-2, 1, 1).multiply(new THREE.Matrix4().makeRotationY(degToRad(-45))),
];

function App() {
  const [transformParams, setTransformParams] = useState<TransformParams>(defaultTransformParams);
  const [showOriginal, setShowOriginal] = useState(true);
  const [showLines, setShowLines] = useState(false);
  const [joints, setJoints] = useState<JointConfig[]>(defaultJoints);
  const [isAnimating, setIsAnimating] = useState(false);
  const [transformationSteps, setTransformationSteps] = useState<TransformationStep[]>([]);
  
  const transformMatrix = useMemo(() => {
    return composeTransformations(transformParams);
  }, [transformParams]);
  
  const compositionMatrix = useMemo(() => {
    return composeSteps(transformationSteps);
  }, [transformationSteps]);
  
  useEffect(() => {
    if (!isAnimating) return;
    const interval = setInterval(() => {
      setJoints(prev => prev.map((joint, i) => {
        const time = Date.now() / 1000;
        const offset = i * Math.PI / 2;
        const newAngle = Math.sin(time + offset) * 30;
        return { ...joint, angle: Math.max(joint.minAngle, Math.min(joint.maxAngle, newAngle)) };
      }));
    }, 50);
    return () => clearInterval(interval);
  }, [isAnimating]);

  const inverseMatrix = useMemo(() => {
    return inverseTransformation(transformMatrix);
  }, [transformMatrix]);
  
  const isInverseValid = useMemo(() => {
    return verifyInverse(transformMatrix, inverseMatrix);
  }, [transformMatrix, inverseMatrix]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Box className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                  Transformaciones Homogéneas
                </h1>
                <p className="text-xs text-slate-400">Visualización 3D Interactiva</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="hidden sm:flex items-center gap-1">
                <Code className="w-3 h-3" />
                React + Three.js
              </Badge>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="transformations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-slate-900 border border-slate-800">
            <TabsTrigger value="transformations" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Transformaciones</span>
              <span className="sm:hidden">Transform</span>
            </TabsTrigger>
            <TabsTrigger value="composition" className="flex items-center gap-2">
              <GitCompare className="w-4 h-4" />
              <span className="hidden sm:inline">Composición</span>
              <span className="sm:hidden">Compose</span>
            </TabsTrigger>
            <TabsTrigger value="robot" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">Brazo Robot</span>
              <span className="sm:hidden">Robot</span>
            </TabsTrigger>
            <TabsTrigger value="coordinates" className="flex items-center gap-2">
              <Box className="w-4 h-4" />
              <span className="hidden sm:inline">Coordenadas</span>
              <span className="sm:hidden">Coords</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transformations" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-slate-900 border-slate-700 h-[500px]">
                  <CardContent className="p-0 h-full">
                    <Scene3D
                      mode="transformations"
                      transformMatrix={transformMatrix}
                      showOriginal={showOriginal}
                      showLines={showLines}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <TransformControls
                  params={transformParams}
                  onChange={setTransformParams}
                  showOriginal={showOriginal}
                  onShowOriginalChange={setShowOriginal}
                  showLines={showLines}
                  onShowLinesChange={setShowLines}
                />
                
                <MatrixDisplay 
                  matrix={transformMatrix} 
                  title="Matriz de Transformación"
                />
              </div>
            </div>

            <Card className="bg-slate-900 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Verificación de Transformación Inversa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MatrixComparison
                  matrixA={transformMatrix}
                  matrixB={inverseMatrix}
                  titleA="T"
                  titleB="T⁻¹"
                  result={new THREE.Matrix4().multiplyMatrices(transformMatrix, inverseMatrix)}
                />
                <div className="mt-4 flex items-center gap-2">
                  <Badge variant={isInverseValid ? 'default' : 'destructive'}>
                    {isInverseValid ? '✓ Válido' : '✗ Inválido'}
                  </Badge>
                  <span className="text-sm text-slate-400">
                    T × T⁻¹ = I (Matriz Identidad)
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="composition" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-slate-900 border-slate-700 h-[500px]">
                  <CardContent className="p-0 h-full">
                    <Scene3D
                      mode="transformations"
                      transformMatrix={compositionMatrix}
                      showOriginal={true}
                      showLines={false}
                    />
                  </CardContent>
                </Card>
              </div>

              <div>
                <CompositionPanel
                  steps={transformationSteps}
                  onStepsChange={setTransformationSteps}
                  resultMatrix={compositionMatrix}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="robot" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-slate-900 border-slate-700 h-[500px]">
                  <CardContent className="p-0 h-full">
                    <Scene3D
                      mode="robot"
                      joints={joints}
                    />
                  </CardContent>
                </Card>
              </div>

              <div>
                <RobotControls
                  joints={joints}
                  onJointsChange={setJoints}
                  isAnimating={isAnimating}
                  onToggleAnimation={() => setIsAnimating(!isAnimating)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="coordinates" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-slate-900 border-slate-700 h-[500px]">
                  <CardContent className="p-0 h-full">
                    <Scene3D
                      mode="coordinates"
                      coordinateMatrices={defaultCoordinateMatrices}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="bg-slate-900 border-slate-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Sistemas de Coordenadas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-red-500"></div>
                      <span className="text-sm text-slate-300">Eje X</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-green-500"></div>
                      <span className="text-sm text-slate-300">Eje Y</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-blue-500"></div>
                      <span className="text-sm text-slate-300">Eje Z</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-slate-800 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-500">
              <p>Transformaciones Homogéneas - Herramienta de Aprendizaje Interactivo</p>
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              <Badge variant="outline" className="text-xs">Coordenadas 2D/3D</Badge>
              <Badge variant="outline" className="text-xs">Matrices de Transformación</Badge>
              <Badge variant="outline" className="text-xs">Cinemática Directa</Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

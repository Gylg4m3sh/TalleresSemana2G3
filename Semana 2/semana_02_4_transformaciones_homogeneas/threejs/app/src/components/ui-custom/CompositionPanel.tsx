import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, ArrowDown, ArrowUp, Layers } from 'lucide-react';
import type { TransformationStep, TransformationType } from '@/types';
import { 
  createTransformationStep, 
  matrixToArray,
  formatMatrixElement 
} from '@/lib/transformations';
import * as THREE from 'three';

interface CompositionPanelProps {
  steps: TransformationStep[];
  onStepsChange: (steps: TransformationStep[]) => void;
  resultMatrix: THREE.Matrix4;
}

const transformationTypes: { value: TransformationType; label: string }[] = [
  { value: 'translation', label: 'Traslación' },
  { value: 'rotation', label: 'Rotación' },
  { value: 'scale', label: 'Escala' },
  { value: 'reflection', label: 'Reflexión' },
];

export function CompositionPanel({
  steps,
  onStepsChange,
  resultMatrix,
}: CompositionPanelProps) {
  const [selectedType, setSelectedType] = useState<TransformationType>('translation');
  const [paramValue, setParamValue] = useState(0);

  const handleAddStep = useCallback(() => {
    const params: Record<string, number> = {};
    
    switch (selectedType) {
      case 'translation':
        params.x = paramValue;
        params.y = 0;
        params.z = 0;
        break;
      case 'rotation':
        params.angle = (paramValue * Math.PI) / 180;
        break;
      case 'scale':
        params.x = 1 + paramValue * 0.1;
        params.y = 1 + paramValue * 0.1;
        params.z = 1 + paramValue * 0.1;
        break;
      case 'reflection':
        params.axis = 0;
        break;
    }
    
    const newStep = createTransformationStep(steps.length, selectedType, params);
    onStepsChange([...steps, newStep]);
    setParamValue(0);
  }, [selectedType, paramValue, steps, onStepsChange]);

  const handleRemoveStep = useCallback((id: number) => {
    onStepsChange(steps.filter(s => s.id !== id).map((s, i) => ({ ...s, id: i })));
  }, [steps, onStepsChange]);

  const handleMoveStep = useCallback((id: number, direction: 'up' | 'down') => {
    const index = steps.findIndex(s => s.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= steps.length) return;
    
    const newSteps = [...steps];
    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
    onStepsChange(newSteps.map((s, i) => ({ ...s, id: i })));
  }, [steps, onStepsChange]);

  const getStepDescription = (step: TransformationStep): string => {
    switch (step.type) {
      case 'translation':
        return `Trasladar(${step.params.x?.toFixed(2)}, ${step.params.y?.toFixed(2)}, ${step.params.z?.toFixed(2)})`;
      case 'rotation':
        return `Rotar(${(step.params.angle * 180 / Math.PI).toFixed(1)}°)`;
      case 'scale':
        return `Escalar(${step.params.x?.toFixed(2)}, ${step.params.y?.toFixed(2)}, ${step.params.z?.toFixed(2)})`;
      case 'reflection':
        return `Reflejar(${step.params.axis})`;
      default:
        return 'Desconocido';
    }
  };

  const resultElements = matrixToArray(resultMatrix);

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Layers className="w-5 h-5" />
          Composición de Transformaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Label className="text-xs text-slate-400 mb-1 block">Tipo</Label>
            <Select value={selectedType} onValueChange={(v) => setSelectedType(v as TransformationType)}>
              <SelectTrigger className="bg-slate-800 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {transformationTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label className="text-xs text-slate-400 mb-1 block">
              {selectedType === 'rotation' ? 'Ángulo (°)' : 'Valor'}
            </Label>
            <Slider
              value={[paramValue]}
              min={selectedType === 'rotation' ? -180 : -5}
              max={selectedType === 'rotation' ? 180 : 5}
              step={selectedType === 'rotation' ? 5 : 0.5}
              onValueChange={([v]) => setParamValue(v)}
            />
          </div>
          <Button onClick={handleAddStep} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {steps.length === 0 && (
            <div className="text-center text-slate-500 py-4">
              No hay transformaciones agregadas
            </div>
          )}
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-center gap-2 p-2 bg-slate-800 rounded-lg"
            >
              <span className="text-xs text-slate-500 w-6">{index + 1}.</span>
              <Badge variant="secondary" className="text-xs">
                {step.type}
              </Badge>
              <span className="flex-1 text-xs text-slate-300 font-mono">
                {getStepDescription(step)}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleMoveStep(step.id, 'up')}
                  disabled={index === 0}
                >
                  <ArrowUp className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleMoveStep(step.id, 'down')}
                  disabled={index === steps.length - 1}
                >
                  <ArrowDown className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-400 hover:text-red-300"
                  onClick={() => handleRemoveStep(step.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {steps.length > 0 && (
          <div className="pt-4 border-t border-slate-700">
            <div className="text-xs text-slate-400 mb-2">Matriz Resultado</div>
            <div className="grid grid-cols-4 gap-1">
              {resultElements.map((row, i) =>
                row.map((val, j) => (
                  <div
                    key={`r-${i}-${j}`}
                    className="px-2 py-1 bg-slate-800 rounded text-center text-xs font-mono text-emerald-400"
                  >
                    {formatMatrixElement(val)}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="text-xs text-slate-500 bg-slate-800/50 p-2 rounded">
          <span className="text-amber-400">Nota:</span> Las transformaciones se aplican 
          en orden. La multiplicación de matrices NO es conmutativa: 
          <span className="text-blue-400 font-mono"> A × B ≠ B × A</span>
        </div>
      </CardContent>
    </Card>
  );
}

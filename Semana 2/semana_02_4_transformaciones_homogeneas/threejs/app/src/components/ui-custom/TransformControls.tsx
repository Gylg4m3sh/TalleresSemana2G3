import { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RotateCcw, Copy, Calculator } from 'lucide-react';
import type { TransformParams } from '@/types';

interface TransformControlsProps {
  params: TransformParams;
  onChange: (params: TransformParams) => void;
  onReset?: () => void;
  showOriginal: boolean;
  onShowOriginalChange: (show: boolean) => void;
  showLines: boolean;
  onShowLinesChange: (show: boolean) => void;
}

const defaultParams: TransformParams = {
  translation: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
};

export function TransformControls({
  params,
  onChange,
  onReset,
  showOriginal,
  onShowOriginalChange,
  showLines,
  onShowLinesChange,
}: TransformControlsProps) {
  const handleTranslationChange = useCallback((axis: 'x' | 'y' | 'z', value: number) => {
    onChange({
      ...params,
      translation: { ...params.translation, [axis]: value },
    });
  }, [params, onChange]);

  const handleRotationChange = useCallback((axis: 'x' | 'y' | 'z', value: number) => {
    onChange({
      ...params,
      rotation: { ...params.rotation, [axis]: value },
    });
  }, [params, onChange]);

  const handleScaleChange = useCallback((axis: 'x' | 'y' | 'z', value: number) => {
    onChange({
      ...params,
      scale: { ...params.scale, [axis]: value },
    });
  }, [params, onChange]);

  const handleReset = useCallback(() => {
    onChange(defaultParams);
    onReset?.();
  }, [onChange, onReset]);

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Controles
          </span>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Reiniciar
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="translation" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="translation">Traslación</TabsTrigger>
            <TabsTrigger value="rotation">Rotación</TabsTrigger>
            <TabsTrigger value="scale">Escala</TabsTrigger>
          </TabsList>

          <TabsContent value="translation" className="space-y-4">
            <AxisSlider
              label="X"
              value={params.translation.x}
              min={-5}
              max={5}
              step={0.1}
              onChange={(v) => handleTranslationChange('x', v)}
              color="text-red-400"
            />
            <AxisSlider
              label="Y"
              value={params.translation.y}
              min={-5}
              max={5}
              step={0.1}
              onChange={(v) => handleTranslationChange('y', v)}
              color="text-green-400"
            />
            <AxisSlider
              label="Z"
              value={params.translation.z}
              min={-5}
              max={5}
              step={0.1}
              onChange={(v) => handleTranslationChange('z', v)}
              color="text-blue-400"
            />
          </TabsContent>

          <TabsContent value="rotation" className="space-y-4">
            <AxisSlider
              label="X"
              value={params.rotation.x}
              min={-180}
              max={180}
              step={1}
              unit="°"
              onChange={(v) => handleRotationChange('x', (v * Math.PI) / 180)}
              displayValue={Math.round((params.rotation.x * 180) / Math.PI)}
              color="text-red-400"
            />
            <AxisSlider
              label="Y"
              value={params.rotation.y}
              min={-180}
              max={180}
              step={1}
              unit="°"
              onChange={(v) => handleRotationChange('y', (v * Math.PI) / 180)}
              displayValue={Math.round((params.rotation.y * 180) / Math.PI)}
              color="text-green-400"
            />
            <AxisSlider
              label="Z"
              value={params.rotation.z}
              min={-180}
              max={180}
              step={1}
              unit="°"
              onChange={(v) => handleRotationChange('z', (v * Math.PI) / 180)}
              displayValue={Math.round((params.rotation.z * 180) / Math.PI)}
              color="text-blue-400"
            />
          </TabsContent>

          <TabsContent value="scale" className="space-y-4">
            <AxisSlider
              label="X"
              value={params.scale.x}
              min={0.1}
              max={3}
              step={0.1}
              onChange={(v) => handleScaleChange('x', v)}
              color="text-red-400"
            />
            <AxisSlider
              label="Y"
              value={params.scale.y}
              min={0.1}
              max={3}
              step={0.1}
              onChange={(v) => handleScaleChange('y', v)}
              color="text-green-400"
            />
            <AxisSlider
              label="Z"
              value={params.scale.z}
              min={0.1}
              max={3}
              step={0.1}
              onChange={(v) => handleScaleChange('z', v)}
              color="text-blue-400"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const avg = (params.scale.x + params.scale.y + params.scale.z) / 3;
                onChange({
                  ...params,
                  scale: { x: avg, y: avg, z: avg },
                });
              }}
              className="w-full"
            >
              <Copy className="w-4 h-4 mr-1" />
              Escala Uniforme
            </Button>
          </TabsContent>
        </Tabs>

        <div className="mt-4 pt-4 border-t border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-original" className="text-sm text-slate-300">
              Mostrar Objeto Original
            </Label>
            <Switch
              id="show-original"
              checked={showOriginal}
              onCheckedChange={onShowOriginalChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-lines" className="text-sm text-slate-300">
              Mostrar Líneas de Transformación
            </Label>
            <Switch
              id="show-lines"
              checked={showLines}
              onCheckedChange={onShowLinesChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface AxisSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
  displayValue?: number;
  color?: string;
}

function AxisSlider({
  label,
  value,
  min,
  max,
  step,
  unit = '',
  onChange,
  displayValue,
  color = 'text-white',
}: AxisSliderProps) {
  const displayVal = displayValue !== undefined ? displayValue : value;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className={`text-sm font-medium ${color}`}>
          Eje {label}
        </Label>
        <span className="text-sm text-slate-400 font-mono">
          {displayVal.toFixed(2)}{unit}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
        className="w-full"
      />
    </div>
  );
}

import { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Bot, Play, Pause, RotateCcw } from 'lucide-react';
import type { JointConfig } from '@/types';

interface RobotControlsProps {
  joints: JointConfig[];
  onJointsChange: (joints: JointConfig[]) => void;
  isAnimating: boolean;
  onToggleAnimation: () => void;
}

export function RobotControls({
  joints,
  onJointsChange,
  isAnimating,
  onToggleAnimation,
}: RobotControlsProps) {
  const handleJointChange = useCallback((index: number, angle: number) => {
    const newJoints = [...joints];
    newJoints[index] = { ...newJoints[index], angle };
    onJointsChange(newJoints);
  }, [joints, onJointsChange]);

  const handleReset = useCallback(() => {
    const resetJoints = joints.map(j => ({ ...j, angle: 0 }));
    onJointsChange(resetJoints);
  }, [joints, onJointsChange]);

  const handlePreset = useCallback((preset: string) => {
    let newJoints = [...joints];
    switch (preset) {
      case 'reach':
        newJoints = joints.map((j, i) => ({
          ...j,
          angle: i === 0 ? 45 : i === 1 ? -30 : i === 2 ? 60 : 0,
        }));
        break;
      case 'fold':
        newJoints = joints.map((j, i) => ({
          ...j,
          angle: i === 0 ? 0 : i === 1 ? 90 : i === 2 ? -90 : 0,
        }));
        break;
      case 'wave':
        newJoints = joints.map((j, i) => ({
          ...j,
          angle: i === 0 ? 0 : i === 1 ? 0 : i === 2 ? 45 : 45,
        }));
        break;
    }
    onJointsChange(newJoints);
  }, [joints, onJointsChange]);

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Controles del Brazo
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleAnimation}
            >
              {isAnimating ? (
                <Pause className="w-4 h-4 mr-1" />
              ) : (
                <Play className="w-4 h-4 mr-1" />
              )}
              {isAnimating ? 'Detener' : 'Animar'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Reiniciar
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-slate-700"
            onClick={() => handlePreset('reach')}
          >
            Alcanzar
          </Badge>
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-slate-700"
            onClick={() => handlePreset('fold')}
          >
            Plegado
          </Badge>
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-slate-700"
            onClick={() => handlePreset('wave')}
          >
            Saludar
          </Badge>
        </div>

        <div className="space-y-4">
          {joints.map((joint, index) => (
            <div key={joint.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium text-slate-300">
                  {joint.name}
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">
                    Eje: {joint.axis.toUpperCase()}
                  </span>
                  <span className="text-sm text-slate-400 font-mono w-16 text-right">
                    {joint.angle.toFixed(1)}°
                  </span>
                </div>
              </div>
              <Slider
                value={[joint.angle]}
                min={joint.minAngle}
                max={joint.maxAngle}
                step={1}
                onValueChange={([v]) => handleJointChange(index, v)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>{joint.minAngle}°</span>
                <span>Longitud: {joint.length}m</span>
                <span>{joint.maxAngle}°</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="text-xs text-slate-400">
            <p className="mb-1">
              <span className="text-emerald-400">Cinemática Directa:</span> Calcula la 
              posición del efector final usando matrices de transformación.
            </p>
            <p>
              <span className="text-blue-400">T_total = T₁ × R₁ × T₂ × R₂ × ...</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

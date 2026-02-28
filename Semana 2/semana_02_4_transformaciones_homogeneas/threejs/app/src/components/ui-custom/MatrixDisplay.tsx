import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatMatrixElement, matrixToArray } from '@/lib/transformations';
import * as THREE from 'three';

interface MatrixDisplayProps {
  matrix: THREE.Matrix4;
  title?: string;
  className?: string;
}

export function MatrixDisplay({
  matrix,
  title = 'Matriz',
  className = '',
}: MatrixDisplayProps) {
  const elements = matrixToArray(matrix);

  return (
    <Card className={`bg-slate-900 border-slate-700 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-mono text-slate-300">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="font-mono text-xs">
          <div className="text-slate-500 mb-1">Matriz 4x4</div>
          <div className="grid grid-cols-4 gap-1">
            {elements.map((row, i) => (
              row.map((val, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`
                    px-2 py-1 rounded text-center
                    ${i === 3 && j === 3 ? 'bg-blue-900/50 text-blue-300' : 'bg-slate-800'}
                    ${i < 3 && j < 3 ? 'text-emerald-400' : ''}
                    ${i < 3 && j === 3 ? 'text-amber-400' : ''}
                  `}
                >
                  {formatMatrixElement(val)}
                </div>
              ))
            ))}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex gap-4">
            <span className="text-emerald-400">● Rotación/Escala</span>
            <span className="text-amber-400">● Traslación</span>
            <span className="text-blue-300">● Homogénea</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface MatrixComparisonProps {
  matrixA: THREE.Matrix4;
  matrixB: THREE.Matrix4;
  titleA?: string;
  titleB?: string;
  operation?: string;
  result?: THREE.Matrix4;
}

export function MatrixComparison({
  matrixA,
  matrixB,
  titleA = 'Matriz A',
  titleB = 'Matriz B',
  operation = '×',
  result,
}: MatrixComparisonProps) {
  const elementsA = matrixToArray(matrixA);
  const elementsB = matrixToArray(matrixB);
  const elementsResult = result ? matrixToArray(result) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-2">{titleA}</div>
          <div className="grid grid-cols-4 gap-1">
            {elementsA.map((row, i) =>
              row.map((val, j) => (
                <div
                  key={`a-${i}-${j}`}
                  className="px-2 py-1 bg-slate-800 rounded text-center text-xs font-mono"
                >
                  {formatMatrixElement(val)}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="text-2xl text-slate-400 font-bold">{operation}</div>

        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-2">{titleB}</div>
          <div className="grid grid-cols-4 gap-1">
            {elementsB.map((row, i) =>
              row.map((val, j) => (
                <div
                  key={`b-${i}-${j}`}
                  className="px-2 py-1 bg-slate-800 rounded text-center text-xs font-mono"
                >
                  {formatMatrixElement(val)}
                </div>
              ))
            )}
          </div>
        </div>

        {result && (
          <>
            <div className="text-2xl text-slate-400 font-bold">=</div>

            <div className="bg-slate-900 border border-slate-700 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-2">Resultado</div>
              <div className="grid grid-cols-4 gap-1">
                {elementsResult!.map((row, i) =>
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
          </>
        )}
      </div>
    </div>
  );
}

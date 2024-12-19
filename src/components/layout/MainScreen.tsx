import { useState } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { Circle, Layer, Line, Stage } from "react-konva";

type RightScreenProp = {
  width: number;
  drawingMode: number;
};

type Point = {
  x: number;
  y: number;
};

type LineProps = {
  points: number[];
};

export default function MainScreen({ width, drawingMode }: RightScreenProp) {
  const [lines, setLines] = useState<LineProps[]>([]);
  const [drawLines, setDrawLines] = useState<number[]>([]);
  const [linePath, setLinePath] = useState<Point | null>(null);
  const [startLine, setStartLine] = useState<Point | null>(null);

  const handleClick = (e: KonvaEventObject<MouseEvent>) => {
    //자유그리기 일 때
    if (drawingMode === 1) {
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;

      if (!startLine) {
        setStartLine({ x: pos.x, y: pos.y });
      } else {
        const newLine = {
          points: [startLine.x, startLine.y, pos.x, pos.y],
        };
        setLines([...lines, newLine]);
        setStartLine(null);
        setLinePath(null);
      }
    }
  };

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (drawingMode === 0) {
      console.log("선그리기시작");

      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;

      if (!startLine) {
        setStartLine({ x: pos.x, y: pos.y });
        setDrawLines([pos.x, pos.y]);
      }
    }
  };
  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (startLine && drawingMode === 0) {
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;

      setDrawLines([...drawLines, pos.x, pos.y]);
      console.log(drawLines);
    } else if (startLine && drawingMode === 1) {
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;
      setLinePath({ x: pos.x, y: pos.y });
    }
  };
  const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    if (drawingMode === 0) {
      console.log("선그리기끝");

      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) return;

      const drawLine = drawLines;
      setLines([...lines, { points: drawLine }]);
      setDrawLines([]);
      setStartLine(null);
    }
  };

  return (
    <section className="h-full bg-blue-100" style={{ width: `${width}%` }}>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {lines.map((item, index) => {
            return (
              <Line
                key={index}
                points={item.points}
                stroke="black"
                strokeWidth={2}
              />
            );
          })}

          {startLine && drawingMode === 1 && (
            <Circle
              x={startLine.x}
              y={startLine.y}
              radius={4}
              fill="blue"
              stroke="black"
              strokeWidth={2}
            />
          )}
          {startLine && linePath && drawingMode === 1 && (
            <Line
              points={[startLine.x, startLine.y, linePath.x, linePath.y]}
              stroke="black"
              strokeWidth={2}
            />
          )}
          {startLine && drawingMode === 0 && (
            <Line points={drawLines} stroke="black" strokeWidth={2} />
          )}
        </Layer>
      </Stage>
    </section>
  );
}

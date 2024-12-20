import { useState } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { Circle, Ellipse, Layer, Line, Rect, Stage } from "react-konva";
import {
  CircleProps,
  LineProps,
  Point,
  RectProps,
  RightScreenProp,
} from "../../types/type";

export default function MainScreen({
  width,
  drawingMode,
  lineWeight,
  shapeColor,
}: RightScreenProp) {
  const [startLine, setStartLine] = useState<Point | null>(null);
  const [linePath, setLinePath] = useState<Point | null>(null);

  const [lines, setLines] = useState<LineProps[]>([]);
  const [drawLines, setDrawLines] = useState<number[]>([]);

  const [circles, setCircles] = useState<CircleProps[]>([]);
  const [circleRadius, setCircleRadius] = useState<Point | null>(null);

  const [rectangles, setRectangles] = useState<RectProps[]>([]);
  const [showRect, setShowRect] = useState<RectProps | null>(null);

  const [multiLines, setMultiLines] = useState<LineProps[]>([]);
  const [multiLinePath, setMultiLinePath] = useState<number[]>([]);
  const [multiLineFlag, setMultiLineFlag] = useState<boolean>(false);

  const handleClick = (e: KonvaEventObject<MouseEvent>) => {
    //자유그리기 일 때
    if (drawingMode === 1) {
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) {
        console.error("마우스 위치를 가져올 수 없습니다.");
        return;
      }

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
    } else if (drawingMode === 4) {
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) {
        console.error("마우스 위치를 가져올 수 없습니다.");
        return;
      }

      if (!startLine) {
        setStartLine({ x: pos.x, y: pos.y });
        setMultiLinePath([pos.x, pos.y]);
      } else {
        if (multiLineFlag) {
          const newLine = {
            points: [...multiLinePath],
          };
          setMultiLines([...multiLines, newLine]);
          setMultiLinePath([]);
          setStartLine(null);
          setMultiLineFlag(false);
        }
        setMultiLinePath([...multiLinePath, pos.x, pos.y]);
      }
    }
  };

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) {
      console.error("마우스 위치를 가져올 수 없습니다.");
      return;
    }

    if (drawingMode === 0) {
      console.log("선그리기시작");
      if (!startLine) {
        setStartLine({ x: pos.x, y: pos.y });
        setDrawLines([pos.x, pos.y]);
      }
    } else if (drawingMode === 2) {
      if (!startLine) {
        setStartLine({ x: pos.x, y: pos.y });
      }
    } else if (drawingMode === 3) {
      if (!startLine) {
        setStartLine({ x: pos.x, y: pos.y });
      }
    }
  };
  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) {
      console.error("마우스 위치를 가져올 수 없습니다.");
      return;
    }

    if (startLine && drawingMode === 0) {
      setDrawLines([...drawLines, pos.x, pos.y]);
      console.log(drawLines);
    } else if (startLine && drawingMode === 1) {
      setLinePath({ x: pos.x, y: pos.y });
    } else if (startLine && drawingMode === 2) {
      setCircleRadius({
        x: Math.abs(pos.x - startLine.x),
        y: Math.abs(pos.y - startLine.y),
      });
    } else if (startLine && drawingMode === 3) {
      const width = pos.x - startLine.x;
      const height = pos.y - startLine.y;
      setShowRect({
        x: width > 0 ? startLine.x : pos.x,
        y: height > 0 ? startLine.y : pos.y,
        width: Math.abs(width),
        height: Math.abs(height),
      });
    } else if (startLine && drawingMode === 4 && multiLinePath.length > 2) {
      const width = Math.abs(pos.x - startLine.x);
      const height = Math.abs(pos.y - startLine.y);
      // 처음 점과 근접 한 곳에 있을 때
      if (width < 5 && height < 5) {
        console.log("감지");
        setMultiLineFlag(true);
      } else {
        setMultiLineFlag(false);
      }
    }
  };
  const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) {
      console.error("마우스 위치를 가져올 수 없습니다.");
      return;
    }

    if (drawingMode === 0) {
      console.log("선그리기끝");
      const drawLine = drawLines;
      setLines([...lines, { points: drawLine }]);
      setDrawLines([]);
      setStartLine(null);
    } else if (startLine && drawingMode === 2 && circleRadius) {
      const newCircle = {
        x: startLine.x,
        y: startLine.y,
        radiusX: circleRadius.x,
        radiusY: circleRadius.y,
      };
      setCircles([...circles, newCircle]);
      setCircleRadius(null);
      setStartLine(null);
    } else if (startLine && drawingMode === 3 && showRect) {
      const newRect = {
        x: showRect.x,
        y: showRect.y,
        width: showRect.width,
        height: showRect.height,
      };
      setRectangles([...rectangles, newRect]);
      setShowRect(null);
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
                strokeWidth={lineWeight}
              />
            );
          })}
          {circles.map((item, index) => {
            return (
              <Ellipse
                key={index}
                x={item.x}
                y={item.y}
                radiusX={item.radiusX}
                radiusY={item.radiusY}
                fill={"#" + shapeColor}
                stroke="black"
                strokeWidth={lineWeight}
              />
            );
          })}
          {rectangles.map((item, index) => {
            return (
              <Rect
                key={index}
                x={item.x}
                y={item.y}
                width={item.width}
                height={item.height}
                fill={"#" + shapeColor}
                stroke="black"
                strokeWidth={lineWeight}
              />
            );
          })}
          {multiLines.map((item, index) => {
            return (
              <Line
                key={index}
                points={item.points}
                fill={"#" + shapeColor}
                stroke="black"
                strokeWidth={lineWeight}
                closed={true}
              />
            );
          })}

          {startLine && linePath && drawingMode === 1 && (
            <Line
              points={[startLine.x, startLine.y, linePath.x, linePath.y]}
              stroke="black"
              strokeWidth={lineWeight}
            />
          )}
          {startLine && drawingMode === 1 && (
            <Circle
              x={startLine.x}
              y={startLine.y}
              radius={4}
              fill={"white"}
              stroke="black"
              strokeWidth={2}
            />
          )}

          {startLine && drawingMode === 0 && (
            <Line points={drawLines} stroke="black" strokeWidth={lineWeight} />
          )}
          {startLine && drawingMode === 2 && circleRadius && (
            <Ellipse
              x={startLine.x}
              y={startLine.y}
              radiusX={circleRadius.x}
              radiusY={circleRadius.y}
              fill={"#" + shapeColor}
              stroke="black"
              strokeWidth={lineWeight}
            />
          )}
          {startLine && drawingMode === 3 && showRect && (
            <Rect
              x={showRect.x}
              y={showRect.y}
              width={showRect.width}
              height={showRect.height}
              fill={"#" + shapeColor}
              stroke="black"
            />
          )}
          {startLine && drawingMode === 4 && (
            <>
              <Line
                points={multiLinePath}
                stroke="black"
                strokeWidth={lineWeight}
              />
              {Array.from(
                { length: Math.floor(multiLinePath.length / 2) },
                (_, index) => (
                  <Circle
                    key={index}
                    x={multiLinePath[index * 2]}
                    y={multiLinePath[index * 2 + 1]}
                    radius={4}
                    fill={index === 0 && multiLineFlag ? "white" : "blue"}
                    stroke="black"
                    strokeWidth={2}
                  />
                )
              )}
            </>
          )}
        </Layer>
      </Stage>
    </section>
  );
}

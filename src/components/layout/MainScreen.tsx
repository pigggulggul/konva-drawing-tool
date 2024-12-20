import { useState } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { Circle, Ellipse, Layer, Line, Rect, Stage } from "react-konva";
import { Point, RectProps, RightScreenProp } from "../../types/type";
import { useShapeStorage } from "../../functions/shapeSetting";

export default function MainScreen({
  width,
  drawingMode,
  lineWeight,
  shapeColor,
}: RightScreenProp) {
  const [startLine, setStartLine] = useState<Point | null>(null);
  const [linePath, setLinePath] = useState<Point | null>(null);

  const [drawLines, setDrawLines] = useState<number[]>([]);

  const [circleRadius, setCircleRadius] = useState<Point | null>(null);

  const [showRect, setShowRect] = useState<RectProps | null>(null);

  const [multiLinePath, setMultiLinePath] = useState<number[]>([]);
  const [multiLineFlag, setMultiLineFlag] = useState<boolean>(false);

  const shapeStorage = useShapeStorage();

  //drawingMode 0: 자유그리기, 1: 직선, 2: 타원, 3: 직사각형, 4: 다각형
  const handleClick = (e: KonvaEventObject<MouseEvent>) => {
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
        shapeStorage.addLine(newLine.points, lineWeight);
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
          shapeStorage.addMultiLine(newLine.points, shapeColor, lineWeight);
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
      const drawLine = drawLines;
      shapeStorage.addLine(drawLine, lineWeight);
      setDrawLines([]);
      setStartLine(null);
    } else if (startLine && drawingMode === 2 && circleRadius) {
      const newCircle = {
        x: startLine.x,
        y: startLine.y,
        radiusX: circleRadius.x,
        radiusY: circleRadius.y,
      };
      shapeStorage.addEllipse(
        newCircle.x,
        newCircle.y,
        newCircle.radiusX,
        newCircle.radiusY,
        shapeColor,
        lineWeight
      );
      setCircleRadius(null);
      setStartLine(null);
    } else if (startLine && drawingMode === 3 && showRect) {
      const newRect = {
        x: showRect.x,
        y: showRect.y,
        width: showRect.width,
        height: showRect.height,
      };
      shapeStorage.addRect(
        newRect.x,
        newRect.y,
        newRect.width,
        newRect.height,
        shapeColor,
        lineWeight
      );
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
          {shapeStorage.shapes.map((item) => {
            switch (item.type) {
              case "Line":
                return (
                  <Line
                    key={item.index}
                    points={item.points}
                    stroke={item.stroke}
                    strokeWidth={item.strokeWidth}
                  />
                );
              case "Ellipse":
                return (
                  <Ellipse
                    key={item.index}
                    x={item.x}
                    y={item.y}
                    radiusX={item.radiusX}
                    radiusY={item.radiusY}
                    fill={item.fill}
                    stroke={item.stroke}
                    strokeWidth={item.strokeWidth}
                  />
                );
              case "Rect":
                return (
                  <Rect
                    key={item.index}
                    x={item.x}
                    y={item.y}
                    width={item.width}
                    height={item.height}
                    fill={item.fill}
                    stroke={item.stroke}
                    strokeWidth={item.strokeWidth}
                  />
                );
              case "MultiLine":
                return (
                  <Line
                    key={item.index}
                    points={item.points}
                    fill={item.fill}
                    stroke={item.stroke}
                    strokeWidth={item.strokeWidth}
                    closed={item.closed}
                  />
                );
            }
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
              strokeWidth={lineWeight}
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
              strokeWidth={lineWeight}
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

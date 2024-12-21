import { useState } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { Point, RectProps } from "../types/type";
import { useShapeStorage } from "./shapeSetting";

export const DrawHandler = (
  drawingMode: number,
  lineWeight: number,
  shapeColor: string
) => {
  const [startLine, setStartLine] = useState<Point | null>(null);
  const [linePath, setLinePath] = useState<Point | null>(null);
  const [drawLines, setDrawLines] = useState<number[]>([]);
  const [circleRadius, setCircleRadius] = useState<Point | null>(null);
  const [showRect, setShowRect] = useState<RectProps | null>(null);
  const [multiLinePath, setMultiLinePath] = useState<number[]>([]);
  const [multiLineFlag, setMultiLineFlag] = useState<boolean>(false);
  const [polygonPath, setPolygonPath] = useState<Point | null>(null);

  const shapeStorage = useShapeStorage();

  //drawingMode 0: 자유그리기, 1: 직선, 2: 타원, 3: 직사각형, 4: 다각형
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
    } else if (startLine && drawingMode === 4) {
      setLinePath({ x: pos.x, y: pos.y });
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
  //마우스 클릭 후
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
    } else if (drawingMode === 1) {
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
    } else if (drawingMode === 4) {
      const pos = e.target.getStage()?.getPointerPosition();
      if (!pos) {
        console.error("마우스 위치를 가져올 수 없습니다.");
        return;
      }

      if (!startLine) {
        setStartLine({ x: pos.x, y: pos.y });
        setMultiLinePath([pos.x, pos.y]);
        setPolygonPath({ x: pos.x, y: pos.y });
        setLinePath({ x: pos.x, y: pos.y });
      } else {
        if (multiLineFlag) {
          const newLine = {
            points: [...multiLinePath],
          };
          shapeStorage.addMultiLine(newLine.points, shapeColor, lineWeight);
          setMultiLinePath([]);
          setStartLine(null);
          setMultiLineFlag(false);
          setPolygonPath(null);
          setLinePath(null);
        }
        setMultiLinePath([...multiLinePath, pos.x, pos.y]);
        setPolygonPath({ x: pos.x, y: pos.y });
      }
    }
  };

  return {
    shapeStorage,
    startLine,
    linePath,
    drawLines,
    circleRadius,
    showRect,
    multiLinePath,
    multiLineFlag,
    polygonPath,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};

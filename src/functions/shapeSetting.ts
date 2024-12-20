import { useState } from "react";
import {
  LineShape,
  EllipseShape,
  RectShape,
  MultiLineShape,
  Shape,
} from "../types/type";

export const useShapeStorage = () => {
  const [shapes, setShapes] = useState<Shape[]>(() => {
    const saved = sessionStorage.getItem("shapes");
    return saved ? JSON.parse(saved) : [];
  });

  // 저장 함수들
  const addLine = (points: number[], strokeWidth: number) => {
    const newShape: LineShape = {
      type: "Line",
      index: shapes.length,
      points,
      stroke: "black",
      strokeWidth,
    };
    saveShape(newShape);
  };

  const addEllipse = (
    x: number,
    y: number,
    radiusX: number,
    radiusY: number,
    color: string,
    strokeWidth: number
  ) => {
    const newShape: EllipseShape = {
      type: "Ellipse",
      index: shapes.length,
      x,
      y,
      radiusX,
      radiusY,
      fill: `#${color}`,
      stroke: "black",
      strokeWidth,
    };
    saveShape(newShape);
  };

  const addRect = (
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    strokeWidth: number
  ) => {
    const newShape: RectShape = {
      type: "Rect",
      index: shapes.length,
      x,
      y,
      width,
      height,
      fill: `#${color}`,
      stroke: "black",
      strokeWidth,
    };
    saveShape(newShape);
  };

  const addMultiLine = (
    points: number[],
    color: string,
    strokeWidth: number
  ) => {
    const newShape: MultiLineShape = {
      type: "MultiLine",
      index: shapes.length,
      points,
      fill: `#${color}`,
      stroke: "black",
      strokeWidth,
      closed: true,
    };
    saveShape(newShape);
  };

  const saveShape = (newShape: Shape) => {
    const updatedShapes = [...shapes, newShape];
    setShapes(updatedShapes);
    sessionStorage.setItem("shapes", JSON.stringify(updatedShapes));
  };

  return {
    shapes,
    addLine,
    addEllipse,
    addRect,
    addMultiLine,
  };
};

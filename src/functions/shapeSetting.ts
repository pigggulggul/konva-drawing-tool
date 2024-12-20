import { useState } from "react";
import {
  LineShape,
  EllipseShape,
  RectShape,
  MultiLineShape,
  Shape,
} from "../types/type";

class Deque<Shape> {
  private items: Shape[] = [];

  push(item: Shape) {
    this.items.push(item);
  }

  pop(): Shape | undefined {
    return this.items.pop();
  }
  poll(): Shape | undefined {
    return this.items.shift();
  }

  peek(): Shape | undefined {
    return this.items[this.items.length - 1];
  }

  size(): number {
    return this.items.length;
  }
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  clear() {
    this.items = [];
  }
}

export const useShapeStorage = () => {
  const [shapes, setShapes] = useState<Shape[]>(() => {
    const saved = sessionStorage.getItem("shapes");
    return saved ? JSON.parse(saved) : [];
  });
  const [undoStack] = useState(() => new Deque<Shape>());
  const [redoStack] = useState(() => new Deque<Shape>());
  const dequeSize = 40;

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

    if (undoStack.size() >= dequeSize) {
      undoStack.poll();
    }
    undoStack.push(newShape);
    redoStack.clear();

    setShapes(updatedShapes);
    sessionStorage.setItem("shapes", JSON.stringify(updatedShapes));
  };

  // 실행 취소
  const undo = () => {
    if (undoStack.isEmpty()) return;

    // 현재 sessionStorage에서 shapes 가져오기
    const currentShapes = JSON.parse(sessionStorage.getItem("shapes") || "[]");

    // 마지막 shape를 undo 스택에서 제거하고 redo 스택에 추가
    const lastShape = undoStack.pop();
    if (lastShape) {
      if (redoStack.size() >= dequeSize) {
        redoStack.poll();
      }
      redoStack.push(lastShape);

      // sessionStorage에서 마지막 요소 제거
      const newShapes = currentShapes.slice(0, -1);
      setShapes(newShapes);
      sessionStorage.setItem("shapes", JSON.stringify(newShapes));
    }
  };

  const checkUndoSize = () => {
    return undoStack.isEmpty() ? false : true;
  };

  // 다시 실행
  const redo = () => {
    if (redoStack.isEmpty()) return;

    // 현재 sessionStorage에서 shapes 가져오기
    const currentShapes = JSON.parse(sessionStorage.getItem("shapes") || "[]");

    // redo 스택에서 shape를 가져와서 undo 스택에 추가
    const shapeToRedo = redoStack.pop();
    if (shapeToRedo) {
      undoStack.push(shapeToRedo);

      // sessionStorage에 shape 추가
      const newShapes = [...currentShapes, shapeToRedo];
      setShapes(newShapes);
      sessionStorage.setItem("shapes", JSON.stringify(newShapes));
    }
  };

  const checkRedoSize = () => {
    return redoStack.isEmpty() ? false : true;
  };

  return {
    shapes,
    addLine,
    addEllipse,
    addRect,
    addMultiLine,
    undo,
    redo,
    checkUndoSize,
    checkRedoSize,
  };
};

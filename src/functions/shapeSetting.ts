import { useState } from "react";
import {
  LineShape,
  EllipseShape,
  RectShape,
  MultiLineShape,
  Shape,
} from "../types/type";

class Deque<T> {
  private items: (T | undefined)[];
  private head: number;
  private tail: number;
  private currentSize: number;

  constructor(capacity: number = 100) {
    this.items = new Array(capacity);
    this.head = 0;
    this.tail = 0;
    this.currentSize = 0;
  }

  // 뒤에 추가 (O(1))
  push(item: T): void {
    if (this.currentSize === this.items.length) {
      this.resize();
    }

    this.items[this.tail] = item;
    this.tail = (this.tail + 1) % this.items.length;
    this.currentSize++;
  }

  // 뒤에서 제거 (O(1))
  pop(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }

    this.tail = (this.tail - 1 + this.items.length) % this.items.length;
    const item = this.items[this.tail];
    this.items[this.tail] = undefined;
    this.currentSize--;

    return item;
  }

  // 앞에서 제거 (O(1))
  poll(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }

    const item = this.items[this.head];
    this.items[this.head] = undefined;
    this.head = (this.head + 1) % this.items.length;
    this.currentSize--;

    return item;
  }

  // 맨 뒤 요소 확인 (O(1))
  peek(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    const lastIndex = (this.tail - 1 + this.items.length) % this.items.length;
    return this.items[lastIndex];
  }

  // 크기 반환 (O(1))
  size(): number {
    return this.currentSize;
  }

  // 비어있는지 확인 (O(1))
  isEmpty(): boolean {
    return this.currentSize === 0;
  }

  // 모든 요소 제거 (O(1))
  clear(): void {
    this.items = new Array(this.items.length);
    this.head = 0;
    this.tail = 0;
    this.currentSize = 0;
  }

  // 배열 크기 조정 (필요할 때만 O(n))
  private resize(): void {
    const newCapacity = this.items.length * 2;
    const newItems = new Array(newCapacity);

    for (let i = 0; i < this.currentSize; i++) {
      newItems[i] = this.items[(this.head + i) % this.items.length];
    }

    this.items = newItems;
    this.head = 0;
    this.tail = this.currentSize;
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

  const clear = () => {
    setShapes([]);

    undoStack.clear();
    redoStack.clear();

    sessionStorage.removeItem("shapes");
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
    clear,
  };
};

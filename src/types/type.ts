// 레이아웃 관련 타입
/** 사이드 바
 * 길이, 드로잉 타입 state
 */
export type SideBarLeftProp = {
  width: number;
  drawingMode: number;
  setDrawingMode: React.Dispatch<React.SetStateAction<number>>;
  lineWeight: number;
  setLineWeight: React.Dispatch<React.SetStateAction<number>>;
  shapeColor: string;
  setShapeColor: React.Dispatch<React.SetStateAction<string>>;
};

// 캔버스 관련 타입

/**
 * 메인 캔버스
 * 길이, 드로잉 타입 state
 */
export type RightScreenProp = {
  width: number;
  drawingMode: number;
  lineWeight: number;
  shapeColor: string;
};

/** Shape x,y 좌표 */
export type Point = {
  x: number;
  y: number;
};

/** 직사각형 */
export type RectProps = {
  x: number;
  y: number;
  width: number;
  height: number;
};

// 세션 스토리지에 적용할 도형들
export interface BaseShape {
  index: number;
  stroke: string;
  strokeWidth: number;
}

export interface LineShape extends BaseShape {
  type: "Line";
  points: number[];
}

export interface EllipseShape extends BaseShape {
  type: "Ellipse";
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  fill: string;
}

export interface RectShape extends BaseShape {
  type: "Rect";
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}

export interface MultiLineShape extends BaseShape {
  type: "MultiLine";
  points: number[];
  fill: string;
  closed: boolean;
}

export type Shape = LineShape | EllipseShape | RectShape | MultiLineShape;

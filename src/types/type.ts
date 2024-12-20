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

/** Line 모양 */
export type LineProps = {
  points: number[];
};

/** 타원  */
export type CircleProps = {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
};

/** 직사각형 */
export type RectProps = {
  x: number;
  y: number;
  width: number;
  height: number;
};

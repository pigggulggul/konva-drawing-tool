import { ChangeEvent } from "react";
import { SideBarLeftProp } from "../../types/type";
import ListButton from "../common/ListButton";

export default function SideBarLeft({
  width,
  drawingMode,
  setDrawingMode,
  lineWeight,
  setLineWeight,
  shapeColor,
  setShapeColor,
}: SideBarLeftProp) {
  const onChangeWeight = (e: ChangeEvent<HTMLInputElement>) => {
    setLineWeight(Number(e.target.value));
  };
  const onBlurWeight = () => {
    if (lineWeight < 5) {
      setLineWeight(5);
    } else if (lineWeight > 50) {
      setLineWeight(50);
    }
  };
  const onChangeColor = (e: ChangeEvent<HTMLInputElement>) => {
    // 16진수만 허용하는 정규식
    const hexColorRegex = /^[0-9A-Fa-f]{0,6}$/;

    if (hexColorRegex.test(e.target.value)) {
      setShapeColor(e.target.value);
    }
  };

  return (
    <section
      className="h-full bg-white px-2 py-2 border border-gray-600"
      style={{ width: `${width}%` }}
    >
      <div>
        <p className="m-2 text-md font-bold">드로잉 타입</p>
        <ul className="flex flex-col">
          <ListButton
            text="자유 그리기"
            onClick={() => {
              setDrawingMode(0);
            }}
            isSelected={drawingMode === 0}
            icon="draw"
          />
          <ListButton
            text="직선"
            onClick={() => {
              setDrawingMode(1);
            }}
            isSelected={drawingMode === 1}
            icon="line"
          />
          <ListButton
            text="타원"
            onClick={() => {
              setDrawingMode(2);
            }}
            isSelected={drawingMode === 2}
            icon="ellipse"
          />
          <ListButton
            text="직사각형"
            onClick={() => {
              setDrawingMode(3);
            }}
            isSelected={drawingMode === 3}
            icon="rectangle"
          />
          <ListButton
            text="다각형"
            onClick={() => {
              setDrawingMode(4);
            }}
            isSelected={drawingMode === 4}
            icon="polygon"
          />
        </ul>
      </div>
      <div className="flex my-3 justify-between">
        <p className="m-2 text-md font-bold">선 두께 (5~50)</p>
        <div className="flex justify-center items-center border-2 color-border-main rounded-sm px-2 py-1">
          <input
            className="w-12 text-center"
            value={lineWeight}
            type="number"
            min={5}
            max={50}
            onChange={onChangeWeight}
            onBlur={onBlurWeight}
          />
          <p className="ms-2">px</p>
        </div>
      </div>
      <div className="flex my-3 justify-between">
        <p className="m-2 text-md font-bold">컬러</p>
        <div className="flex justify-center items-center border-2 color-border-main rounded-sm px-2 py-1">
          <div
            className="w-4 h-4 me-2"
            style={{ backgroundColor: `#${shapeColor}` }}
          />
          <p className="me-1">#</p>
          <input
            className="w-16 "
            type="text"
            value={shapeColor}
            onChange={onChangeColor}
          />
        </div>
      </div>
    </section>
  );
}

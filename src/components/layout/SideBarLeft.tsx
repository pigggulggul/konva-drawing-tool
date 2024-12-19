import ListButton from "../common/ListButton";

export type SideBarLeftProp = {
  width: number;
  drawingMode: number;
  setDrawingMode: React.Dispatch<React.SetStateAction<number>>;
};

export default function SideBarLeft({
  width,
  drawingMode,
  setDrawingMode,
}: SideBarLeftProp) {
  return (
    <section
      className="h-full bg-gray-50 px-2 py-2"
      style={{ width: `${width}%` }}
    >
      <div>
        <p>드로잉 타입</p>
        <ul className="flex my-2">
          <ListButton
            text="자유 그리기"
            onClick={() => {
              setDrawingMode(0);
            }}
            isSelected={drawingMode === 0}
          />
          <ListButton
            text="직선"
            onClick={() => {
              setDrawingMode(1);
            }}
            isSelected={drawingMode === 1}
          />
          <ListButton
            text="타원"
            onClick={() => {
              setDrawingMode(2);
            }}
            isSelected={drawingMode === 2}
          />
          <ListButton
            text="직사각형"
            onClick={() => {
              setDrawingMode(3);
            }}
            isSelected={drawingMode === 3}
          />
          <ListButton
            text="다각형"
            onClick={() => {
              setDrawingMode(4);
            }}
            isSelected={drawingMode === 4}
          />
        </ul>
      </div>
      <div className="flex my-2 justify-between">
        <p>선 두께</p>
        <div className="flex justify-center items-center border color-border-main rounded-sm px-2 py-1">
          <input className="w-20 " type="number" />
          <p className="ms-2">px</p>
        </div>
      </div>
      <div className="flex my-2 justify-between">
        <p>컬러</p>
        <div className="flex justify-center items-center border color-border-main rounded-sm px-2 py-1">
          <p className="me-2">#</p>
          <input className="w-20 " type="text" />
        </div>
      </div>
    </section>
  );
}

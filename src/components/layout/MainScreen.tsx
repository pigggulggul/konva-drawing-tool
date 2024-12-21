import { Circle, Ellipse, Layer, Line, Rect, Stage } from "react-konva";
import { RightScreenProp } from "../../types/type";
import UndoButton from "../common/UndoButton";
import RedoButton from "../common/RedoButton";
import { DrawHandler } from "../../functions/DrawHandler";

export default function MainScreen({
  width,
  drawingMode,
  lineWeight,
  shapeColor,
}: RightScreenProp) {
  const {
    shapeStorage,
    startLine,
    linePath,
    drawLines,
    circleRadius,
    showRect,
    multiLinePath,
    multiLineFlag,
    handleClick,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = DrawHandler(drawingMode, lineWeight, shapeColor);

  return (
    <section className="h-full bg-blue-50" style={{ width: `${width}%` }}>
      <div className="h-[10%] bg-white flex items-center justify-between px-4 border-y border-gray-600">
        <div className="flex items-center">
          <p className=" select-none">작업 실행: </p>
          <UndoButton
            checkUndo={shapeStorage.checkUndoSize()}
            onClick={() => {
              shapeStorage.undo();
            }}
          />
          <RedoButton
            checkRedo={shapeStorage.checkRedoSize()}
            onClick={() => {
              shapeStorage.redo();
            }}
          />
        </div>
        <div
          className=" color-border-main border-2 rounded-sm p-2 cursor-pointer hover:color-bg-main"
          onClick={() => {
            shapeStorage.clear();
          }}
        >
          <p className="color-text-main hover:text-white select-none">
            전체 지우기
          </p>
        </div>
      </div>

      <Stage
        width={(window.innerWidth * width) / 100}
        height={window.innerHeight * 0.9}
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

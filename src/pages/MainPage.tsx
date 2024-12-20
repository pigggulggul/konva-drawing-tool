import MainScreen from "../components/layout/MainScreen";
import SideBarLeft from "../components/layout/SideBarLeft";
import "../index.css";
import "../assets/css/variables.css";
import { useState } from "react";

export default function MainPage() {
  const [drawingMode, setDrawingMode] = useState<number>(0);
  const [lineWeight, setLineWeight] = useState<number>(5);
  const [shapeColor, setShapeColor] = useState<string>("0490c8");

  return (
    <section className="h-full flex">
      <SideBarLeft
        width={20}
        drawingMode={drawingMode}
        setDrawingMode={setDrawingMode}
        lineWeight={lineWeight}
        setLineWeight={setLineWeight}
        shapeColor={shapeColor}
        setShapeColor={setShapeColor}
      />
      <MainScreen
        width={80}
        drawingMode={drawingMode}
        lineWeight={lineWeight}
        shapeColor={shapeColor}
      />
    </section>
  );
}

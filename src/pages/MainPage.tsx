import MainScreen from "../components/layout/MainScreen";
import SideBarLeft from "../components/layout/SideBarLeft";
import "../index.css";
import "../assets/css/variables.css";
import { useState } from "react";

export default function MainPage() {
  const [drawingMode, setDrawingMode] = useState<number>(0);

  return (
    <section className="h-full flex">
      <SideBarLeft
        width={20}
        drawingMode={drawingMode}
        setDrawingMode={setDrawingMode}
      />
      <MainScreen width={80} drawingMode={drawingMode} />
    </section>
  );
}

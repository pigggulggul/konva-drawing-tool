import MainScreen from "../components/layout/MainScreen";
import SideBarLeft from "../components/layout/SideBarLeft";
import "../index.css";
import "../assets/css/variables.css";

export default function MainPage() {
  return (
    <section className="h-full flex">
      <SideBarLeft width={20} />
      <MainScreen width={80} />
    </section>
  );
}

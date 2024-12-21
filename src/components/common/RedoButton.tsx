import { Icon } from "../icons/Icon";

interface RedoButtonProp {
  checkRedo: boolean;
  onClick: () => void;
}
export default function RedoButton({ checkRedo, onClick }: RedoButtonProp) {
  return (
    <div
      className={`flex justify-center items-center w-10 h-10 rounded-md border mx-2 cursor-pointer ${
        checkRedo === false
          ? " bg-gray-200"
          : "border-gray-200 color-border-main"
      }`}
      onClick={onClick}
    >
      <Icon name="redo" />
    </div>
  );
}

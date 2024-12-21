import { Icon } from "../icons/Icon";

interface UndoButtonProp {
  checkUndo: boolean;
  onClick: () => void;
}
export default function UndoButton({ checkUndo, onClick }: UndoButtonProp) {
  return (
    <div
      className={`flex justify-center items-center w-10 h-10 rounded-md border mx-2 cursor-pointer ${
        checkUndo === false
          ? " bg-gray-200"
          : "border-gray-200 color-border-main"
      }`}
      onClick={onClick}
    >
      <Icon name="undo" />
    </div>
  );
}

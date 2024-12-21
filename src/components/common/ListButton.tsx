import { Icon } from "../icons/Icon";

type ListButtonProps = {
  text: string;
  onClick: () => void;
  isSelected?: boolean;
  icon?: string;
};

export default function ListButton({
  text,
  onClick,
  isSelected,
  icon = "",
}: ListButtonProps) {
  return (
    <li
      onClick={onClick}
      className={`flex items-center text-sm rounded-sm border-2 color-border-main py-4 px-3 cursor-pointer mt-4 ${
        isSelected ? "color-bg-main text-white" : "color-bg-white"
      }`}
    >
      <Icon name={icon} color={isSelected ? "#efefef" : "#121abc"} />
      <p className={isSelected ? "ml-2 font-bold" : "ml-2"}>{text}</p>
    </li>
  );
}

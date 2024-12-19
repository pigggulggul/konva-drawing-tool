type ListButtonProps = {
  text: string;
  onClick: () => void;
  isSelected?: boolean;
};

export default function ListButton({
  text,
  onClick,
  isSelected,
}: ListButtonProps) {
  return (
    <li
      onClick={onClick}
      className={`text-sm rounded-sm border-2 color-border-main py-1 px-3 mx-2 cursor-pointer ${
        isSelected ? "color-bg-main text-white" : "color-bg-white"
      }`}
    >
      {text}
    </li>
  );
}

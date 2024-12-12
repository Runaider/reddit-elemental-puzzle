import React from "react";

function IconButton({
  icon,
  onClick,
}: {
  icon: JSX.Element;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="w-8 h-8 flex items-center justify-center rounded-full bg-custom-border p-1 text-custom-bg  hover:scale-105 transition-transform duration-300 shadow-md"
    >
      {icon}
    </button>
  );
}

export default IconButton;

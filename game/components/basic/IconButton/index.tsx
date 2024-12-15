import classNames from "classnames";
import React from "react";

function IconButton({
  icon,
  color = "black",
  onClick,
}: {
  icon: JSX.Element;
  color?: "white" | "black";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={classNames(
        "w-8 h-8 flex items-center justify-center rounded-full p-1 hover:scale-105 transition-transform duration-300 shadow-md",
        color === "white"
          ? "bg-custom-bg text-custom-border"
          : "bg-custom-border  text-custom-bg "
      )}
    >
      {icon}
    </button>
  );
}

export default IconButton;

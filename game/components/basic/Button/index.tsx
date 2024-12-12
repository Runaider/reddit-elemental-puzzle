import classNames from "classnames";
import React from "react";

function Button({
  onClick,
  children,
  dark,
  fullWidth,
  size,
}: {
  onClick: () => void;
  children: React.ReactNode;
  dark?: boolean;
  fullWidth?: boolean;
  size?: "base" | "large" | "extra-large";
}) {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        type="button"
        className={classNames(
          "rounded-md  px-3 py-2 text-sm font-semibold text-custom-bg shadow-sm  visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-muted",
          "transition-transform duration-200 transform hover:scale-105",
          fullWidth ? "w-full" : "",
          size === "base"
            ? "text-sm"
            : size === "large"
            ? "text-lg"
            : "text-3xl",
          dark
            ? "bg-custom-border hover:bg-custom-border"
            : "bg-custom-muted hover:bg-custom-border"
        )}
      >
        {children}
      </button>
    </div>
  );
}

export default Button;

import React from "react";

function ExplanatoryHeadlineText({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xl font-extrabold text-custom-main-text">
      {children}
    </div>
  );
}

export default ExplanatoryHeadlineText;

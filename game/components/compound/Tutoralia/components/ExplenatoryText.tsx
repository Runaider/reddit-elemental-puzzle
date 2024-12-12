import React from "react";

function ExplanatoryText({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-4 text-lg font-medium text-custom-main-text text-left">
      {children}
    </div>
  );
}

export default ExplanatoryText;

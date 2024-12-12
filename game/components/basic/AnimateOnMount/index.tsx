import classNames from "classnames";
import { set } from "lodash";
import React, { useEffect, useState } from "react";

const AnimateOnMount = ({
  children,
  animationDisabled = false,
}: {
  children: JSX.Element;
  animationDisabled?: boolean;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!animationDisabled) {
      setIsVisible(true);
    }
    // Trigger animation on mount
  }, []);

  console.log("isVisible", isVisible);
  console.log("animationDisabled", animationDisabled);
  return (
    <div
      className={classNames(
        // "animate-pulse",
        // "transform transition-all duration-250 ease-in-out",
        // isVisible ? `opacity-100` : "opacity-0",
        // animating ? "scale-120" : "scale-100"
        isVisible ? `animate-scaleUpDown` : ""
      )}
    >
      {children}
    </div>
  );
};

export default AnimateOnMount;

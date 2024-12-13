import classNames from "classnames";
import React, { useEffect, useState } from "react";

const AnimateOnMount = ({
  children,
  enabled = false,
}: {
  children: JSX.Element;
  enabled?: boolean;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // Trigger animation on mount
  }, []);

  if (!enabled) {
    return children;
  }

  return (
    <div
      className={classNames(
        isVisible ? `animate-scaleUpDown` : "opacity-0 scale-75"
      )}
    >
      {children}
    </div>
  );
};

export default AnimateOnMount;

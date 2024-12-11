import classNames from "classnames";
import ElementIcon from "../ElementIcon";
import ElementCodeEnum from "../../../types/elements";
import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import React from "react";

function BoardLoader() {
  const grid = new Array(8).fill(null).map(() => new Array(8).fill(null));
  return (
    <div className="border border-custom-border">
      {grid.map((row, i) => (
        <div key={i} className="flex flex-row">
          {row.map((cell, j) => (
            <div
              key={j}
              className={classNames(
                "select-none",
                "w-10 h-10 xxs:h-12 xxs:w-12 text-2xl border border-custom-border flex items-center justify-center"
              )}
            >
              <IconAnimated />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const IconAnimated = () => {
  const [activeIcon, setActiveIcon] = useState(0);
  const icons = shuffle([
    ElementCodeEnum.fire,
    ElementCodeEnum.water,
    ElementCodeEnum.air,
    ElementCodeEnum.earth,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIcon((prev) => (prev + 1) % icons.length);
    }, 400);

    return () => clearInterval(interval);
  }, [icons.length]);
  return <ElementIcon element={icons[activeIcon]} />;
};

export default BoardLoader;

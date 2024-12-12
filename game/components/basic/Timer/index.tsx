import React from "react";
import { useEffect, useState } from "react";

function Timer({ on }: { on: boolean }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!on) {
        return;
      }
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [on]);

  return (
    <div className="text-lg text-custom-border font-extrabold flex items-end">{`Time: ${Math.floor(
      time / 60
    )}:${time % 60 < 10 ? `0${time % 60}` : time % 60}`}</div>
  );
}

export default Timer;

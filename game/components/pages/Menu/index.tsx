import { useNavigate } from "react-router";
import ElementCodeEnum from "../../../types/elements";
import Button from "../../basic/Button";
import ElementIcon from "../../basic/ElementIcon";
import React from "react";

function Menu() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="mb-1 ">
        <div className="flex">
          <div className="p-1 border-r-4 border-b-4 border-custom-border">
            <ElementIcon element={ElementCodeEnum.air} />
          </div>
          <div className="p-1 border-b-4 border-custom-border">
            <ElementIcon element={ElementCodeEnum.fire} />
          </div>
        </div>
        <div className="flex">
          <div className="p-1 border-r-4  border-custom-border">
            <ElementIcon element={ElementCodeEnum.water} />
          </div>
          <div className="p-1">
            <ElementIcon element={ElementCodeEnum.earth} />
          </div>
        </div>
      </div>
      <div className="text-custom-border font-semibold text-3xl mb-8">
        ELEMENTAL SYNERGY
      </div>
      <div className="flex flex-col w-[250px]">
        <Button onClick={() => navigate("/easy")} dark fullWidth>
          EASY
        </Button>

        <div className="mb-3" />
        <Button onClick={() => navigate("/medium")} dark fullWidth>
          MEDIUM
        </Button>

        <div className="mb-3" />
        <Button onClick={() => navigate("/hard")} dark fullWidth>
          HARD
        </Button>

        <div className="mb-3" />
        <Button onClick={() => navigate("/how-to-play")} dark fullWidth>
          HOW TO PLAY
        </Button>
      </div>
      <div className="h-[100px] text-custom-bg">...</div>
    </div>
  );
}

export default Menu;

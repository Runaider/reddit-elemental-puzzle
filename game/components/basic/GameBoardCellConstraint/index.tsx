import classNames from "classnames";
import React from "react";
import Constraint from "../../../models/Constraint";
import useWindowDimensions from "../../../hooks/useWindowDimensions";

type Props = {
  constraint: Constraint;
};

function GameBoardCellConstraint({ constraint }: Props) {
  const { width } = useWindowDimensions();
  const cellSize = 52;
  const iconSize = 20;
  const containerBorderSize = 3;
  return (
    <div
      className={classNames(
        "absolute bg-custom-border w-5 h-5 rounded-3xl flex justify-center items-center"
      )}
      style={
        width > 419
          ? {
              top:
                constraint.cell1.row < constraint.cell2.row
                  ? containerBorderSize +
                    constraint.cell2.row * cellSize -
                    iconSize / 2
                  : containerBorderSize +
                    constraint.cell1.row * cellSize +
                    cellSize / 2 -
                    iconSize / 2,

              left:
                constraint.cell1.col < constraint.cell2.col
                  ? containerBorderSize +
                    constraint.cell2.col * cellSize -
                    iconSize / 2
                  : containerBorderSize +
                    constraint.cell1.col * cellSize +
                    cellSize / 2 -
                    iconSize / 2,
            }
          : {
              top:
                constraint.cell1.row < constraint.cell2.row
                  ? constraint.cell2.row * 52 - 10
                  : constraint.cell1.row * 52 + 10,

              left:
                constraint.cell1.col < constraint.cell2.col
                  ? constraint.cell2.col * 52 - 10 // 12 is half of the icon
                  : constraint.cell1.col * 52 + 10,
            }
      }
    >
      {constraint.type == "synergy" ? (
        <div className="h-5 w-5">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              fill="#fcf7e9"
              d="M11.016 21h-1.031l1.031-6.984h-3.516q-0.75 0-0.375-0.656 0.141-0.234 0.047-0.141 2.391-4.172 5.813-10.219h1.031l-1.031 6.984h3.516q0.656 0 0.422 0.656z"
            ></path>
          </svg>
        </div>
      ) : (
        <div className="h-3 w-3">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0  32 32"
          >
            <path
              fill="#fcf7e9"
              d="M31.708 25.708c-0-0-0-0-0-0l-9.708-9.708 9.708-9.708c0-0 0-0 0-0 0.105-0.105 0.18-0.227 0.229-0.357 0.133-0.356 0.057-0.771-0.229-1.057l-4.586-4.586c-0.286-0.286-0.702-0.361-1.057-0.229-0.13 0.048-0.252 0.124-0.357 0.228 0 0-0 0-0 0l-9.708 9.708-9.708-9.708c-0-0-0-0-0-0-0.105-0.104-0.227-0.18-0.357-0.228-0.356-0.133-0.771-0.057-1.057 0.229l-4.586 4.586c-0.286 0.286-0.361 0.702-0.229 1.057 0.049 0.13 0.124 0.252 0.229 0.357 0 0 0 0 0 0l9.708 9.708-9.708 9.708c-0 0-0 0-0 0-0.104 0.105-0.18 0.227-0.229 0.357-0.133 0.355-0.057 0.771 0.229 1.057l4.586 4.586c0.286 0.286 0.702 0.361 1.057 0.229 0.13-0.049 0.252-0.124 0.357-0.229 0-0 0-0 0-0l9.708-9.708 9.708 9.708c0 0 0 0 0 0 0.105 0.105 0.227 0.18 0.357 0.229 0.356 0.133 0.771 0.057 1.057-0.229l4.586-4.586c0.286-0.286 0.362-0.702 0.229-1.057-0.049-0.13-0.124-0.252-0.229-0.357z"
            ></path>
          </svg>
        </div>
      )}
    </div>
  );
}

export default GameBoardCellConstraint;

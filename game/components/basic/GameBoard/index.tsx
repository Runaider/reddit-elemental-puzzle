import React from "react";
import BoardLoader from "../BordLoader";
import GridCell from "../../../models/Cell";
import Constraint from "../../../models/Constraint";
import classNames from "classnames";
import ElementIcon from "../ElementIcon";
import GameBoardCellConstraint from "../GameBoardCellConstraint";

type Props = {
  grid?: GridCell[][] | null;
  errorCells: boolean[][] | null;
  disabledCells: GridCell[][] | null;
  constraints: Constraint[];
  isGeneratingPuzzle: boolean;
  isSolved: boolean;
  onCellClick: (row: number, col: number) => void;
};

function GameBoard({
  grid,
  disabledCells,
  errorCells,
  constraints,
  isGeneratingPuzzle,
  isSolved,
  onCellClick,
}: Props) {
  return (
    <div className="relative">
      {!grid || isGeneratingPuzzle ? (
        <BoardLoader />
      ) : (
        <div className="flex flex-col cursor-pointer border border-custom-border  ">
          {grid.map((row, i) => (
            <div key={i} className="flex flex-row cursor-pointer">
              {row.map((cell, j) => (
                <div
                  key={j}
                  onClick={() => onCellClick(i, j)}
                  //     () => {
                  //   if (disabledCells![i][j].value == null) {
                  //     setCellValue(i, j, getNextCellValue(i, j));
                  //   }
                  // }
                  // }
                  className={classNames(
                    "select-none",
                    "w-10 h-10 xxs:w-12 xxs:h-12  text-2xl border border-custom-border flex items-center justify-center",
                    disabledCells![i][j].value === null
                      ? ""
                      : "bg-custom-muted",
                    errorCells![i][j] ? "" : "bg-pastel-red",
                    isSolved ? "bg-pastel-green" : ""
                  )}
                >
                  {" "}
                  {cell?.value ? <ElementIcon element={cell.value} /> : ""}
                  {/* {cell?.value ? (
                  <ElementIcon element={cell.value} />
                ) : hintsVisible ? (
                  <span className="text-custom-border">
                    {cell.possibleValues.size}
                  </span>
                ) : (
                  ""
                )} */}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {constraints.map((constraint, i) => (
        <GameBoardCellConstraint constraint={constraint} key={i} />
      ))}

      {/* {constraints.map((constraint, i) => (
        <div
          key={i}
          className={classNames(
            "absolute bg-custom-border w-5 h-5 rounded-3xl flex justify-center items-center"
          )}
          style={
            width > 419
              ? {
                  top:
                    constraint.cell1.row < constraint.cell2.row
                      ? constraint.cell2.row * 48 - 10
                      : constraint.cell1.row * 48 + 14,

                  left:
                    constraint.cell1.col < constraint.cell2.col
                      ? constraint.cell2.col * 48 - 10 // 12 is half of the icon
                      : constraint.cell1.col * 48 + 14,
                }
              : {
                  top:
                    constraint.cell1.row < constraint.cell2.row
                      ? constraint.cell2.row * 40 - 10
                      : constraint.cell1.row * 40 + 10,

                  left:
                    constraint.cell1.col < constraint.cell2.col
                      ? constraint.cell2.col * 40 - 10 // 12 is half of the icon
                      : constraint.cell1.col * 40 + 10,
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
      ))} */}
      {/* {isSolved && (
        <>
          <div className="absolute z-100 top-0 left-0 w-full h-full flex justify-center items-center opacity-30 bg-custom-bg" />
          <div className="absolute z-100 top-0 left-0 w-full h-full flex justify-center items-center rounded">
            <div className="bg-custom-bg w-[300px] p-6">
              <div className="text-2xl mb-1 h-8 font-semibold text-green-600">
                Solved!
              </div>
              <div className="text-md mb-4 h-8 font-semibold text-custom-border">
                Time: {Math.floor(solvingTimeRef.current / 60)}m{" "}
                {solvingTimeRef.current % 60}s
              </div>
              <Button
                dark
                onClick={() =>
                  window.parent.postMessage({ type: "close" }, "*")
                }
              >
                Done
              </Button>
            </div>
          </div>
        </>
      )} */}
    </div>
  );
}

export default GameBoard;

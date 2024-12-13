import React, { useCallback } from "react";
import BoardLoader from "../BordLoader";
import GridCell from "../../../models/Cell";
import Constraint from "../../../models/Constraint";
import classNames from "classnames";
import ElementIcon from "../ElementIcon";
import GameBoardCellConstraint from "../GameBoardCellConstraint";
import "./styles.css";

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
        <GameGrid
          grid={grid}
          onCellClick={onCellClick}
          disabledCells={disabledCells}
          errorCells={errorCells}
          isSolved={isSolved}
        />
      )}
      {constraints.map((constraint, i) => (
        <GameBoardCellConstraint constraint={constraint} key={i} />
      ))}
    </div>
  );
}

const GameGrid = ({
  grid,
  onCellClick,
  disabledCells,
  errorCells,
  isSolved,
}: {
  grid: GridCell[][];
  onCellClick: (row: number, col: number) => void;
  disabledCells: GridCell[][] | null;
  errorCells: boolean[][] | null;
  isSolved: boolean;
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);

  const onIconFirstLoad = useCallback(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  return (
    <div className="flex flex-col cursor-pointer bg-custom-border p-[3px] rounded-md shadow-md">
      {grid.map((row, i) => (
        <div key={i} className="flex flex-row cursor-pointer">
          {row.map((cell, j) => (
            <div
              className={classNames(
                "relative",
                "hover:scale-105",
                errorCells![i][j] ? "" : "animate-shake "
              )}
              key={`${i}${j}`}
              onClick={() => onCellClick(i, j)}
            >
              <div
                key={j}
                className={classNames(
                  "absolute w-12 h-12 top-[2px] left-[2px] rounded-md",
                  !errorCells![i][j] && "shadow-custom-inner shadow-red-500"
                )}
              ></div>
              <div
                className={classNames(
                  "select-none",
                  "w-10 h-10 xxs:w-12 xxs:h-12  text-2xl m-[2px] flex items-center justify-center rounded-md",
                  "transition-shadow  duration-300 shadow-custom-inner-highlight",
                  "transition-colors duration-500",
                  disabledCells![i][j].value === null
                    ? "bg-custom-bg"
                    : "bg-custom-muted"
                  // isLoaded ? "bg-green-600" : "bg-pink-600"
                  // isSolved ? "bg-pastel-green" : ""
                )}
              >
                {" "}
                <ElementIcon
                  element={cell.value}
                  key={`${i}${j}${cell.value ?? "_"}`}
                  withAnimation={
                    disabledCells![i][j].value === null ? isLoaded : false
                  }
                  onMount={onIconFirstLoad}
                />
              </div>
            </div>
            // <div
            //   key={j}
            //   className={classNames(
            //     errorCells![i][j]
            //       ? ""
            //       : "animate-shake shadow-custom-inner shadow-red-500"
            //   )}
            // >
            //   <div
            //     onClick={() => onCellClick(i, j)}
            //     className={classNames(
            //       "select-none",
            //       "w-10 h-10 xxs:w-12 xxs:h-12  text-2xl m-[2px] flex items-center justify-center rounded-md",
            //       "transition-shadow  duration-300 shadow-custom-inner-highlight hover:scale-105",
            //       "transition-colors duration-500",
            //       disabledCells![i][j].value === null
            //         ? "bg-custom-bg"
            //         : "bg-custom-muted"

            //       // isSolved ? "bg-pastel-green" : ""
            //     )}
            //   >
            //     {" "}
            //     <ElementIcon
            //       element={cell.value}
            //       withAnimation={
            //         disabledCells![i][j].value === null ? isLoaded : false
            //       }
            //       onMount={onIconFirstLoad}
            //     />
            //   </div>
            // </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;

import React, { useCallback } from "react";
import BoardLoader from "../BordLoader";
import GridCell from "../../../models/Cell";
import Constraint from "../../../models/Constraint";
import classNames from "classnames";
import ElementIcon from "../ElementIcon";
import GameBoardCellConstraint from "../GameBoardCellConstraint";
import { CSSTransitionGroup } from "react-transition-group"; // ES6
import "./styles.css";
import { set } from "lodash";
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
              key={j}
              className={classNames(
                errorCells![i][j]
                  ? ""
                  : "animate-shake shadow-custom-inner shadow-red-500"
              )}
            >
              <div
                onClick={() => onCellClick(i, j)}
                className={classNames(
                  "select-none",
                  "w-10 h-10 xxs:w-12 xxs:h-12  text-2xl m-[2px] flex items-center justify-center rounded-md",
                  "transition-shadow  duration-300 shadow-custom-inner-highlight hover:scale-105",
                  "transition-colors duration-500",
                  disabledCells![i][j].value === null
                    ? "bg-custom-bg"
                    : "bg-custom-muted"

                  // isSolved ? "bg-pastel-green" : ""
                )}
              >
                {" "}
                {cell?.value ? (
                  <ElementIcon
                    element={cell.value}
                    key={`${i}${j}${cell.value}`}
                    withAnimation={isLoaded}
                    onMount={onIconFirstLoad}
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;

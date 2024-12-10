import React from "react";
import classNames from "classnames";
import Constraint from "../../../models/constraint";
import { useGame } from "../../../hooks/useGame";
import { useEffect, useState } from "react";
import IconButton from "../../basic/IconButton";
import Button from "../../basic/Button";
import { isGridSolved } from "../../../utils/gridUtils";
import ElementIcon from "../../basic/ElementIcon";
import BoardLoader from "../../basic/BordLoader";
import { XMarkIcon } from "@heroicons/react/24/solid";
import useWindowDimensions from "../../../hooks/useWindowDimensions";

const defaultConstraints = [
  new Constraint({ row: 1, col: 0 }, { row: 1, col: 1 }),
  new Constraint({ row: 3, col: 5 }, { row: 4, col: 5 }),
  new Constraint({ row: 5, col: 3 }, { row: 5, col: 4 }),
];

const generateConstraints = (gridSize: number, constraintCount: number = 3) => {
  const constraints: Constraint[] = [];

  for (let i = 0; i < constraintCount; i++) {
    const row = Math.floor(Math.random() * (gridSize - 2));
    const col = Math.floor(Math.random() * (gridSize - 2));
    const isRow = Math.random() > 0.5;
    constraints.push(
      new Constraint(
        { row: row, col: col },
        { row: isRow ? row + 1 : row, col: isRow ? col : col + 1 }
      )
    );
  }
  return constraints;
};

function Game({
  difficulty = "medium",
}: {
  difficulty: "tutorial" | "easy" | "medium" | "hard";
}) {
  const { width } = useWindowDimensions();
  console.log("Width", width);
  const solvingTimeRef = React.useRef<number>(0);
  const solvingTimeIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [hintsVisible, setHintsVisible] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const constraints = defaultConstraints;

  const {
    difficulty: gameDifficulty,
    grid,
    puzzleGrid,
    errorGrid,
    isGeneratingPuzzle,
    setCellValue,
    getNextCellValue,
  } = useGame(8, difficulty, constraints);

  useEffect(() => {
    if (grid) {
      console.log("Grid updated", grid);
      const solved = isGridSolved(grid);
      console.log("Grid updated solved", solved);

      setIsSolved(solved);
      console.log("Grid updated solved after setIsSolved", solved);

      if (solved) {
        console.log("Grid updated ifSolved passed");
        setShowCelebration(true);

        if (solvingTimeIntervalRef.current) {
          clearInterval(solvingTimeIntervalRef.current);
        }

        // console.log("POSTING MESSAGE");
        try {
          window.parent.postMessage({ type: "solved", grid: grid }, "*");
        } catch (e) {
          console.error("Error posting message", e);
        }
      }
    }
  }, [grid]);

  useEffect(() => {
    // track solving time

    solvingTimeIntervalRef.current = setInterval(() => {
      solvingTimeRef.current += 1;
    }, 1000);

    return () => {
      if (solvingTimeIntervalRef.current) {
        clearInterval(solvingTimeIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    window.parent.postMessage({ type: "started" }, "*");
    // console.log("POSTED STARTED");
  }, [gameDifficulty]);

  useEffect(() => {
    if (showCelebration == true) {
      setTimeout(() => {
        setShowCelebration(false);
      }, 2700);
    }
  }, [showCelebration]);

  return (
    <div>
      <div className="text-2xl mb-2 h-8 font-semibold text-custom-main-text flex justify-end">
        <IconButton
          icon={<XMarkIcon className="h-5 w-5" />}
          onClick={() => {
            window.parent.postMessage({ type: "close" }, "*");
          }}
        />
        {/* {!grid || isGeneratingPuzzle
            ? `Generating ${gameDifficulty} puzzle`
            : `Solving ${gameDifficulty} puzzle`} */}
      </div>

      <div className="relative border border-custom-border">
        {!grid || isGeneratingPuzzle ? (
          <BoardLoader />
        ) : (
          grid.map((row, i) => (
            <div key={i} className="flex flex-row cursor-pointer">
              {row.map((cell, j) => (
                <div
                  key={j}
                  onClick={() => {
                    if (puzzleGrid![i][j].value == null) {
                      setCellValue(i, j, getNextCellValue(i, j));
                    }
                  }}
                  className={classNames(
                    "select-none",
                    "w-10 h-10 xxs:w-12 xxs:h-12  text-2xl border border-custom-border flex items-center justify-center",
                    puzzleGrid![i][j].value === null ? "" : "bg-custom-muted",
                    errorGrid![i][j] ? "" : "bg-pastel-red",
                    isSolved ? "bg-pastel-green" : ""
                  )}
                >
                  {cell?.value ? (
                    <ElementIcon element={cell.value} />
                  ) : hintsVisible ? (
                    <span className="text-custom-border">
                      {cell.possibleValues.size}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </div>
          ))
        )}

        {constraints.map((constraint, i) => (
          <div
            key={i}
            className={classNames(
              "absolute bg-custom-border w-5 h-5 rounded-3xl"
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
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="-1 -1 24 24"
            >
              <path
                fill="#fcf7e9"
                d="M11.016 21h-1.031l1.031-6.984h-3.516q-0.75 0-0.375-0.656 0.141-0.234 0.047-0.141 2.391-4.172 5.813-10.219h1.031l-1.031 6.984h3.516q0.656 0 0.422 0.656z"
              ></path>
            </svg>
          </div>
        ))}
        {isSolved && (
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
        )}
      </div>
      {showCelebration && (
        <div className="absolute z-100 top-0 left-0">
          <img
            src="./congratulations.gif"
            className="w-screen h-screen"
            alt="celebration"
          />
        </div>
      )}

      {/* {grid && !isGeneratingPuzzle ? (
        <div className="flex flex-row justify-end mt-4 ">
          <Button onClick={() => setHintsVisible(!hintsVisible)}>Hints</Button>
        </div>
      ) : (
        <div className="text-custom-bg h-[52px]">...</div>
      )} */}
    </div>
  );
}

export default Game;

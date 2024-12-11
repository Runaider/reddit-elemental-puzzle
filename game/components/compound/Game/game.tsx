import React from "react";
import { useGame } from "../../../hooks/useGame";
import { useEffect, useState } from "react";
import IconButton from "../../basic/IconButton";
import Button from "../../basic/Button";
import { isGridSolved } from "../../../utils/gridUtils";
import { XMarkIcon } from "@heroicons/react/24/solid";
import GameBoard from "../../basic/GameBoard";
import { useAppTypeContext } from "../../../contexts/appTypeContext";

function Game({}: {}) {
  const solvingTimeRef = React.useRef<number>(0);
  const solvingTimeIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [hintsVisible, setHintsVisible] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  // const constraints = [];
  const { encodedPuzzle, difficulty, isDaily } = useAppTypeContext();

  const {
    difficulty: gameDifficulty,
    grid,
    constraints,
    puzzleGrid,
    errorGrid,
    isGeneratingPuzzle,
    setCellValue,
    getNextCellValue,
  } = useGame(8, difficulty, encodedPuzzle);

  useEffect(() => {
    if (grid) {
      const solved = isGridSolved(grid);

      setIsSolved(solved);

      if (solved) {
        setShowCelebration(true);

        if (solvingTimeIntervalRef.current) {
          clearInterval(solvingTimeIntervalRef.current);
        }

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
    if (isDaily) {
      window.parent.postMessage({ type: "started" }, "*");
    }
  }, [isDaily]);

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

      <div className="relative">
        <GameBoard
          grid={grid}
          errorCells={errorGrid}
          disabledCells={puzzleGrid}
          constraints={constraints}
          isGeneratingPuzzle={isGeneratingPuzzle}
          isSolved={isSolved}
          onCellClick={(row, col) => {
            if (puzzleGrid![row][col].value == null) {
              setCellValue(row, col, getNextCellValue(row, col));
            }
          }}
        />
        {/* {!grid || isGeneratingPuzzle ? (
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
        )} */}

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

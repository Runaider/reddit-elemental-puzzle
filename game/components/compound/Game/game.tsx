import React from "react";
import { useGame } from "../../../hooks/useGame";
import { useEffect, useState } from "react";
import IconButton from "../../basic/IconButton";
import { isGridSolved } from "../../../utils/gridUtils";
import { XMarkIcon } from "@heroicons/react/24/solid";
import GameBoard from "../../basic/GameBoard";
import { useAppTypeContext } from "../../../contexts/appTypeContext";
import "./styles.css";
import Timer from "../../basic/Timer";

function Game({}: {}) {
  const solvingTimeRef = React.useRef<number>(0);
  const solvingTimeIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [hintsVisible, setHintsVisible] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const isSolvedIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
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

      if (solved) {
        if (isSolvedIntervalRef.current) {
          clearInterval(isSolvedIntervalRef.current);
        }
        isSolvedIntervalRef.current = setInterval(() => {
          setIsSolved(solved);
        }, 800);

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
      }, 3500);
    }
  }, [showCelebration]);

  return (
    <div>
      <div className="text-2xl mb-2 h-8 font-semibold text-custom-main-text flex justify-between">
        <div className="flex items-end ml-[3px] mb-[-5px]">
          <Timer on={!isSolved} />
        </div>
        <IconButton
          icon={<XMarkIcon className="h-5 w-5" />}
          onClick={() => {
            window.parent.postMessage({ type: "close" }, "*");
          }}
        />
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
      </div>
      {isSolved && (
        <>
          <div className="absolute z-30 top-0 left-0 w-full h-full flex justify-center items-center opacity-30 bg-[#352c06]" />
          <div className="absolute z-50 top-0 left-0 w-full h-full justify-center items-center flex flex-col">
            {/* <div className="solved-text text-4xl font-extrabold text-green-500 text-center uppercase tracking-wider border-4 border-green-500 px-5 py-2 rounded-lg bg-green-50 shadow-lg shadow-gray-400 hover:scale-105 hover:shadow-2xl transition-transform">
              Solved!
            </div> */}
            <div className="solved-text animate-fadeIn duration-500">
              SOLVED!
            </div>
            <div className="px-4 py-2 text-4xl font-extrabold text-custom-border bg-custom-bg rounded-lg min-w-[300px] shadow-custom-inner-highlight-hover animate-fadeIn duration-700">
              TIME: {Math.floor(solvingTimeRef.current / 60)}m{" "}
              {solvingTimeRef.current % 60}s
            </div>

            {/* <Button
              onClick={() => window.parent.postMessage({ type: "close" }, "*")}
              size="extra-large"
              dark
            >
              DONE
            </Button> */}
            {/* <div className="bg-custom-bg w-[300px] p-6 rounded shadow-md">
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
            </div> */}
          </div>
        </>
      )}
      {/* {showCelebration && (
        <div className="absolute z-40 top-0 left-0">
          <img
            src="./congratulations.gif"
            className="w-screen h-screen"
            alt="celebration"
          />
        </div>
      )} */}

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

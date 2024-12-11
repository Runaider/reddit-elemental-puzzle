import React, { useEffect } from "react";
import { useGame } from "../../../hooks/useGame";
import { encodedTutorialGrid } from "../../../mocks/tutorialGrid";
import GameBoard from "../../basic/GameBoard";
import { isGridSolved } from "../../../utils/gridUtils";
import classNames from "classnames";
import Button from "../../basic/Button";
import { cloneDeep } from "lodash";
import ElementCodeEnum from "../../../types/elements";
import { useAppTypeContext } from "../../../contexts/appTypeContext";

const overlayGridCellsDefault = Array.from({ length: 8 }, () =>
  Array.from({ length: 8 }, () => ({ type: "gray-out" }))
);

function Tutorial() {
  const { finishTutorial } = useAppTypeContext();
  const [tutorialStep, setTutorialStep] = React.useState(0);
  const {
    grid,
    puzzleGrid,
    constraints,
    errorGrid,
    isGeneratingPuzzle,
    setCellValue,
    getNextCellValue,
  } = useGame(8, "tutorial", encodedTutorialGrid);

  const [overlayGridCells, setOverlayGridCells] = React.useState<
    {
      type:
        | "none"
        | "highlight"
        | "notice-border"
        | "notice-bg"
        | "target-border"
        | "target-bg"
        | "block"
        | "gray-out";
    }[][]
  >(cloneDeep(overlayGridCellsDefault));

  const onStep0NextClick = () => {
    setTutorialStep(1);
  };

  const onStep1NextClick = () => {
    setTutorialStep(2);
    const modifiedGrid = cloneDeep(overlayGridCells);
    modifiedGrid[0][0] = { type: "target-border" };

    modifiedGrid[0][1] = { type: "notice-bg" };
    modifiedGrid[0][2] = { type: "notice-bg" };
    modifiedGrid[0][3] = { type: "notice-bg" };
    modifiedGrid[0][4] = { type: "notice-bg" };
    modifiedGrid[0][5] = { type: "notice-bg" };
    modifiedGrid[0][6] = { type: "notice-bg" };
    modifiedGrid[0][7] = { type: "notice-bg" };

    modifiedGrid[1][0] = { type: "notice-bg" };
    modifiedGrid[2][0] = { type: "notice-bg" };
    modifiedGrid[3][0] = { type: "notice-bg" };
    modifiedGrid[4][0] = { type: "notice-bg" };
    modifiedGrid[5][0] = { type: "notice-bg" };
    modifiedGrid[6][0] = { type: "notice-bg" };
    modifiedGrid[7][0] = { type: "notice-bg" };
    setOverlayGridCells(modifiedGrid);
  };

  const onStep2NextClick = () => {
    setTutorialStep(3);
    const modifiedGrid = cloneDeep(overlayGridCellsDefault);
    modifiedGrid[6][6] = { type: "target-bg" };
    modifiedGrid[6][5] = { type: "target-bg" };
    modifiedGrid[5][6] = { type: "target-bg" };
    modifiedGrid[5][5] = { type: "target-bg" };

    setOverlayGridCells(modifiedGrid);
  };

  const onStep3NextClick = () => {
    setTutorialStep(4);
    const modifiedGrid = cloneDeep(overlayGridCellsDefault);
    modifiedGrid[6][0] = { type: "notice-bg" };
    modifiedGrid[6][1] = { type: "notice-bg" };
    modifiedGrid[6][2] = { type: "notice-bg" };
    modifiedGrid[6][3] = { type: "notice-bg" };
    modifiedGrid[6][4] = { type: "notice-bg" };
    modifiedGrid[6][5] = { type: "target-bg" };
    modifiedGrid[6][6] = { type: "target-bg" };
    modifiedGrid[6][7] = { type: "notice-bg" };

    setOverlayGridCells(modifiedGrid);
  };

  const onStep4NextClick = () => {
    setTutorialStep(5);
    const modifiedGrid = cloneDeep(overlayGridCellsDefault);
    modifiedGrid[0][6] = { type: "notice-bg" };
    modifiedGrid[1][6] = { type: "notice-bg" };
    modifiedGrid[2][6] = { type: "notice-bg" };
    modifiedGrid[3][6] = { type: "target-bg" };
    modifiedGrid[4][6] = { type: "target-bg" };
    modifiedGrid[5][6] = { type: "notice-bg" };
    modifiedGrid[6][6] = { type: "notice-bg" };
    modifiedGrid[7][6] = { type: "notice-bg" };

    setOverlayGridCells(modifiedGrid);
  };

  const onStep5NextClick = () => {
    setTutorialStep(6);
    const modifiedGrid = cloneDeep(overlayGridCellsDefault);
    modifiedGrid[6][6] = { type: "target-border" };

    modifiedGrid[6][0] = { type: "notice-bg" };
    modifiedGrid[6][1] = { type: "notice-bg" };
    modifiedGrid[6][2] = { type: "notice-bg" };
    modifiedGrid[6][3] = { type: "notice-bg" };
    modifiedGrid[6][4] = { type: "notice-bg" };
    modifiedGrid[6][5] = { type: "notice-bg" };
    modifiedGrid[6][7] = { type: "notice-bg" };

    modifiedGrid[0][6] = { type: "notice-bg" };
    modifiedGrid[1][6] = { type: "notice-bg" };
    modifiedGrid[2][6] = { type: "notice-bg" };
    modifiedGrid[3][6] = { type: "notice-bg" };
    modifiedGrid[4][6] = { type: "notice-bg" };
    modifiedGrid[5][6] = { type: "notice-bg" };
    modifiedGrid[7][6] = { type: "notice-bg" };

    setOverlayGridCells(modifiedGrid);
  };

  const onStep6NextClick = () => {
    setTutorialStep(7);
    const modifiedGrid = cloneDeep(overlayGridCellsDefault);

    setOverlayGridCells(modifiedGrid);
  };

  const onStep7NextClick = () => {
    setTutorialStep(8);

    const modifiedGrid = cloneDeep(overlayGridCellsDefault);

    modifiedGrid[5][6] = { type: "target-border" };
    modifiedGrid[6][5] = { type: "target-border" };
    modifiedGrid[5][5] = { type: "target-border" };

    modifiedGrid[6][0] = { type: "notice-bg" };
    modifiedGrid[6][1] = { type: "notice-bg" };
    modifiedGrid[6][2] = { type: "notice-bg" };
    modifiedGrid[6][3] = { type: "notice-bg" };
    modifiedGrid[6][4] = { type: "notice-bg" };
    // modifiedGrid[6][5] = { type: "notice-bg" };
    modifiedGrid[6][6] = { type: "notice-bg" };
    modifiedGrid[6][7] = { type: "notice-bg" };
    modifiedGrid[5][0] = { type: "notice-bg" };
    modifiedGrid[5][1] = { type: "notice-bg" };
    modifiedGrid[5][2] = { type: "notice-bg" };
    modifiedGrid[5][3] = { type: "notice-bg" };
    modifiedGrid[5][4] = { type: "notice-bg" };
    // modifiedGrid[5][5] = { type: "notice-bg" };
    // modifiedGrid[5][6] = { type: "notice-bg" };
    modifiedGrid[5][7] = { type: "notice-bg" };

    modifiedGrid[0][6] = { type: "notice-bg" };
    modifiedGrid[1][6] = { type: "notice-bg" };
    modifiedGrid[2][6] = { type: "notice-bg" };
    modifiedGrid[3][6] = { type: "notice-bg" };
    modifiedGrid[4][6] = { type: "notice-bg" };
    // modifiedGrid[5][6] = { type: "notice-bg" };
    modifiedGrid[6][6] = { type: "notice-bg" };
    modifiedGrid[7][6] = { type: "notice-bg" };
    modifiedGrid[0][5] = { type: "notice-bg" };
    modifiedGrid[1][5] = { type: "notice-bg" };
    modifiedGrid[2][5] = { type: "notice-bg" };
    modifiedGrid[3][5] = { type: "notice-bg" };
    modifiedGrid[4][5] = { type: "notice-bg" };
    // modifiedGrid[5][5] = { type: "notice-bg" };
    // modifiedGrid[6][5] = { type: "notice-bg" };
    modifiedGrid[7][5] = { type: "notice-bg" };

    setOverlayGridCells(modifiedGrid);
  };

  const onStep8NextClick = () => {
    setTutorialStep(9);
    const modifiedGrid = cloneDeep(overlayGridCellsDefault);

    setOverlayGridCells(modifiedGrid);
  };

  const onStep9NextClick = () => {
    setTutorialStep(10);
    const modifiedGrid = cloneDeep(overlayGridCellsDefault);

    setOverlayGridCells(modifiedGrid);
  };

  const onStep10NextClick = () => {
    setTutorialStep(11);
    const modifiedGrid = cloneDeep(overlayGridCellsDefault);
    // 4/3 4/5
    modifiedGrid[4][2] = { type: "target-border" };
    modifiedGrid[5][2] = { type: "notice-bg" };
    modifiedGrid[4][4] = { type: "target-border" };
    modifiedGrid[5][4] = { type: "notice-bg" };
    setOverlayGridCells(modifiedGrid);
  };

  const onStep12NextClick = () => {
    setTutorialStep(13);
    const modifiedGrid = cloneDeep(overlayGridCellsDefault);

    setOverlayGridCells(modifiedGrid);
  };

  const onStep13NextClick = () => {
    setTutorialStep(14);
    finishTutorial();
  };

  const onOverlayCellClick = (row: number, col: number) => {
    if (
      tutorialStep === 2 &&
      row == 0 &&
      col == 0 &&
      grid![0][0].value != ElementCodeEnum.earth
    ) {
      const nextCellValue = getNextCellValue(row, col);
      setCellValue(row, col, nextCellValue);
      if (nextCellValue === ElementCodeEnum.earth) {
        setTimeout(() => {
          onStep2NextClick();
        }, 400);
      }
    }

    if (
      tutorialStep === 6 &&
      row == 6 &&
      col == 6 &&
      grid![6][6].value != ElementCodeEnum.air
    ) {
      const nextCellValue = getNextCellValue(row, col);
      setCellValue(row, col, nextCellValue);
      if (nextCellValue === ElementCodeEnum.air) {
        setTimeout(() => {
          onStep6NextClick();
        }, 400);
      }
    }

    if (
      tutorialStep === 8 &&
      ((row === 5 && col === 6) ||
        (row === 6 && col === 5) ||
        (row === 5 && col === 5))
    ) {
      const nextCellValue = getNextCellValue(row, col);
      setCellValue(row, col, nextCellValue);
      //   if (nextCellValue === ElementCodeEnum.air) {
      //     setTimeout(() => {
      //       onStep*NextClick();
      //     }, 400);
      //   }
    }

    if (
      tutorialStep === 11 &&
      ((row === 4 && col === 2) || (row === 4 && col === 4))
    ) {
      const nextCellValue = getNextCellValue(row, col);
      setCellValue(row, col, nextCellValue);
      //   if (nextCellValue === ElementCodeEnum.air) {
      //     setTimeout(() => {
      //       onStep*NextClick();
      //     }, 400);
      //   }
    }
  };

  useEffect(() => {
    if (tutorialStep == 8) {
      if (
        grid![5][6].value === ElementCodeEnum.earth &&
        grid![6][5].value === ElementCodeEnum.fire &&
        grid![5][5].value === ElementCodeEnum.earth
      ) {
        onStep8NextClick();
      }
    }
    if (tutorialStep == 11) {
      if (
        grid![4][2].value === ElementCodeEnum.earth &&
        grid![4][4].value === ElementCodeEnum.water
      ) {
        onStep12NextClick();
      }
    }
  }, [grid]);

  return (
    <div>
      <div className="h-10 text-2xl font-semibold text-custom-border">
        Tutorial
      </div>
      <div className="relative">
        <GameBoard
          grid={grid}
          errorCells={errorGrid}
          disabledCells={puzzleGrid}
          constraints={constraints}
          isGeneratingPuzzle={isGeneratingPuzzle}
          isSolved={false}
          onCellClick={(row, col) => {
            if (puzzleGrid![row][col].value == null) {
              setCellValue(row, col, getNextCellValue(row, col));
            }
          }}
        />
        <div className="absolute z-10 h-full w-full top-0 border border-custom-border">
          {overlayGridCells.map((row, i) => (
            <div key={i} className="flex flex-row">
              {row.map((cell, j) => (
                <div
                  key={j}
                  className={classNames(
                    "w-10 h-10 xxs:w-12 xxs:h-12 text-2xl  flex items-center justify-center",
                    cell.type === "gray-out"
                      ? "opacity-70 bg-custom-muted"
                      : "",
                    cell.type === "highlight" ? "bg-green-900 opacity-30" : "",
                    cell.type === "target-border"
                      ? "shadow-custom-inner shadow-green-700"
                      : "",
                    cell.type === "target-bg" ? "bg-green-700 opacity-30" : "",
                    cell.type === "notice-border"
                      ? "shadow-custom-inner shadow-yellow-500"
                      : "",
                    cell.type === "notice-bg" ? "bg-yellow-300 opacity-30" : ""
                  )}
                  onClick={() => {
                    onOverlayCellClick(i, j);
                  }}
                >
                  {" "}
                </div>
              ))}
            </div>
          ))}
        </div>
        {/* STEP 1 */}
        {tutorialStep === 0 && (
          <div className="absolute z-20 h-full w-full top-0 bg-custom-muted">
            <div className="h-full flex flex-col">
              <div className="mt-6 flex flex-col flex-grow flex-1">
                <h3 className="text-lg font-semibold text-custom-main-text">
                  Welcome to Element Synergy
                </h3>

                <div className="mt-3 mx-4 text-md text-custom-main-text text-left">
                  The goal of the game is to fill the grid with elements, in a
                  way that each row and column contains each element exactly{" "}
                  <b>2 times.</b>
                </div>
                <div className="mx-4 text-md text-custom-main-text mt-2 text-left">
                  You can click on a cell to change its value.
                </div>
              </div>
              <div className="flex justify-center  mx-4 my-4">
                <Button onClick={onStep0NextClick} dark>
                  Start
                </Button>
                <div className="w-4" />
                <Button onClick={finishTutorial} dark>
                  Skip
                </Button>
              </div>
            </div>
          </div>
        )}
        {tutorialStep === 1 && (
          <div className="absolute z-20 h-full w-full top-0 ">
            <div className="h-full flex flex-col">
              <div className="mt-6 flex flex-col flex-grow flex-1 pt-4">
                {/* <h3 className="text-lg font-semibold text-custom-main-text">
                  Welcome to Element Synergy
                </h3> */}

                <div className="mt-3 mx-14 p-1 rounded-sm  text-md text-custom-main-text font-medium text-left bg-custom-muted-dark">
                  Pay attention to first row and first column.
                </div>
                <div className="mx-14 p-1 rounded-sm  text-md text-custom-main-text font-medium text-left bg-custom-muted-dark">
                  They have one element missing.
                </div>
                <div className="mx-14 p-1 rounded-sm text-md text-custom-main-text font-medium text-left bg-custom-muted-dark">
                  Try to fill in that element.
                </div>
                {/* <div className="mx-4 text-md text-custom-main-text mt-2 text-left">
                  You can click on a cell to change its value.
                </div> */}
              </div>
              <div className="flex justify-end  mx-4 my-4">
                <Button onClick={onStep1NextClick} dark>
                  Okay
                </Button>
              </div>
            </div>
          </div>
        )}
        {tutorialStep === 3 && (
          <div className="absolute z-20 h-full w-full top-0 ">
            <div className="h-full flex flex-col">
              <div className="mt-6 flex flex-col flex-grow flex-1 pt-4">
                <div className="mt-3 mx-14 p-1 rounded-sm  text-md text-custom-main-text font-medium text-left bg-custom-muted-dark">
                  Great!
                </div>
                <div className="mx-14 p-1 rounded-sm  text-md text-custom-main-text font-medium text-left bg-custom-muted-dark">
                  Now let's try to fill in a bit more complex fragment of the
                  puzzle
                </div>
                <div className="mx-14 p-1 rounded-sm  text-md text-custom-main-text font-medium text-left bg-custom-muted-dark">
                  You will notice that there are 4 cells that are missing an
                  element.
                </div>
                {/* <div className="mx-4 text-md text-custom-main-text mt-2 text-left">
                  You can click on a cell to change its value.
                </div> */}
              </div>
              <div className="flex justify-center  mx-4 my-4">
                <Button onClick={onStep3NextClick} dark>
                  Okay
                </Button>
              </div>
            </div>
          </div>
        )}
        {tutorialStep === 4 && (
          <div className="absolute z-20 h-full w-full top-0 ">
            <div className="h-full flex flex-col">
              <div className="mt-6 flex flex-col flex-grow flex-1 pt-4">
                <div className="mx-14 p-1 rounded-sm  text-md text-custom-main-text font-medium text-left bg-custom-muted-dark">
                  Lets focus on this row
                </div>
                <div className="mx-14 p-1 rounded-sm  text-md text-custom-main-text font-medium text-left bg-custom-muted-dark">
                  We see that there are 2 cells that are missing an element.
                  From the other cells we can see that the missing elements are
                  Fire and Wind.
                </div>
                <div className="mx-14 p-1 rounded-sm  text-md text-custom-main-text font-medium text-left bg-custom-muted-dark">
                  To figure out which element goes where, we need to look at the
                  columns.
                </div>

                {/* <div className="mx-4 text-md text-custom-main-text mt-2 text-left">
                  You can click on a cell to change its value.
                </div> */}
              </div>
              <div className="flex justify-center  mx-4 my-4">
                <Button onClick={onStep4NextClick} dark>
                  Okay
                </Button>
              </div>
            </div>
          </div>
        )}

        {tutorialStep === 5 && (
          <div className="absolute z-20 h-full w-full top-0 ">
            <div className="h-full flex flex-col">
              <div className="mt-6 flex flex-col flex-grow flex-1 pt-4">
                <div className="ml-1 mr-[98px] p-1 rounded-sm  text-md text-custom-main-text font-medium text-left bg-custom-muted-dark">
                  We see that in this column there already are 2 Fire elements.
                </div>
                <div className="ml-1  mr-[98px] p-1 rounded-sm  text-md text-custom-main-text font-medium text-left bg-custom-muted-dark">
                  So we know that that the missing element cannot be Fire.
                </div>
                <div className="ml-1  mr-[98px] p-1 rounded-sm  text-md text-custom-main-text font-medium text-left bg-custom-muted-dark">
                  In the next step fill in the right element in the highlighted
                  cell.
                </div>

                {/* <div className="mx-4 text-md text-custom-main-text mt-2 text-left">
                  You can click on a cell to change its value.
                </div> */}
              </div>
              <div className="flex justify-center  mx-4 my-4">
                <Button onClick={onStep5NextClick} dark>
                  Okay
                </Button>
              </div>
            </div>
          </div>
        )}

        {tutorialStep === 7 && (
          <div className="absolute z-20 h-full w-full top-0 ">
            <div className="h-full flex flex-col">
              <div className="mt-6 flex flex-col flex-grow flex-1 pt-4">
                <div className=" mx-14  p-1 rounded-sm  text-md text-custom-main-text font-medium text-left bg-custom-muted-dark">
                  Great
                </div>
                <div className=" mx-14  p-1 rounded-sm  text-md text-custom-main-text font-medium text-left bg-custom-muted-dark">
                  You now know the basics of the game.
                </div>
                <div className="mx-14  p-1 rounded-sm  text-md text-custom-main-text font-medium text-left bg-custom-muted-dark">
                  Solve the rest of the missing elements in highlighted
                  fragment, using the skill you just learned
                </div>

                {/* <div className="mx-4 text-md text-custom-main-text mt-2 text-left">
                  You can click on a cell to change its value.
                </div> */}
              </div>
              <div className="flex justify-center  mx-4 my-4">
                <Button onClick={onStep7NextClick} dark>
                  Okay
                </Button>
              </div>
            </div>
          </div>
        )}

        {tutorialStep === 9 && (
          <div className="absolute z-20 h-full w-full top-0 ">
            <div className="h-full flex flex-col">
              <div className="mt-6 flex flex-col flex-grow flex-1 pt-4">
                <div className="mx-14  p-1 rounded-sm  text-md text-custom-main-text font-medium text-left bg-custom-muted-dark">
                  You are doing great!
                </div>
                <div className="mx-14  p-1 rounded-sm  text-md text-custom-main-text font-medium text-left bg-custom-muted-dark">
                  Using this technique you can solve all the puzzles no matter
                  the difficulty.
                </div>
                <div className="mx-14  p-1 rounded-sm  text-md text-custom-main-text font-medium text-left bg-custom-muted-dark">
                  There will always be at least one cell that has only one
                  possible value.
                </div>
              </div>
              <div className="flex justify-center  mx-4 my-4">
                <Button onClick={onStep9NextClick} dark>
                  Okay
                </Button>
              </div>
            </div>
          </div>
        )}

        {tutorialStep === 10 && (
          <div className="absolute z-20 h-full w-full top-0 ">
            <div className="h-full flex flex-col">
              <div className="mt-6 flex flex-col flex-grow flex-1 pt-4">
                <div className=" mx-6  p-1 rounded-sm  text-md text-custom-main-text font-medium text-left bg-custom-muted-dark">
                  There is one more rule to discuss.
                </div>
                <div className=" mx-6  p-1 rounded-sm  text-md text-custom-main-text font-medium text-left bg-custom-muted-dark">
                  You might notice that some cells are linked by a symbol:
                  <div
                    className={
                      "inline-block bg-custom-border w-5 h-5 mb-[-4px] rounded-3xl"
                    }
                  >
                    {" "}
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
                  </div>{" "}
                  or{" "}
                  <div
                    className={
                      "inline-block bg-custom-border w-5 h-5 p-1 p-1 mb-[-4px] rounded-3xl"
                    }
                  >
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
                </div>
                <div className="mx-6  p-1 rounded-sm  text-md text-custom-main-text font-medium text-left bg-custom-muted-dark">
                  - Cells linked by:{" "}
                  <div
                    className={
                      "inline-block bg-custom-border w-5 h-5 mb-[-4px] rounded-3xl"
                    }
                  >
                    {" "}
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
                  </div>{" "}
                  can only contain elements that synergize. Fire x Wind or Water
                  x Earth
                </div>
                <div className="mx-6  p-1 rounded-sm  text-md text-custom-main-text font-medium text-left bg-custom-muted-dark">
                  - Cells linked by:{" "}
                  <div
                    className={
                      "inline-block bg-custom-border w-5 h-5 mb-[-4px] rounded-3xl"
                    }
                  >
                    {" "}
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
                  </div>{" "}
                  can only contain elements that counter each other. Fire x
                  Water or Wind x Earth
                </div>

                {/* <div className="mx-4 text-md text-custom-main-text mt-2 text-left">
                  You can click on a cell to change its value.
                </div> */}
              </div>
              <div className="flex justify-center  mx-4 my-4">
                <Button onClick={onStep10NextClick} dark>
                  Okay
                </Button>
              </div>
            </div>
          </div>
        )}

        {tutorialStep === 13 && (
          <div className="absolute z-20 h-full w-full top-0 ">
            <div className="h-full flex flex-col">
              <div className="mt-6 flex flex-col flex-grow flex-1 pt-4">
                <div className="mx-14  p-1 rounded-sm  text-md text-custom-main-text font-medium text-left bg-custom-muted-dark">
                  Congratulations!
                </div>
                <div className="mx-14  p-1 rounded-sm  text-md text-custom-main-text font-medium text-left bg-custom-muted-dark">
                  You have completed the tutorial!
                </div>
              </div>
              <div className="flex justify-center  mx-4 my-4">
                <Button onClick={onStep13NextClick} dark>
                  Finish
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tutorial;

import React, { useEffect } from "react";
import { useGame } from "../../../hooks/useGame";
import { encodedTutorialGrid } from "../../../mocks/tutorialGrid";
import GameBoard from "../../basic/GameBoard";
import classNames from "classnames";
import Button from "../../basic/Button";
import { cloneDeep } from "lodash";
import ElementCodeEnum from "../../../types/elements";
import { useAppTypeContext } from "../../../contexts/appTypeContext";
import ExplanatoryText from "./components/ExplenatoryText";
import ExplanatoryHeadlineText from "./components/ExplenatoryHeadlineText";
import ElementIcon from "../../basic/ElementIcon";
import PuzzleDifficulty from "../../../types/puzzleDifficulty";

const overlayGridCellsDefault = Array.from({ length: 8 }, () =>
  Array.from(
    { length: 8 },
    () =>
      ({ type: "gray-out" } as {
        type:
          | "none"
          | "highlight"
          | "notice-border"
          | "notice-bg"
          | "target-border"
          | "target-bg"
          | "block"
          | "gray-out";
      })
  )
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
  } = useGame(8, PuzzleDifficulty.Easy, encodedTutorialGrid);

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
      <div className="h-10 text-2xl font-extrabold text-custom-border">
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
        <div className="absolute z-10 h-full w-full top-0 p-[3px] border border-custom-border">
          {overlayGridCells.map((row, i) => (
            <div key={i} className="flex flex-row">
              {row.map((cell, j) => (
                <div
                  key={j}
                  className={classNames(
                    "w-[52px] h-[52px] text-2xl rounded-md  flex items-center justify-center",
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
          <div className="absolute z-20 h-[calc(100%+10px)] w-[calc(100%+10px)] mt-[-5px] ml-[-5px] top-0 p-[3px] bg-custom-muted rounded-lg shadow-lg">
            <div className="h-full flex flex-col">
              <div className="mt-4 flex flex-col flex-grow flex-1">
                <h3 className="text-lg font-bold text-custom-main-text">
                  Welcome to
                </h3>
                <div className="mt-[-4px] ">
                  <ExplanatoryHeadlineText>
                    Element Synergy
                  </ExplanatoryHeadlineText>
                </div>

                {/* <h3 className="mt-[-4px] text-xl font-extrabold text-custom-main-text"></h3> */}
                <div className="mt-6" />
                <ExplanatoryText>
                  Fill the grid so each row and column contains every element
                  exactly
                  <b> 2 times.</b>
                </ExplanatoryText>
                <div className="mt-2" />
                <ExplanatoryText>
                  Click a cell to change its value.
                </ExplanatoryText>
              </div>
              <div className="flex justify-center  mx-4 my-4">
                <div className="w-[100px]">
                  <Button
                    onClick={onStep0NextClick}
                    size="large"
                    dark
                    fullWidth
                  >
                    START
                  </Button>
                </div>
                <div className="w-4" />

                <div className="w-[100px]">
                  <Button onClick={finishTutorial} size="large" dark fullWidth>
                    SKIP
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {tutorialStep === 1 && (
          <div className="absolute z-20 h-full w-full top-0  p-[3px] ">
            <div className="h-full flex flex-col">
              <div className="mt-12 flex flex-col flex-grow flex-1 pt-4 ">
                {/* <h3 className="text-lg font-semibold text-custom-main-text">
                  Welcome to Element Synergy
                </h3> */}
                <div className="bg-custom-muted rounded-lg shadow-lg p-2 w-[350px] mx-auto border border-custom-border">
                  <ExplanatoryText>
                    Focus on the first row and column.
                  </ExplanatoryText>
                  <ExplanatoryText>
                    Find the missing element and fill it in.
                  </ExplanatoryText>
                </div>
                {/* <div className="mt-3 mx-14 p-1 rounded-sm  text-md text-custom-main-text font-medium text-left bg-custom-muted-dark">
                  Pay attention to first row and first column.
                </div>
                <div className="mx-14 p-1 rounded-sm  text-md text-custom-main-text font-medium text-left bg-custom-muted-dark">
                  They have one element missing.
                </div>
                <div className="mx-14 p-1 rounded-sm text-md text-custom-main-text font-medium text-left bg-custom-muted-dark">
                  Try to fill in that element.
                </div> */}
                {/* <div className="mx-4 text-md text-custom-main-text mt-2 text-left">
                  You can click on a cell to change its value.
                </div> */}
              </div>
              <div className="flex justify-center  mx-4 my-4">
                <div className="w-[100px] shadow-lg">
                  <Button onClick={onStep1NextClick} dark fullWidth>
                    OKAY
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {tutorialStep === 3 && (
          <div className="absolute z-20 h-full w-full top-0 p-[3px]">
            <div className="h-full flex flex-col">
              <div className="mt-6 flex flex-col flex-grow flex-1 pt-4">
                <div className="bg-custom-muted rounded-lg shadow-lg p-2 w-[350px] mx-auto border border-custom-border">
                  <ExplanatoryHeadlineText>Great job!</ExplanatoryHeadlineText>
                  <ExplanatoryText>
                    Now, tackle a more complex part of the puzzle.
                  </ExplanatoryText>
                  <ExplanatoryText>
                    Notice the 4 cells missing an element.
                  </ExplanatoryText>
                </div>
              </div>
              <div className="flex justify-center  mx-4 my-4">
                <div className="w-[100px] shadow-lg">
                  <Button onClick={onStep3NextClick} dark fullWidth>
                    OKAY
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {tutorialStep === 4 && (
          <div className="absolute z-20 h-full w-full top-0 p-[3px]">
            <div className="h-full flex flex-col">
              <div className="mt-6 flex flex-col flex-grow flex-1 pt-4">
                <div className="bg-custom-muted rounded-lg shadow-lg p-2 w-[350px] mx-auto border border-custom-border">
                  <ExplanatoryText>Focus on this row.</ExplanatoryText>
                  <ExplanatoryText>
                    <div className="inline-block">
                      Two cells are missing elements:{" "}
                      <div className="inline-block mb-[-6px]">
                        <ElementIcon
                          size="small"
                          element={ElementCodeEnum.fire}
                        />
                      </div>{" "}
                      and{" "}
                      <div className="inline-block mb-[-6px]">
                        <ElementIcon
                          size="small"
                          element={ElementCodeEnum.air}
                        />
                      </div>
                      .
                    </div>
                  </ExplanatoryText>
                  <ExplanatoryText>
                    Check the columns to figure out which element goes where.
                  </ExplanatoryText>
                </div>
              </div>
              <div className="flex justify-center  mx-4 my-4">
                <div className="w-[100px] shadow-lg">
                  <Button onClick={onStep4NextClick} dark fullWidth>
                    OKAY
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tutorialStep === 5 && (
          <div className="absolute z-20 h-full w-full top-0 p-[3px]">
            <div className="h-full flex flex-col">
              <div className="mt-6 flex flex-col flex-grow flex-1 pt-4">
                <div className="bg-custom-muted rounded-lg shadow-lg p-2 w-[300px] ml-2 border border-custom-border">
                  <ExplanatoryText>
                    This column already has 2{" "}
                    <div className="inline-block mb-[-6px]">
                      <ElementIcon
                        size="small"
                        element={ElementCodeEnum.fire}
                      />
                    </div>{" "}
                    elements, so the missing element can't be{" "}
                    <div className="inline-block mb-[-6px]">
                      <ElementIcon
                        size="small"
                        element={ElementCodeEnum.fire}
                      />
                    </div>
                    .
                  </ExplanatoryText>

                  <ExplanatoryText>
                    Fill in the correct element in the highlighted cell.{" "}
                  </ExplanatoryText>
                </div>

                {/* <div className="mx-4 text-md text-custom-main-text mt-2 text-left">
                  You can click on a cell to change its value.
                </div> */}
              </div>
              <div className="flex justify-center  mx-4 my-4">
                <div className="w-[100px] shadow-lg">
                  <Button onClick={onStep5NextClick} dark fullWidth>
                    OKAY
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tutorialStep === 7 && (
          <div className="absolute z-20 h-full w-full top-0 p-[3px]">
            <div className="h-full flex flex-col">
              <div className="mt-6 flex flex-col flex-grow flex-1 pt-4">
                <div className="bg-custom-muted rounded-lg shadow-lg p-2 w-[350px] mx-auto border border-custom-border">
                  <ExplanatoryHeadlineText>Great!</ExplanatoryHeadlineText>
                  <div className="h-4" />
                  <ExplanatoryText>You’ve learned the basics.</ExplanatoryText>
                  <ExplanatoryText>
                    Now, use your new skills to solve the remaining highlighted
                    cells.
                  </ExplanatoryText>
                </div>
              </div>
              <div className="flex justify-center  mx-4 my-4">
                <div className="w-[100px] shadow-lg">
                  <Button onClick={onStep7NextClick} dark fullWidth>
                    OKAY
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tutorialStep === 9 && (
          <div className="absolute z-20 h-full w-full top-0 p-[3px]">
            <div className="h-full flex flex-col">
              <div className="mt-6 flex flex-col flex-grow flex-1 pt-4">
                <div className="bg-custom-muted rounded-lg shadow-lg p-2 w-[350px] mx-auto border border-custom-border">
                  <ExplanatoryHeadlineText>
                    You’re doing great!
                  </ExplanatoryHeadlineText>
                  <ExplanatoryText>
                    With this technique, you can solve any puzzle.
                  </ExplanatoryText>
                  <ExplanatoryText>
                    There will always be a cell with only one possible value.
                  </ExplanatoryText>
                </div>
              </div>
              <div className="flex justify-center  mx-4 my-4">
                <div className="w-[100px] shadow-lg">
                  <Button onClick={onStep9NextClick} dark fullWidth>
                    OKAY
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tutorialStep === 10 && (
          <div className="absolute z-20 h-full w-full top-0 p-[3px]">
            <div className="h-full flex flex-col">
              <div className="mt-6 flex flex-col flex-grow flex-1 pt-4">
                <div className="bg-custom-muted rounded-lg shadow-lg p-2 w-[350px] mx-auto border border-custom-border">
                  <ExplanatoryHeadlineText>
                    One more rule to note
                  </ExplanatoryHeadlineText>
                  <ExplanatoryText>
                    Some cells are linked by symbols:{" "}
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
                    .
                  </ExplanatoryText>
                  <div className="mt-2" />
                  <ExplanatoryText>
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
                    </div>
                    : Linked cells must synergize (
                    <div className="inline-block mb-[-6px]">
                      <ElementIcon
                        size="small"
                        element={ElementCodeEnum.fire}
                      />
                    </div>{" "}
                    x{" "}
                    <div className="inline-block mb-[-6px]">
                      <ElementIcon size="small" element={ElementCodeEnum.air} />
                    </div>{" "}
                    or{" "}
                    <div className="inline-block mb-[-6px]">
                      <ElementIcon
                        size="small"
                        element={ElementCodeEnum.water}
                      />
                    </div>{" "}
                    x{" "}
                    <div className="inline-block mb-[-6px]">
                      <ElementIcon
                        size="small"
                        element={ElementCodeEnum.earth}
                      />
                    </div>
                    ).
                  </ExplanatoryText>
                  <div className="mt-2" />

                  <ExplanatoryText>
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
                    : Linked cells must counter each other (
                    <div className="inline-block mb-[-6px]">
                      <ElementIcon
                        size="small"
                        element={ElementCodeEnum.fire}
                      />
                    </div>{" "}
                    x{" "}
                    <div className="inline-block mb-[-6px]">
                      <ElementIcon
                        size="small"
                        element={ElementCodeEnum.water}
                      />
                    </div>{" "}
                    or{" "}
                    <div className="inline-block mb-[-6px]">
                      <ElementIcon size="small" element={ElementCodeEnum.air} />
                    </div>{" "}
                    x{" "}
                    <div className="inline-block mb-[-6px]">
                      <ElementIcon
                        size="small"
                        element={ElementCodeEnum.earth}
                      />
                    </div>
                    ).
                  </ExplanatoryText>
                </div>
              </div>
              <div className="flex justify-center  mx-4 my-4">
                <div className="w-[100px] shadow-lg">
                  <Button onClick={onStep10NextClick} dark fullWidth>
                    OKAY
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tutorialStep === 13 && (
          <div className="absolute z-20 h-full w-full top-0 p-[3px]">
            <div className="h-full flex flex-col">
              <div className="mt-6 flex flex-col flex-grow flex-1 pt-4">
                <div className="bg-custom-muted rounded-lg shadow-lg p-2 w-[350px] mx-auto border border-custom-border">
                  <ExplanatoryHeadlineText>
                    Congratulations!
                  </ExplanatoryHeadlineText>
                  <ExplanatoryText>
                    You have completed the tutorial!
                  </ExplanatoryText>
                </div>
              </div>
              <div className="flex justify-center  mx-4 my-4">
                <div className="w-[100px] shadow-lg">
                  <Button onClick={onStep13NextClick} dark fullWidth>
                    FINISH
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tutorial;

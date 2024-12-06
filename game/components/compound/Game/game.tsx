import classNames from "classnames";
import Constraint from "../../../models/constraint";
import { useGame } from "../../../hooks/useGame";
import { useEffect, useMemo, useState } from "react";
import Button from "../../basic/Button";
import { isGridSolved } from "../../../utils/gridUtils";
import ElementIcon from "../../basic/ElementIcon";
import BoardLoader from "../../basic/BordLoader";

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
  // console.log("Game", difficulty);
  const [hintsVisible, setHintsVisible] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  // const constraints = useMemo(() => generateConstraints(8, 3), []);
  const constraints = defaultConstraints; // useMemo(() => generateConstraints(8, 3), []);
  // console.log("Constraints", constraints);
  const {
    grid,
    puzzleGrid,
    errorGrid,
    isGeneratingPuzzle,
    setCellValue,
    getNextCellValue,
  } = useGame(8, difficulty, constraints);

  useEffect(() => {
    // console.log("Grid changed", grid);
  }, [grid]);

  useEffect(() => {
    if (grid) {
      setIsSolved(isGridSolved(grid));
    }
  }, [grid]);

  useEffect(() => {
    console.log("PuzzleGrid changed", puzzleGrid);
  }, [puzzleGrid]);

  return (
    <div>
      {isSolved ? (
        <div className="text-2xl mb-2 font-semibold text-green-600">
          Solved!
        </div>
      ) : (
        <div className="text-2xl mb-2 font-semibold text-custom-main-text">
          {!grid || isGeneratingPuzzle
            ? `Generating ${difficulty} puzzle`
            : `Solving ${difficulty} puzzle`}
        </div>
      )}
      {/* <div className="flex justify-end mb-2 mr-2">
        <IconButton icon={<ArrowUturnLeftIcon className=" h-5 w-5" />} />
      </div> */}
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
                    "w-12 h-12 text-2xl border border-custom-border flex items-center justify-center",
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
            style={{
              top:
                constraint.cell1.row < constraint.cell2.row
                  ? constraint.cell2.row * 48 - 10
                  : constraint.cell1.row * 48 + 14,

              left:
                constraint.cell1.col < constraint.cell2.col
                  ? constraint.cell2.col * 48 - 10 // 12 is half of the icon
                  : constraint.cell1.col * 48 + 14,
            }}
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
      </div>
      {grid && !isGeneratingPuzzle ? (
        <div className="flex flex-row justify-end mt-4 ">
          <Button onClick={() => setHintsVisible(!hintsVisible)}>Hints</Button>
        </div>
      ) : (
        <div className="text-custom-bg h-[52px]">...</div>
      )}
    </div>
  );
}

export default Game;

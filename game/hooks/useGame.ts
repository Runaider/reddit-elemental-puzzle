import { useState, useMemo, useCallback, useEffect } from "react";
import { cloneDeep, debounce } from "lodash";
import Constraint from "../models/Constraint";
import { decodePuzzle, jsonToGrid, updateGridCell } from "../utils/gridUtils";
import ElementCodeEnum from "../types/elements";
import GridCell from "../models/Cell";
import { useAppTypeContext } from "../contexts/appTypeContext";
import generateConstraints from "../utils/generateConstraints";
import PuzzleDifficulty from "../types/puzzleDifficulty";

const worker = new Worker(new URL("/gridWorker.js", import.meta.url), {
  type: "module", // Ensures the worker runs in ES module mode
});

export const useGame = (
  gridSize: number = 8,
  difficulty: PuzzleDifficulty = PuzzleDifficulty.Medium,
  encodedPuzzle?: string | null
) => {
  const [isGeneratingPuzzle, setIsGeneratingPuzzle] = useState(false);

  const [puzzleGrid, setPuzzleGrid] = useState<GridCell[][] | null>(null);
  const [grid, setGrid] = useState(puzzleGrid);
  const [constraints, setConstraints] = useState<Constraint[]>([]);
  const [errorGrid, setErrorGrid] = useState<boolean[][] | null>(
    Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => true)
    )
  );

  const memoisedSetErrorGrid = useMemo(() => debounce(setErrorGrid, 1200), []);
  // debounce ussing lodash debounce
  const setDebouncedErrorGrid = useCallback(
    (grid: GridCell[][]) => {
      const newGrid = grid.map((row) => row.map((cell) => cell.isValid));
      memoisedSetErrorGrid(newGrid);
    },
    [memoisedSetErrorGrid]
  );

  const setCellValue = useCallback(
    (row: number, column: number, value: ElementCodeEnum | null) => {
      const updatedGrid = updateGridCell(grid!, row, column, value);

      setGrid([...updatedGrid]);
      setDebouncedErrorGrid([...updatedGrid]);
    },
    [grid, setDebouncedErrorGrid]
  );

  const getNextCellValue = useMemo(
    () =>
      (row: number, column: number): ElementCodeEnum | null => {
        const currentCell = grid![row][column];
        switch (currentCell.value) {
          case null:
            return ElementCodeEnum.fire;
          case ElementCodeEnum.fire:
            return ElementCodeEnum.water;
          case ElementCodeEnum.water:
            return ElementCodeEnum.earth;
          case ElementCodeEnum.earth:
            return ElementCodeEnum.air;
          case ElementCodeEnum.air:
            return null;
          default:
            return null;
        }
      },
    [grid]
  );

  const createPuzzle = async () => {
    if (encodedPuzzle) {
      // Encoded puzzle is loaded from the parent
      const { puzzle, constraints } = decodePuzzle(encodedPuzzle);

      const newGrid = jsonToGrid(puzzle);
      setGrid(cloneDeep(newGrid));
      setConstraints(constraints);
      setPuzzleGrid(cloneDeep(newGrid));
      setIsGeneratingPuzzle(false);
    } else {
      setIsGeneratingPuzzle(true);
      const constraints = generateConstraints(3, gridSize);
      setConstraints(constraints);
      worker.postMessage({
        gridSize: gridSize,
        constraints: constraints,
        difficulty: difficulty,
      });
    }
  };

  const resetPuzzle = useCallback(() => {
    setGrid(puzzleGrid);
  }, [puzzleGrid]);

  useEffect(() => {
    createPuzzle();
  }, []);

  useEffect(() => {
    // Receive messages from the worker
    worker.onmessage = (e) => {
      const { success, data } = e.data;
      if (success) {
        const gridCellData = data.map((row) =>
          row.map((cell) => GridCell.fromJSON(cell))
        );
        gridCellData.forEach((row) => {
          row.forEach((cell) => {
            cell.updatePossibleValues(gridCellData);
          });
        });
        setGrid(cloneDeep(gridCellData));
        setPuzzleGrid(cloneDeep(gridCellData));
        setIsGeneratingPuzzle(false);

        // Update the UI with the received data
      } else {
        console.error("Failed to create puzzle");
        setIsGeneratingPuzzle(false);
      }
    };

    worker.onmessageerror = (e) => {
      console.error("Message error:", e);
    };

    // Handle worker errors
    worker.onerror = (error) => {
      console.error("Worker error:", error.message);
    };
  }, []);

  return useMemo(
    () => ({
      difficulty: difficulty,
      grid,
      constraints,
      puzzleGrid,
      errorGrid,
      isGeneratingPuzzle,
      setCellValue,
      getNextCellValue,
      resetPuzzle,
    }),
    [
      difficulty,
      grid,
      constraints,
      puzzleGrid,
      errorGrid,
      isGeneratingPuzzle,
      setCellValue,
      getNextCellValue,
      resetPuzzle,
    ]
  );
};

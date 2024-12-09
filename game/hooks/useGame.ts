import { useState, useMemo, useCallback, useEffect } from "react";
import { cloneDeep, debounce } from "lodash";
import Constraint from "../models/constraint";
import { decodePuzzle, jsonToGrid, updateGridCell } from "../utils/gridUtils";
import ElementCodeEnum from "../types/elements";
import GridCell from "../models/Cell";
import { useAppTypeContext } from "../contexts/appTypeContext";

const worker = new Worker(new URL("/gridWorker.js", import.meta.url), {
  type: "module", // Ensures the worker runs in ES module mode
});

export const useGame = (
  gridSize: number = 8,
  difficulty: "tutorial" | "easy" | "medium" | "hard" = "medium",
  constraints: Constraint[] = []
) => {
  const { encodedPuzzle, encodedPuzzleDifficulty } = useAppTypeContext();
  const [isGeneratingPuzzle, setIsGeneratingPuzzle] = useState(false);

  const [puzzleGrid, setPuzzleGrid] = useState<GridCell[][] | null>(null);
  const [grid, setGrid] = useState(puzzleGrid);
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

  const validateGrid = useMemo(() => {
    if (!grid) {
      return { invalidColumns: [], invalidRows: [] };
    }
    const invalidColumns = [];
    const invalidRows = [];

    // check invalid rows
    for (let i = 0; i < grid!.length; i++) {
      const elementCounts = {
        [ElementCodeEnum.fire]: 0,
        [ElementCodeEnum.water]: 0,
        [ElementCodeEnum.earth]: 0,
        [ElementCodeEnum.air]: 0,
      };
      for (let j = 0; j < grid!.length; j++) {
        const cell = grid![i][j];
        if (cell) {
          elementCounts[cell]++;
        }
      }
      if (
        Object.values(elementCounts).some((count) => count !== 2) ||
        Object.values(elementCounts).length !== 4
      ) {
        invalidRows.push(i);
      }
    }

    //  check invalid columns
    for (let i = 0; i < grid!.length; i++) {
      const elementCounts = {
        [ElementCodeEnum.fire]: 0,
        [ElementCodeEnum.water]: 0,
        [ElementCodeEnum.earth]: 0,
        [ElementCodeEnum.air]: 0,
      };
      for (let j = 0; j < grid!.length; j++) {
        const cell = grid![j][i];
        if (cell) {
          elementCounts[cell]++;
        }
      }
      if (
        Object.values(elementCounts).some((count) => count !== 2) ||
        Object.values(elementCounts).length !== 4
      ) {
        invalidColumns.push(i);
      }
    }

    return { invalidColumns, invalidRows };
  }, [grid]);

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
      console.log("Encoded puzzle:", encodedPuzzle);
      const decodedPuzzle = decodePuzzle(encodedPuzzle);
      console.log("Decoded puzzle:", decodedPuzzle);
      const newGrid = jsonToGrid(decodedPuzzle);
      setGrid(cloneDeep(newGrid));
      setPuzzleGrid(cloneDeep(newGrid));
      setIsGeneratingPuzzle(false);
    } else {
      setIsGeneratingPuzzle(true);

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
      difficulty: encodedPuzzleDifficulty || difficulty,
      grid,
      puzzleGrid,
      errorGrid,
      isGeneratingPuzzle,
      validateGrid,
      setCellValue,
      getNextCellValue,
      resetPuzzle,
    }),
    [
      difficulty,
      encodedPuzzleDifficulty,
      grid,
      puzzleGrid,
      errorGrid,
      isGeneratingPuzzle,
      validateGrid,
      setCellValue,
      getNextCellValue,
      resetPuzzle,
    ]
  );
};

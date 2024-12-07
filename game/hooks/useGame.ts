import { useState, useMemo, useCallback, useEffect } from "react";
import { cloneDeep, debounce, throttle } from "lodash";
import Constraint from "../models/constraint";
import {
  createPuzzle as createPuzzleGrid,
  decodePuzzle,
  encodePuzzle,
  jsonToGrid,
  updateGridCell,
} from "../utils/gridUtils";
import ElementCodeEnum from "../types/elements";
import GridCell from "../models/Cell";

// const exampleEncoding =
//   "eyJyb3dzIjoiRkUuLldBQS58Vy4uQVcuRS58QUVXRkVBLi58LkFXLkZGRUF8RS4uQUUuV0Z8LkZBLi4uV0V8LldGLi5XLkZ8RldBVy4uRi4iLCJjb25zdHJhaW50c1N0cmluZyI6InN5bmVyZ3k6MSwwOjEsMXxzeW5lcmd5OjEsMDoxLDF8c3luZXJneTozLDU6NCw1fHN5bmVyZ3k6Myw1OjQsNXxzeW5lcmd5OjUsMzo1LDR8c3luZXJneTo1LDM6NSw0In0=";

const worker = new Worker(new URL("/gridWorker.js", import.meta.url), {
  type: "module", // Ensures the worker runs in ES module mode
});

export const useGame = (
  gridSize: number = 8,
  difficulty: "tutorial" | "easy" | "medium" | "hard" = "medium",
  constraints: Constraint[] = [],
  encodedPuzzle: string
) => {
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
    // setIsGeneratingPuzzle(true);

    // const puzzle = createPuzzleGrid(gridSize, constraints, difficulty);
    // setGrid(cloneDeep(puzzle));
    // setPuzzleGrid(cloneDeep(puzzle));
    // setIsGeneratingPuzzle(false);

    // const worker = new Worker(new URL("./gridWorker.js", import.meta.url), {
    //   type: "module", // Ensures the worker runs in ES module mode
    // });

    // Send data to the worker

    // if (encodedPuzzle) {
    //   const decodedPuzzle = decodePuzzle(encodedPuzzle);
    //   setGrid();
    //   setPuzzleGrid(decodedPuzzle);
    //   return;
    // }

    if (encodedPuzzle) {
      const decodedPuzzle = decodePuzzle(encodedPuzzle);
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

    // setIsGeneratingPuzzle(true);

    // worker.postMessage({
    //   gridSize: gridSize,
    //   constraints: constraints,
    //   difficulty: difficulty,
    // });
  };

  const resetPuzzle = useCallback(() => {
    setGrid(puzzleGrid);
  }, [puzzleGrid]);

  useEffect(() => {
    console.warn("Creating puzzle!!!");

    createPuzzle();
  }, []);

  useEffect(() => {
    // Receive messages from the worker
    worker.onmessage = (e) => {
      const { success, data } = e.data;
      console.log("Worker message:", e.data);
      if (success) {
        console.log("Puzzle created successfully:", data);
        // convert data to GridCell[][]
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
        const encodedPuzzle = encodePuzzle(gridCellData);
        console.log("Encoded puzzle:", encodedPuzzle);
        const decodedPuzzle = decodePuzzle(encodedPuzzle);
        console.log("Decoded puzzle:", decodedPuzzle);
        console.log(
          "Decoded puzzle converted to grid:",
          jsonToGrid(decodedPuzzle)
        );

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

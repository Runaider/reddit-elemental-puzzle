import { cloneDeep, shuffle } from "lodash";
import ElementCodeEnum from "../types/elements";

("../utils/gridUtils");
import GridCell from "../models/Cell";
import Constraint from "../models/constraint";

const createEmptyGrid = (
  gridSize: number,
  elements: ElementCodeEnum[],
  constraints: Constraint[]
): GridCell[][] => {
  return Array.from({ length: gridSize }, (_, row) =>
    Array.from({ length: gridSize }, (_, column) => {
      const cellContraints = constraints.filter(
        (constraint) =>
          (constraint.cell1.row === row && constraint.cell1.col === column) ||
          (constraint.cell2.row === row && constraint.cell2.col === column)
      );
      return new GridCell(row, column, null, new Set(elements), cellContraints);
    })
  );
};

const updateGridCell = (
  grid: GridCell[][],
  row: number,
  col: number,
  value: ElementCodeEnum | null,
  changesLog: GridCell[][][] = []
): GridCell[][] => {
  changesLog.push(cloneDeep(grid));
  // console.log("Updating affected cells for", row, col, value);
  const gridSize = grid.length;
  const targetCell = grid[row][col];
  targetCell.value = value;
  targetCell.updatePossibleValues(grid);

  for (let i = 0; i < gridSize; i++) {
    const cell = grid[row][i];
    if (cell != targetCell) {
      cell.updatePossibleValues(grid);
    }
  }

  for (let i = 0; i < gridSize; i++) {
    const cell = grid[i][col];
    if (cell != targetCell) {
      cell.updatePossibleValues(grid);
    }
  }
  return grid;
};

const restoreAffectedCells = (
  changesLog: GridCell[][][]
): GridCell[][] | null => {
  const lastGrid = changesLog.pop();
  if (!lastGrid) {
    return null;
  }
  return lastGrid;
};

const createSolvedGrid = (
  grid: GridCell[][]
): { success: boolean; grid: GridCell[][] } => {
  try {
    const gridSize = grid.length;
    let clonedGrid = cloneDeep(grid);
    // Find the cell with the fewest possible values > 1
    let targetCell = null as Cell | null;
    let minOptions = Infinity;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cell = clonedGrid[row][col];
        if (cell.value === null && cell.possibleValues.size < minOptions) {
          // console.info("found target cell", cloneDeep(cell), minOptions);
          targetCell = cell;
          minOptions = cell.possibleValues.size;
        }
      }
    }
    //   console.log("minoptions", minOptions);
    // Base case: grid is complete
    if (!targetCell) {
      // console.info("Continue filling", cloneDeep(targetCell));
      return { success: true, grid: clonedGrid };
    }

    // If no valid options exist for this cell, backtrack
    if (minOptions === 0) {
      // console.warn("No valid options, backtracking", targetCell, clonedGrid);
      return { success: false, grid: clonedGrid };
    }

    // Try each possible value for the target cell
    const shuffledValues = shuffle([...targetCell.possibleValues]);
    for (const value of shuffledValues) {
      const changesLog: GridCell[][][] = [];

      // console.log("Trying", targetCell.row, targetCell.column, value);
      // Update affected cells and log changes
      clonedGrid = updateGridCell(
        clonedGrid,
        targetCell.row,
        targetCell.column,
        value,
        changesLog
      );

      const { success, grid: newGrid } = createSolvedGrid(clonedGrid);
      clonedGrid = newGrid;

      // Recur to fill the next cells
      if (success) {
        //   console.info("Filled", targetCell.row, targetCell.column, value);
        return { success: true, grid: clonedGrid }; // Grid successfully filled
      }

      // Undo changes (backtrack)
      // console.warn("Undoing changes", targetCell.row, targetCell.column, value);
      targetCell.value = null;
      restoreAffectedCells(changesLog);
    }
    console.error("No valid configurations", targetCell);
    return { success: false, grid: clonedGrid }; // No valid configurations
  } catch (error) {
    console.error("Error filling grid", error);
    return { success: false, grid: grid };
  }
};

const logicalSolve = (grid: GridCell[][]): boolean => {
  let progress = true;
  const gridClone = cloneDeep(grid);
  while (progress) {
    progress = false;

    for (let row = 0; row < gridClone.length; row++) {
      for (let col = 0; col < gridClone[row].length; col++) {
        const cell = gridClone[row][col];

        if (cell.value !== null) continue;

        // Update possible values based on current state
        updateGridCell(gridClone, row, col, null, []);

        // If only one possible value remains, assign it
        if (cell.possibleValues.size === 1) {
          const value = [...cell.possibleValues][0];
          cell.value = value;
          updateGridCell(gridClone, row, col, value, []);
          progress = true;
        }
      }
    }
  }

  // Check if the grid is fully solved
  for (let row = 0; row < gridClone.length; row++) {
    for (let col = 0; col < gridClone[row].length; col++) {
      if (gridClone[row][col].value === null) return false; // Unsatisfied cell
    }
  }

  return true; // Fully solved
};

const createPuzzle = (
  gridSize: number,
  constraints: Constraint[],
  difficulty: "tutorial" | "easy" | "medium" | "hard" = "hard"
): GridCell[][] => {
  const time = performance.now();

  const emptyGrid = createEmptyGrid(
    gridSize,
    [
      ElementCodeEnum.fire,
      ElementCodeEnum.water,
      ElementCodeEnum.earth,
      ElementCodeEnum.air,
    ],
    constraints
  );
  const { success, grid: solvedGrid } = createSolvedGrid(emptyGrid);

  if (!success) {
    console.error("Failed to create puzzle");
    return createPuzzle(gridSize, constraints, difficulty);
  }
  // return solvedGrid;
  let puzzleGrid = cloneDeep(solvedGrid);
  let cells = [];

  // Collect all cells into a list
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      cells.push({ row, col });
    }
  }

  // Shuffle the cells for random removal order
  cells = shuffle(cells);

  // Define parameters based on difficulty
  const maxClueRemoval = {
    tutorial: Math.floor(gridSize * gridSize * 0.1),
    easy: Math.floor(gridSize * gridSize * 0.4),
    medium: Math.floor(gridSize * gridSize * 0.55),
    hard: Math.floor(gridSize * gridSize * 0.8),
  };
  // console.info("Max clue removal", difficulty, maxClueRemoval[difficulty]);
  const minCluesLeft = gridSize * gridSize - maxClueRemoval[difficulty];
  // console.info("Min clues left", minCluesLeft);
  let removedClues = 0;

  for (const { row, col } of cells) {
    if (removedClues >= maxClueRemoval[difficulty]) break;

    // Backup the current value
    const originalValue = puzzleGrid[row][col].value;

    // Remove the value
    puzzleGrid = updateGridCell(puzzleGrid, row, col, null, []);

    // Test if the puzzle is still logically solvable
    const testGrid = cloneDeep(puzzleGrid);

    if (!logicalSolve(testGrid)) {
      // Restore the value if removal breaks logical solvability
      puzzleGrid = updateGridCell(puzzleGrid, row, col, originalValue, []);
    } else {
      removedClues++;
    }
  }

  // Ensure a minimum number of clues are left
  // console.log("Clues left", gridSize * gridSize - removedClues);
  if (gridSize * gridSize - removedClues < minCluesLeft) {
    console.warn(`Failed to meet minimum clue requirement for ${difficulty}`);
  }

  console.info(
    `Puzzle (${difficulty}) created in`,
    performance.now() - time,
    "ms"
  );

  return puzzleGrid;
};

const isGridSolved = (grid: GridCell[][]): boolean => {
  for (let row = 0; row < grid.length; row++) {
    const elementCounts = {
      [ElementCodeEnum.fire]: 0,
      [ElementCodeEnum.water]: 0,
      [ElementCodeEnum.earth]: 0,
      [ElementCodeEnum.air]: 0,
    };

    for (let col = 0; col < grid.length; col++) {
      const cell = grid[row][col];
      if (cell.value) {
        elementCounts[cell.value]++;
      }
    }

    if (
      Object.values(elementCounts).some((count) => count !== 2) ||
      Object.values(elementCounts).length !== 4
    ) {
      return false;
    }

    for (let col = 0; col < grid[row].length; col++) {
      const elementCounts = {
        [ElementCodeEnum.fire]: 0,
        [ElementCodeEnum.water]: 0,
        [ElementCodeEnum.earth]: 0,
        [ElementCodeEnum.air]: 0,
      };

      for (let row = 0; row < grid.length; row++) {
        const cell = grid[row][col];
        if (cell.value) {
          elementCounts[cell.value]++;
        }
      }

      if (
        Object.values(elementCounts).some((count) => count !== 2) ||
        Object.values(elementCounts).length !== 4
      ) {
        return false;
      }

      if (grid[row][col].value === null) return false;
      if (grid[row][col].constraints?.length === 0) continue;

      const isConstrainValid = grid[row][col].constraints.every(
        (constraint) => {
          const val1 = grid[constraint.cell1.row][constraint.cell1.col].value;
          const val2 = grid[constraint.cell2.row][constraint.cell2.col].value;
          if (val1 === null || val2 === null) {
            return true;
          }
          return constraint.validationFn(val1, val2);
        }
      );

      if (!isConstrainValid) return false;
    }
  }

  return true;
};

export { updateGridCell, createPuzzle, isGridSolved };

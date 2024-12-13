import { cloneDeep, shuffle } from "lodash";
import ElementCodeEnum from "../types/elements.js";

import GridCell from "../models/Cell.js";
import Constraint from "../models/Constraint.js";
import PuzzleDifficulty from "../types/puzzleDifficulty.js";
import generateConstraints from "./generateConstraints.js";

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

const restoreAffectedCells = (changesLog: GridCell[][][]): GridCell[][] => {
  if (changesLog.length == 1) {
    return changesLog[0];
  }
  const lastGrid = changesLog.pop();

  return lastGrid!;
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
      if (changesLog.length === 0) {
        console.error("No changes to undo", targetCell);
        return { success: false, grid: clonedGrid };
      } else {
        clonedGrid = restoreAffectedCells(changesLog);
      }
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
  constraints: Constraint[] | null,
  difficulty: PuzzleDifficulty
): GridCell[][] => {
  try {
    console.info(
      "!!!! Creating puzzle !!!!",
      gridSize,
      constraints,
      difficulty
    );
    if (!constraints) {
      constraints = generateConstraints(3, gridSize);
    }
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
      easy: Math.floor(gridSize * gridSize * 0.2),
      medium: Math.floor(gridSize * gridSize * 0.5),
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
    if (gridSize * gridSize - removedClues < minCluesLeft) {
      console.warn(`Failed to meet minimum clue requirement for ${difficulty}`);
    } else {
      console.info(
        `Puzzle (${difficulty}) created in`,
        performance.now() - time,
        "ms"
      );
    }

    if (!isGridValid(puzzleGrid)) {
      console.error("Invalid puzzle created, recreating");
      return createPuzzle(gridSize, constraints, difficulty);
    }

    return puzzleGrid;
  } catch (error) {
    console.error("Error creating puzzle", error);
    return createPuzzle(gridSize, constraints, difficulty);
  }
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

const isGridValid = (grid: GridCell[][]): boolean => {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const cell = grid[row][col];
      if (!cell.isCellValid(grid)) {
        return false;
      }
    }
  }
  return true;
};

function encodePuzzle(grid) {
  const valueToChar = (val) => {
    switch (val) {
      case ElementCodeEnum.fire:
        return "F";
      case ElementCodeEnum.water:
        return "A";
      case ElementCodeEnum.earth:
        return "E";
      case ElementCodeEnum.air:
        return "W";
      default:
        return ".";
    }
  };
  const rows = grid
    .map((row) =>
      row.map((cell) => (cell.value ? valueToChar(cell.value) : ".")).join("")
    )
    .join("|");

  const constraints = [];
  grid.forEach((row) => {
    row.forEach((cell) => {
      if (cell.constraints.length > 0) {
        cell.constraints.forEach((constraint) => {
          constraints.push({
            type: constraint.type,
            cell1: `${constraint.cell1.row},${constraint.cell1.col}`,
            cell2: `${constraint.cell2.row},${constraint.cell2.col}`,
          });
        });
      }
    });
  });

  const constraintsString = constraints
    .map((c) => `${c.type}:${c.cell1}:${c.cell2}`)
    .join("|");

  const encoded = btoa(JSON.stringify({ rows, constraintsString }));
  return encoded;
}

function decodePuzzle(encoded: string) {
  const charToValue = (char: string) => {
    switch (char) {
      case "F":
        return ElementCodeEnum.fire;
      case "A":
        return ElementCodeEnum.water;
      case "E":
        return ElementCodeEnum.earth;
      case "W":
        return ElementCodeEnum.air;
      default:
        return null;
    }
  };
  const decoded = JSON.parse(atob(encoded));
  const rows = decoded.rows.split("|").map((row, rowIndex) =>
    row.split("").map((value, colIndex) => ({
      value: value === "." ? null : charToValue(value),
      row: rowIndex,
      column: colIndex,
      initialPossibleValues: new Set([
        ElementCodeEnum.fire,
        ElementCodeEnum.water,
        ElementCodeEnum.earth,
        ElementCodeEnum.air,
      ]),
      constraints: [],
    }))
  );

  if (!decoded.constraintsString) {
    return { puzzle: rows, constraints: [] };
  }
  const constraints = decoded.constraintsString.split("|").map((c) => {
    const [type, cell1, cell2] = c.split(":");
    const [row1, col1] = cell1.split(",").map(Number);
    const [row2, col2] = cell2.split(",").map(Number);
    return {
      type,
      cell1: { row: row1, col: col1 },
      cell2: { row: row2, col: col2 },
    };
  });

  constraints.forEach((constraint) => {
    const { row: r1, col: c1 } = constraint.cell1;
    const { row: r2, col: c2 } = constraint.cell2;
    rows[r1][c1].constraints = rows[r1][c1].constraints || [];
    rows[r2][c2].constraints = rows[r2][c2].constraints || [];
    rows[r1][c1].constraints.push(constraint);
    rows[r2][c2].constraints.push(constraint);
  });

  return { puzzle: rows, constraints };
}

const jsonToGrid = (json) => {
  const gridCellData = json.map((row) =>
    row.map((cell) => GridCell.fromJSON(cell))
  );
  gridCellData.forEach((row) => {
    row.forEach((cell) => {
      cell.updatePossibleValues(gridCellData);
    });
  });
  return gridCellData;
};

export {
  updateGridCell,
  createPuzzle,
  isGridSolved,
  encodePuzzle,
  decodePuzzle,
  jsonToGrid,
};

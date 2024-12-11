import Constraint from "../models/Constraint";
import ConstraintType from "../types/constraintType";

function getRandomColRow(
  gridSize: number,
  takenCells: {
    [key: string]: boolean;
  }
) {
  const row = Math.floor(Math.random() * (gridSize - 2));
  const col = Math.floor(Math.random() * (gridSize - 2));
  if (takenCells[`${row},${col}`]) {
    return getRandomColRow(gridSize, takenCells);
  }
  if (takenCells[`${row},${col + 1}`]) {
    return getRandomColRow(gridSize, takenCells);
  }
  if (takenCells[`${row + 1},${col}`]) {
    return getRandomColRow(gridSize, takenCells);
  }
  takenCells[`${row},${col}`] = true;
  takenCells[`${row},${col + 1}`] = true;
  takenCells[`${row + 1},${col}`] = true;
  return { row, col };
}

function generateConstraints(
  constraintCount: number = 3,
  gridSize: number = 8
): Constraint[] {
  // cells should not connect to more than one constraint
  // constraints should not overlap
  // constraints should not be too close to each other

  const constraints: Constraint[] = [];
  const takenCells: { [key: string]: boolean } = {};
  for (let i = 0; i < constraintCount; i++) {
    const { col, row } = getRandomColRow(gridSize, takenCells);
    const isRow = Math.random() > 0.5;
    const isSynergy = Math.random() > 0.5;
    constraints.push(
      new Constraint(
        { row: row, col: col },
        { row: isRow ? row + 1 : row, col: isRow ? col : col + 1 },
        isSynergy ? ConstraintType.synergy : ConstraintType.contradiction
      )
    );
  }
  console.log("Generated constraints:", constraints);
  return constraints;
}

export default generateConstraints;

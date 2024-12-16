// gridWorker.js
import Constraint from "../models/Constraint";
import { createPuzzle } from "../utils/gridUtils";

onmessage = function (e) {
  let { gridSize, constraints, difficulty } = e.data;
  // create constraint array from object
  constraints = constraints.map((constraint) => {
    return new Constraint(constraint.cell1, constraint.cell2, constraint.type);
  });
  // console.log("Worker received:", gridSize, constraints, difficulty);
  const puzzle = createPuzzle(gridSize, constraints, difficulty);

  postMessage({
    success: true,
    data: puzzle,
  });
};

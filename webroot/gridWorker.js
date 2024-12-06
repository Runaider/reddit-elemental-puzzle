// gridWorker.js
import Constraint from "../models/constraint";
import { createPuzzle } from "../utils/gridUtils";

// onmessage = (e) => {
//   console.log("Worker received:", e.data);
//   postMessage("Hello from Worker!");
// };

onmessage = function (e) {
  let { gridSize, constraints, difficulty } = e.data;
  console.log("Worker received message");
  // create constraint array from object
  constraints = constraints.map((constraint) => {
    // debugger;
    return new Constraint(constraint.cell1, constraint.cell2, constraint.value);
  });
  const puzzle = createPuzzle(gridSize, constraints, difficulty);

  postMessage({
    success: true,
    data: puzzle,
  });
};

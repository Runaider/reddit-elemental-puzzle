import { createPuzzle, encodePuzzle } from "../../game/utils/gridUtils.js";

export async function generatePuzzle(difficulty: "easy" | "medium" | "hard") {
  try {
    const puzzle = createPuzzle(8, null, difficulty);
    return encodePuzzle(puzzle);
  } catch (error) {
    console.error("Error generating puzzle:", error);
    throw error;
  }
}

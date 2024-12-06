import ElementCodeEnum from "../../../types/elements";
import ElementIcon from "../../basic/ElementIcon";

function HowToPlay() {
  return (
    <div className=" bg-custom-muted text-custom-border p-4 rounded-md">
      <h3 className="text-lg font-semibold text-left text-gray-700">
        Grid Overview
      </h3>
      <p className=" ml-4 text-md font-medium text-left text-gray-500">
        Your goal is to fill the grid with symbols representing the following
        elements:{" "}
        <div className="inline-block mb-[-6px]">
          <ElementIcon element={ElementCodeEnum.air} size="small" />
        </div>
        ,{" "}
        <div className="inline-block mb-[-6px]">
          <ElementIcon element={ElementCodeEnum.fire} size="small" />
        </div>
        ,{" "}
        <div className="inline-block mb-[-6px]">
          <ElementIcon element={ElementCodeEnum.water} size="small" />
        </div>
        ,{" "}
        <div className="inline-block mb-[-6px]">
          <ElementIcon element={ElementCodeEnum.earth} size="small" />
        </div>
      </p>

      <h3 className="mt-4 text-lg font-semibold text-left text-gray-700">
        Row and Column Rules
      </h3>
      <p className=" ml-4 text-md font-medium text-left text-gray-500">
        Each row must contain exactly two of each element.
      </p>
      <p className=" ml-4 text-md font-medium text-left text-gray-500">
        Each column must also contain no more than two of each element.
      </p>

      <h3 className="mt-4 text-lg font-semibold text-left text-gray-700">
        Synergy Rule
      </h3>
      <div className="ml-4 text-md font-medium text-left text-gray-500">
        Some cells are connected by a{" "}
        <div
          className={
            "inline-block bg-custom-border w-5 h-5 mb-[-4px] rounded-3xl"
          }
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
        </div>{" "}
        icon.
      </div>
      <p className="ml-4 text-md font-medium text-left text-gray-500">
        Connected cells must "synergize," meaning their elements must pair as
        follows:
      </p>
      <p className="mt-1 ml-6 text-md font-medium text-left text-gray-500">
        -{" "}
        <div className="inline-block mb-[-6px]">
          <ElementIcon element={ElementCodeEnum.fire} size="small" />
        </div>{" "}
        x{" "}
        <div className="inline-block mb-[-6px]">
          <ElementIcon element={ElementCodeEnum.air} size="small" />
        </div>
      </p>
      <p className=" ml-6 text-md font-medium text-left text-gray-500">
        -{" "}
        <div className="inline-block mb-[-6px]">
          <ElementIcon element={ElementCodeEnum.water} size="small" />
        </div>{" "}
        x{" "}
        <div className="inline-block mb-[-6px]">
          <ElementIcon element={ElementCodeEnum.earth} size="small" />
        </div>
      </p>
      <h3 className="mt-4 text-lg font-semibold text-left text-gray-700">
        Puzzle Solvability
      </h3>
      <p className=" ml-4 text-md font-medium text-left text-gray-500">
        The puzzle is designed to be solvable without guessing.
      </p>
      <p className=" ml-4 text-md font-medium text-left text-gray-500">
        At any point, if you’ve made no mistakes, there will always be at least
        one cell where only one valid option exists.
      </p>
    </div>
  );
}

export default HowToPlay;

// Game Rules
// Grid Overview

// The game is played on an 8x8 grid.
// Your goal is to fill the grid with symbols representing the following elements: Fire, Wind, Water, and Earth.
// Row and Column Rules

// Each row must contain exactly two of each element.
// Each column must also contain no more than two of each element.
// Synergy Rule

// Some cells are connected by a lightning icon.
// Connected cells must "synergize," meaning their elements must pair as follows:
// Fire x Wind
// Water x Earth
// Puzzle Solvability

// The puzzle is designed to be solvable without guessing.
// At any point, if you’ve made no mistakes, there will always be at least one cell where only one valid option exists.

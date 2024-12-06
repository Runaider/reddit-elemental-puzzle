import { cloneDeep } from "lodash";
import ElementCodeEnum from "../types/elements";
import Constraint from "./constraint";

class GridCell {
  value: ElementCodeEnum | null;
  initialPossibleValues: Set<ElementCodeEnum>;
  possibleValues: Set<ElementCodeEnum>;
  row: number;
  column: number;
  constraints: Constraint[];
  isValid: boolean = false;

  constructor(
    row: number,
    column: number,
    value: ElementCodeEnum | null,
    possibleValues: Set<ElementCodeEnum>,
    constraints: Constraint[]
  ) {
    this.value = value;
    this.initialPossibleValues = cloneDeep(possibleValues);
    this.possibleValues = cloneDeep(possibleValues);
    this.row = row;
    this.column = column;
    this.constraints = constraints;
  }

  static fromJSON(json: any) {
    return new GridCell(
      json.row,
      json.column,
      json.value,
      new Set(json.initialPossibleValues),
      json.constraints.map(
        (constraint: any) =>
          new Constraint(constraint.cell1, constraint.cell2, constraint.type)
      )
    );
  }

  updatePossibleValues(grid: Grid) {
    try {
      // find used values in row and column
      let usedValuesRow = [] as ElementCodeEnum[];
      let usedValuesCol = [] as ElementCodeEnum[];

      this.isValid = this.isCellValid(grid);

      if (this.value != null) {
        this.possibleValues = new Set([]);
        return;
      }

      for (let i = 0; i < grid.length; i++) {
        if (grid[this.row][i].value) {
          usedValuesRow.push(grid[this.row][i].value!);
        }
        if (grid[i][this.column].value) {
          usedValuesCol.push(grid[i][this.column].value!);
        }
      }
      usedValuesRow = usedValuesRow.filter(
        (value) => usedValuesRow.filter((v) => v === value).length == 2
      );
      usedValuesCol = usedValuesCol.filter(
        (value) => usedValuesCol.filter((v) => v === value).length == 2
      );

      const usedValues = Array.from(
        new Set([...usedValuesRow, ...usedValuesCol])
      );

      this.possibleValues = new Set(
        Array.from(this.initialPossibleValues).filter(
          (value) => !usedValues.includes(value)
        )
      );

      this.constraints.forEach((constraint) => {
        let currentCell = null;
        let otherCell = null;
        if (
          constraint.cell1.row === this.row &&
          constraint.cell1.col === this.column
        ) {
          currentCell = "cell1";
          otherCell = "cell2";
        } else {
          // console.log("    constraint found", constraint.cell1);
          currentCell = "cell2";
          otherCell = "cell1";
        }

        const val1 =
          grid[constraint[currentCell].row][constraint[currentCell].col].value;
        const val2 =
          grid[constraint[otherCell].row][constraint[otherCell].col].value;
        if (val1 === null && val2 === null) {
          return;
        }
        this.possibleValues = new Set(
          [...this.possibleValues].filter((value) => {
            const passes = constraint.validationFn(value, val2);
            return passes;
          })
        );
      });

      //   if (this.value != null) {
      //     if ([...this.possibleValues].includes(this.value)) {
      //       this.isInvalid = false;
      //     } else {
      //       this.isInvalid = true;
      //     }
      //     this.possibleValues = new Set([]);
      //     return;
      //   } else {
      //     this.isInvalid = false;
      //   }
    } catch (error) {
      console.error("ERROR", error);
    }
  }

  isCellValid(grid: Grid) {
    if (this.value === null) {
      return true;
    }
    const isConstrainValid = this.constraints.every((constraint) => {
      const val1 = grid[constraint.cell1.row][constraint.cell1.col].value;
      const val2 = grid[constraint.cell2.row][constraint.cell2.col].value;
      if (val1 === null || val2 === null) {
        return true;
      }
      return constraint.validationFn(val1, val2);
    });

    const isRowValid =
      grid[this.row].map((cell) => cell.value).filter((v) => v === this.value)
        .length <= 2;
    const isColValid =
      grid.map((row) => row[this.column].value).filter((v) => v === this.value)
        .length <= 2;
    // console.log(
    //   "Cell valid",
    //   this.row,
    //   this.column,
    //   isConstrainValid,
    //   isRowValid,
    //   isColValid,
    //   "==",
    //   isConstrainValid && isRowValid && isColValid
    // );
    return isConstrainValid && isRowValid && isColValid;
  }
}

export default GridCell;

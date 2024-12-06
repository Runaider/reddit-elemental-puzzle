import ElementCodeEnum from "../types/elements";

export default class Constraint {
  type: "synergy";
  cell1: { row: number; col: number };
  cell2: { row: number; col: number };

  constructor(
    cell1: { row: number; col: number },
    cell2: { row: number; col: number },
    type: "synergy" = "synergy"
  ) {
    this.type = type;
    this.cell1 = cell1;
    this.cell2 = cell2;
  }

  isValid(grid: ElementCodeEnum[][]) {
    const val1 = grid[this.cell1.row][this.cell1.col];
    const val2 = grid[this.cell2.row][this.cell2.col];
    if (val1 === null || val2 === null) {
      return true;
    }
    return this.validationFn(val1, val2);
  }

  isValidForCell(
    grid: ElementCodeEnum[][],
    cell: { row: number; col: number }
  ) {
    const val1 = grid[this.cell1.row][this.cell1.col];
    const val2 = grid[this.cell2.row][this.cell2.col];
    const val = grid[cell.row][cell.col];
    if (val1 === null || val2 === null || val === null) {
      return true;
    }
    if (cell.row === this.cell1.row && cell.col === this.cell1.col) {
      return this.validationFn(val, val2);
    }
    if (cell.row === this.cell2.row && cell.col === this.cell2.col) {
      return this.validationFn(val1, val);
    }
    return true;
  }

  validationFn(val1: ElementCodeEnum, val2: ElementCodeEnum) {
    if (this.type === "synergy") {
      return this.synergyValidation(val1, val2);
    }
    console.error("Invalid constraint type");
    return false;
  }

  synergyValidation(val1: ElementCodeEnum, val2: ElementCodeEnum) {
    if (val1 === ElementCodeEnum.fire && val2 === ElementCodeEnum.air) {
      return true;
    }
    if (val1 === ElementCodeEnum.air && val2 === ElementCodeEnum.fire) {
      return true;
    }
    if (val1 === ElementCodeEnum.water && val2 === ElementCodeEnum.earth) {
      return true;
    }
    if (val1 === ElementCodeEnum.earth && val2 === ElementCodeEnum.water) {
      return true;
    }
    return false;
  }
}

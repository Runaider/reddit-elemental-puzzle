import ElementCodeEnum from "./elements";
declare global {
  type Cell = {
    value: ElementCodeEnum | null; // Current value in the cell
    possibleValues: Set<ElementCodeEnum>; // Possible values for the cell
    row: number; // Row index of the cell
    column: number; // Column index
  };

  type Grid = Cell[][];
}

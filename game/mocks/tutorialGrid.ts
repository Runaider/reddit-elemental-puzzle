import { encodePuzzle } from "../utils/gridUtils";

const tutorialGrid = [
  [
    {
      value: null,
      row: 0,
      column: 0,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "🌱",
      row: 0,
      column: 1,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "💧",
      row: 0,
      column: 2,
      initialPossibleValues: {},
      constraints: [
        {
          type: "synergy",
          cell1: {
            row: 0,
            col: 2,
          },
          cell2: {
            row: 1,
            col: 2,
          },
        },
        {
          type: "synergy",
          cell1: {
            row: 0,
            col: 2,
          },
          cell2: {
            row: 1,
            col: 2,
          },
        },
      ],
    },
    {
      value: "🔥",
      row: 0,
      column: 3,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "🔥",
      row: 0,
      column: 4,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "💧",
      row: 0,
      column: 5,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "💨",
      row: 0,
      column: 6,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "💨",
      row: 0,
      column: 7,
      initialPossibleValues: {},
      constraints: [],
    },
  ],
  [
    {
      value: "🌱",
      row: 1,
      column: 0,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "🔥",
      row: 1,
      column: 1,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "🌱",
      row: 1,
      column: 2,
      initialPossibleValues: {},
      constraints: [
        {
          type: "synergy",
          cell1: {
            row: 0,
            col: 2,
          },
          cell2: {
            row: 1,
            col: 2,
          },
        },
        {
          type: "synergy",
          cell1: {
            row: 0,
            col: 2,
          },
          cell2: {
            row: 1,
            col: 2,
          },
        },
      ],
    },
    {
      value: "🔥",
      row: 1,
      column: 3,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "💨",
      row: 1,
      column: 4,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "💨",
      row: 1,
      column: 5,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "💧",
      row: 1,
      column: 6,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "💧",
      row: 1,
      column: 7,
      initialPossibleValues: {},
      constraints: [],
    },
  ],
  [
    {
      value: "🔥",
      row: 2,
      column: 0,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "💨",
      row: 2,
      column: 1,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "🔥",
      row: 2,
      column: 2,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "💧",
      row: 2,
      column: 3,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "💨",
      row: 2,
      column: 4,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "💧",
      row: 2,
      column: 5,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "🌱",
      row: 2,
      column: 6,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "🌱",
      row: 2,
      column: 7,
      initialPossibleValues: {},
      constraints: [],
    },
  ],
  [
    {
      value: "💧",
      row: 3,
      column: 0,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "💨",
      row: 3,
      column: 1,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "💨",
      row: 3,
      column: 2,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "🌱",
      row: 3,
      column: 3,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "💧",
      row: 3,
      column: 4,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "🌱",
      row: 3,
      column: 5,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "🔥",
      row: 3,
      column: 6,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "🔥",
      row: 3,
      column: 7,
      initialPossibleValues: {},
      constraints: [],
    },
  ],
  [
    {
      value: "💨",
      row: 4,
      column: 0,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "🔥",
      row: 4,
      column: 1,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: null,
      row: 4,
      column: 2,
      initialPossibleValues: {},
      constraints: [
        {
          type: "synergy",
          cell1: {
            row: 4,
            col: 2,
          },
          cell2: {
            row: 5,
            col: 2,
          },
        },
        {
          type: "synergy",
          cell1: {
            row: 4,
            col: 2,
          },
          cell2: {
            row: 5,
            col: 2,
          },
        },
      ],
    },
    {
      value: "🌱",
      row: 4,
      column: 3,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: null,
      row: 4,
      column: 4,
      initialPossibleValues: {},
      constraints: [
        {
          type: "contradiction",
          cell1: {
            row: 4,
            col: 4,
          },
          cell2: {
            row: 5,
            col: 4,
          },
        },
        {
          type: "contradiction",
          cell1: {
            row: 4,
            col: 4,
          },
          cell2: {
            row: 5,
            col: 4,
          },
        },
      ],
    },
    {
      value: "💨",
      row: 4,
      column: 5,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "🔥",
      row: 4,
      column: 6,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "💧",
      row: 4,
      column: 7,
      initialPossibleValues: {},
      constraints: [],
    },
  ],
  [
    {
      value: "🔥",
      row: 5,
      column: 0,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "💧",
      row: 5,
      column: 1,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "💧",
      row: 5,
      column: 2,
      initialPossibleValues: {},
      constraints: [
        {
          type: "synergy",
          cell1: {
            row: 4,
            col: 2,
          },
          cell2: {
            row: 5,
            col: 2,
          },
        },
        {
          type: "synergy",
          cell1: {
            row: 4,
            col: 2,
          },
          cell2: {
            row: 5,
            col: 2,
          },
        },
      ],
    },
    {
      value: "💨",
      row: 5,
      column: 3,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "🔥",
      row: 5,
      column: 4,
      initialPossibleValues: {},
      constraints: [
        {
          type: "contradiction",
          cell1: {
            row: 4,
            col: 4,
          },
          cell2: {
            row: 5,
            col: 4,
          },
        },
        {
          type: "contradiction",
          cell1: {
            row: 4,
            col: 4,
          },
          cell2: {
            row: 5,
            col: 4,
          },
        },
      ],
    },
    {
      value: null,
      row: 5,
      column: 5,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: null,
      row: 5,
      column: 6,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "💨",
      row: 5,
      column: 7,
      initialPossibleValues: {},
      constraints: [],
    },
  ],
  [
    {
      value: "💨",
      row: 6,
      column: 0,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "💧",
      row: 6,
      column: 1,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "🔥",
      row: 6,
      column: 2,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "💧",
      row: 6,
      column: 3,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "🌱",
      row: 6,
      column: 4,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: null,
      row: 6,
      column: 5,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: null,
      row: 6,
      column: 6,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "🌱",
      row: 6,
      column: 7,
      initialPossibleValues: {},
      constraints: [],
    },
  ],
  [
    {
      value: "💧",
      row: 7,
      column: 0,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "🌱",
      row: 7,
      column: 1,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "💨",
      row: 7,
      column: 2,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "💨",
      row: 7,
      column: 3,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "🌱",
      row: 7,
      column: 4,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "🔥",
      row: 7,
      column: 5,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "💧",
      row: 7,
      column: 6,
      initialPossibleValues: {},
      constraints: [],
    },
    {
      value: "🔥",
      row: 7,
      column: 7,
      initialPossibleValues: {},
      constraints: [],
    },
  ],
];

const encodedTutorialGrid = encodePuzzle(tutorialGrid);

export { tutorialGrid, encodedTutorialGrid };

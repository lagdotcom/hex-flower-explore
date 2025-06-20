import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type EngineMove = "NE" | "SE" | "S" | "SW" | "NW" | "N";

export type EngineIndex =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18;

interface EngineBlockBase {
  from: EngineIndex;
  move: EngineMove;
}
interface EngineStay extends EngineBlockBase {
  type: "stay";
}
interface EngineRedirect extends EngineBlockBase {
  type: "redirect";
  to: EngineIndex;
}
export type EngineRule = EngineStay | EngineRedirect;

export interface EngineState {
  name: string;
  types: [
    string[],
    string[],
    string[],
    string[],
    string[],
    string[],
    string[],
    string[],
    string[],
    string[],
    string[],
    string[],
    string[],
    string[],
    string[],
    string[],
    string[],
    string[],
    string[],
  ];
  moves: [
    EngineMove,
    EngineMove,
    EngineMove,
    EngineMove,
    EngineMove,
    EngineMove,
    EngineMove,
    EngineMove,
    EngineMove,
    EngineMove,
    EngineMove,
  ];
  rules: EngineRule[];
}

const defaultMoves: EngineState["moves"] = [
  "NE",
  "NE",
  "SE",
  "SE",
  "S",
  "S",
  "SW",
  "SW",
  "NW",
  "NW",
  "N",
];

export const randomTerrainEngine: EngineState = {
  name: "Random Terrain",
  types: [
    ["plains"],

    ["plains"],
    ["plains"],

    ["plains", "arid"],
    ["plains"],
    ["plains", "trees"],

    ["plains", "arid"],
    ["plains", "trees"],

    ["arid"],
    ["special"],
    ["trees"],

    ["arid"],
    ["trees"],

    ["arid", "hills"],
    ["hills"],
    ["trees", "hills"],

    ["hills"],
    ["hills"],

    ["mountains"],
  ],
  moves: defaultMoves,
  rules: [
    { type: "stay", from: 0, move: "S" },
    { type: "redirect", from: 0, move: "SW", to: 1 },
    { type: "redirect", from: 0, move: "SE", to: 2 },

    { type: "redirect", from: 1, move: "S", to: 0 },
    { type: "redirect", from: 2, move: "S", to: 0 },

    { type: "stay", from: 18, move: "N" },
    { type: "stay", from: 18, move: "NW" },
    { type: "stay", from: 18, move: "NE" },
  ],
};

const slice = createSlice({
  name: "engine",
  initialState: randomTerrainEngine,
  reducers: {
    setEngine: (state, { payload }: PayloadAction<EngineState>) => {
      state.name = payload.name;
      state.types = payload.types;
      state.moves = payload.moves;
      state.rules = payload.rules;
    },
  },
});

export const { setEngine } = slice.actions;

export default slice.reducer;

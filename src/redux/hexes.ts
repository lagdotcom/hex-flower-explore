import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

import { HexLike } from "../lib/Hex";
import { EngineIndex } from "./engine";

export interface HexData extends HexLike {
  id: string;
  index: EngineIndex;
  className: string;
}

export const hexesAdapter = createEntityAdapter<HexData>();
const initialState = hexesAdapter.getInitialState();

const slice = createSlice({
  name: "hexes",
  initialState,
  reducers: {
    addHex: hexesAdapter.upsertOne,
  },
});

export const { addHex } = slice.actions;

export default slice.reducer;

export function getHexId({ q, r }: HexLike) {
  return `${q},${r}`;
}

export function asData(
  { q, r, s }: HexLike,
  index: EngineIndex,
  className: string,
): HexData {
  return { id: getHexId({ q, r, s }), q, r, s, index, className };
}

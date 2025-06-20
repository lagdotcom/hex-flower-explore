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
    addHex: hexesAdapter.addOne,
  },
});

export const { addHex } = slice.actions;

export default slice.reducer;

export function asData(
  { q, r, s }: HexLike,
  index: EngineIndex,
  className: string,
): HexData {
  return { id: `${q},${r}`, q, r, s, index, className };
}

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { int } from "../lib/flavours";
import { HexLike } from "../lib/Hex";

export interface MapState {
  position: HexLike<int>;
}

const initialState: MapState = {
  position: { q: 0, r: 0, s: 0 },
};

const slice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setPosition: (state, { payload }: PayloadAction<HexLike>) => {
      state.position = payload;
    },
  },
});

export const { setPosition } = slice.actions;

export default slice.reducer;

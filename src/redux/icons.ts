import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

export interface IconEntry {
  id: string;
  icon: string;
}

export const iconsAdapter = createEntityAdapter<IconEntry>();

const slice = createSlice({
  name: "icons",
  initialState: iconsAdapter.getInitialState(),
  reducers: {
    setIcons: iconsAdapter.setAll,
  },
});

export const { setIcons } = slice.actions;

export default slice.reducer;

import { combineReducers, configureStore, Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import engine from "./engine";
import hexes from "./hexes";
import icons from "./icons";
import map from "./map";

const reducer = combineReducers({ engine, hexes, icons, map });

export function createStore(preloadedState: Partial<RootState>) {
  return configureStore({ reducer, preloadedState });
}

export type RootState = ReturnType<typeof reducer>;
export type AppDispatch = Dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

import "./index.scss";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";

import App from "./components/App";
import { createStore } from "./redux/store";
import { asData, hexesAdapter } from "./redux/hexes";

import styles from "./components/App.module.scss";
import { EngineState, randomTerrainEngine } from "./redux/engine";
import { randomPick } from "./lib/maths";

const app = document.getElementById("app");
if (!app) throw new Error(`#app not found`);

const engine = {
  ...randomTerrainEngine,
  types: randomTerrainEngine.types.map((values) =>
    values.map((v) => styles[v])
  ) as EngineState["types"],
};

const store = createStore({
  engine,
  hexes: hexesAdapter.getInitialState(undefined, [
    asData({ q: 0, r: 0, s: 0 }, 0, randomPick(engine.types[0])),
  ]),
});

const root = createRoot(app);
root.render(
  <StrictMode>
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>
  </StrictMode>
);

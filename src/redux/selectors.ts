import { hexesAdapter } from "./hexes";
import { RootState } from "./store";

export const { selectAll: selectAllHexes } =
  hexesAdapter.getSelectors<RootState>((s) => s.hexes);

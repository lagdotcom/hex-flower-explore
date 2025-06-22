import { hexesAdapter } from "./hexes";
import { iconsAdapter } from "./icons";
import { RootState } from "./store";

export const { selectAll: selectAllHexes, selectEntities: selectHexesRecord } =
  hexesAdapter.getSelectors<RootState>((s) => s.hexes);

export const { selectEntities: selectIconsRecord } =
  iconsAdapter.getSelectors<RootState>((s) => s.icons);

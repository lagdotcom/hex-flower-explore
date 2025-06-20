import Layout from "../lib/Layout";
import { flat } from "../lib/Orientation";
import Point from "../lib/Point";
import HexMap from "./HexMap";
import LayoutContext from "./LayoutContext";

import { useMemo, useState } from "react";

export default function App() {
  const [hexSize] = useState(32);
  const layout = useMemo(
    () => new Layout(flat, new Point(hexSize, hexSize)),
    [hexSize]
  );

  return (
    <main>
      <LayoutContext value={layout}>
        <HexMap />
      </LayoutContext>
    </main>
  );
}

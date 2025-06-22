import Layout from "../lib/Layout";
import { flat } from "../lib/Orientation";
import Point from "../lib/Point";
import HexMap from "./HexMap";
import LayoutContext from "./LayoutContext";

import styles from "./App.module.scss";

import { useMemo, useState } from "react";
import EngineDisplay from "./EngineDisplay";

export default function App() {
  const [hexSize] = useState(32);
  const layout = useMemo(
    () => new Layout(flat, new Point(hexSize, hexSize)),
    [hexSize]
  );

  return (
    <main className={styles.main}>
      <LayoutContext value={layout}>
        <EngineDisplay className={styles.engine} />
        <HexMap className={styles.map} />
      </LayoutContext>
    </main>
  );
}

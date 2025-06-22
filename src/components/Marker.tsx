import { useMemo } from "react";
import { useLayout } from "./LayoutContext";

import styles from "./App.module.scss";
import { HexLike } from "../lib/Hex";
import { int } from "../lib/flavours";

interface MarkerProps {
  position: HexLike<int>;
}

export default function Marker({ position }: MarkerProps) {
  const layout = useLayout();
  const centre = useMemo(() => layout.toPixel(position), [layout, position]);

  return (
    <circle
      className={styles.marker}
      cx={centre.x}
      cy={centre.y}
      r={layout.size.x / 2}
    />
  );
}

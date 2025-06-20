import { useMemo } from "react";
import Hex from "../lib/Hex";
import classNames from "classnames";
import { useLayout } from "./LayoutContext";
import styles from "./App.module.scss";
import { HexData } from "../redux/hexes";

interface Props {
  hex: HexData;
}

export default function HexDisplay({ hex }: Props) {
  const layout = useLayout();

  const gClassName = useMemo(
    () => classNames(styles.hex, hex.className),
    [hex]
  );

  const { lowest, transform, points, label } = useMemo(() => {
    const centre = layout.toPixel(hex);
    const transform = `translate(${centre.x}, ${centre.y})`;

    const corners = layout.getPolygonCorners({ q: 0, r: 0, s: 0 });
    const points = corners.map((p) => `${p.x},${p.y}`).join(" ");

    const lowest = corners.reduce((prev, cur) => (prev.y > cur.y ? prev : cur));

    const { col, row } = new Hex(hex.q, hex.r, hex.s).toOffsetCoordinates();
    const label = `${col + 50}.${row + 50}`;

    return { centre, transform, lowest, points, label };
  }, [hex, layout]);

  return (
    <g className={gClassName} transform={transform}>
      <polygon className={styles.shape} points={points} />
      <text
        className={styles.label}
        y={lowest.y}
        alignmentBaseline="ideographic"
        textAnchor="middle"
      >
        {label}
      </text>
    </g>
  );
}

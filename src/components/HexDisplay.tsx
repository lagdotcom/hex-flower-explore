import { useCallback, useMemo } from "react";
import Hex from "../lib/Hex";
import classNames from "classnames";
import { useLayout } from "./LayoutContext";
import styles from "./App.module.scss";
import { HexData } from "../redux/hexes";
import { useAppSelector } from "../redux/store";
import { selectIconsRecord } from "../redux/selectors";

export interface HexDisplayProps {
  hex: HexData;
  className?: string;
  scale?: number;
  showIcon?: boolean;
  showLabel?: boolean;
  onClick?: (hex: HexData) => void;
}

export default function HexDisplay({
  hex,
  className,
  scale = 1,
  showIcon = false,
  showLabel = false,
  onClick,
}: HexDisplayProps) {
  const layout = useLayout();
  const icons = useAppSelector(selectIconsRecord);

  const combinedClassName = useMemo(
    () => classNames(styles.hex, hex.className, className),
    [className, hex]
  );

  const { lowest, transform, points, label, icon } = useMemo(() => {
    const centre = layout.toPixel(hex);
    const transform = `translate(${centre.x}, ${centre.y}) scale(${scale} ${scale})`;

    const corners = layout.getPolygonCorners({ q: 0, r: 0, s: 0 });
    const points = corners.map((p) => `${p.x},${p.y}`).join(" ");

    const lowest = corners.reduce((prev, cur) => (prev.y > cur.y ? prev : cur));

    const { col, row } = new Hex(hex.q, hex.r, hex.s).toOffsetCoordinates();
    const label = `${col + 50}.${row + 50}`;

    const icon = showIcon ? icons[hex.className]?.icon : undefined;

    return { centre, transform, lowest, points, label, icon };
  }, [hex, icons, layout, scale, showIcon]);

  const clicked = useCallback(() => onClick?.(hex), [hex, onClick]);

  return (
    <g className={combinedClassName} transform={transform} onClick={clicked}>
      <polygon className={styles.shape} points={points} />
      {icon && (
        <text
          className={styles.icon}
          alignmentBaseline="central"
          textAnchor="middle"
        >
          {icon}
        </text>
      )}
      {showLabel && (
        <text
          className={styles.label}
          y={lowest.y}
          alignmentBaseline="ideographic"
          textAnchor="middle"
        >
          {label}
        </text>
      )}
    </g>
  );
}

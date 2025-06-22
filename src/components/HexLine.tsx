import { useMemo } from "react";
import { HexLike } from "../lib/Hex";
import { useLayout } from "./LayoutContext";

export interface HexLineProps {
  a: HexLike;
  b: HexLike;
  className?: string;
}

export default function HexLine({ a, b, className }: HexLineProps) {
  const layout = useLayout();
  const { x1, y1, x2, y2 } = useMemo(() => {
    const { x: x1, y: y1 } = layout.toPixel(a);
    const { x: x2, y: y2 } = layout.toPixel(b);
    return { x1, y1, x2, y2 };
  }, [layout, a, b]);

  return <line className={className} x1={x1} y1={y1} x2={x2} y2={y2} />;
}

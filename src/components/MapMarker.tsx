import { useMemo } from "react";
import { useAppSelector } from "../redux/store";
import { useLayout } from "./LayoutContext";

export default function MapMarker() {
  const layout = useLayout();
  const position = useAppSelector((state) => state.map.position);
  const centre = useMemo(() => layout.toPixel(position), [layout, position]);

  return <circle cx={centre.x} cy={centre.y} r={layout.size.x / 4} />;
}

import { useAppSelector } from "../redux/store";

import Marker from "./Marker";

export default function MapMarker() {
  const position = useAppSelector((state) => state.map.position);

  return <Marker position={position} />;
}

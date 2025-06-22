import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import HexDisplay from "./HexDisplay";
import panZoom, { Transform } from "panzoom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { selectAllHexes } from "../redux/selectors";
import MapMarker from "./MapMarker";
import { useLayout } from "./LayoutContext";
import HexLine from "./HexLine";
import styles from "./App.module.scss";
import Point from "../lib/Point";
import Hex, { HexLike } from "../lib/Hex";
import { setPosition } from "../redux/map";
import { applyEngine } from "../flower";
import { addHex, asData } from "../redux/hexes";
import { randomPick } from "../lib/maths";

interface HexMapProps {
  className?: string;
}

export default function HexMap({ className }: HexMapProps) {
  const dispatch = useAppDispatch();
  const layout = useLayout();
  const hexes = useAppSelector(selectAllHexes);
  const engine = useAppSelector((s) => s.engine);
  const position = useAppSelector((s) => s.map.position);
  const [transform, setTransform] = useState<Transform>({
    x: 0,
    y: 0,
    scale: 1,
  });

  const svgRef = useRef<SVGGElement>(null);
  useEffect(() => {
    if (svgRef.current) {
      const instance = panZoom(svgRef.current, {
        autocenter: true,
        initialZoom: 1,
      });

      setTransform(instance.getTransform());
      instance.on("pan", () => setTransform(instance.getTransform()));
      instance.on("zoom", () => setTransform(instance.getTransform()));

      return () => instance.dispose();
    }
  }, []);

  const [destination, setDestination] = useState<HexLike>();
  const onMouseMove = useCallback<MouseEventHandler>(
    (e) => {
      const point = new Point(e.clientX, e.clientY)
        .subtract(transform)
        .div(transform.scale);
      const hex = layout.toHexRounded(point);

      if (hex.distance(position) === 1) setDestination(hex);
      else setDestination(undefined);
    },
    [layout, position, transform]
  );
  const onMouseOut = useCallback(() => setDestination(undefined), []);

  const onClick = useCallback(() => {
    if (destination) {
      const { q: bq, r: br, s: bs } = destination;

      const comingFrom = new Hex(position.q, position.r, position.s);
      const goingTo = new Hex(bq, br, bs);

      const source = hexes.find((h) => comingFrom.equals(h));
      const destinationData = hexes.find((h) => goingTo.equals(h));

      if (source && !destinationData) {
        const newIndex = applyEngine(engine, source.index);
        const types = engine.types[newIndex];
        const newType = randomPick(types);
        dispatch(addHex(asData(goingTo, newIndex, newType)));
      }
      dispatch(setPosition({ q: bq, r: br, s: bs }));
      setDestination(undefined);
    }
  }, [destination, dispatch, engine, hexes, position]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onMouseMove={onMouseMove}
      onMouseOut={onMouseOut}
      onClick={onClick}
    >
      <g ref={svgRef}>
        <g name="hexes">
          {hexes.map((h) => (
            <HexDisplay key={h.id} hex={h} showIcon showLabel />
          ))}
        </g>
        <MapMarker />
        {destination && (
          <>
            <HexDisplay
              hex={{
                ...destination,
                id: "outline",
                index: 0,
                className: styles.outline,
              }}
            />
            <HexLine className={styles.travel} a={position} b={destination} />
          </>
        )}
      </g>
    </svg>
  );
}

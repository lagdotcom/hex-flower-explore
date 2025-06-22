import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import HexDisplay from "./HexDisplay";
import panZoom, { PanZoom } from "panzoom";
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
  const [width] = useState(400);
  const [height] = useState(400);
  const [left] = useState(-200);
  const [top] = useState(-200);

  const dispatch = useAppDispatch();
  const layout = useLayout();
  const hexes = useAppSelector(selectAllHexes);
  const engine = useAppSelector((s) => s.engine);
  const position = useAppSelector((s) => s.map.position);
  const [panZoomInstance, setPanZoomInstance] = useState<PanZoom>();

  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (svgRef.current) {
      const instance = panZoom(svgRef.current);
      setPanZoomInstance(instance);
      return () => {
        setPanZoomInstance(undefined);
        instance.dispose();
      };
    }
  }, []);

  const [destination, setDestination] = useState<HexLike>();
  const onMouseMove = useCallback<MouseEventHandler>(
    (e) => {
      const transform = panZoomInstance?.getTransform() ?? {
        x: 0,
        y: 0,
        scale: 1,
      };

      const client = new Point(e.clientX, e.clientY);
      const view = client.add({ x: left, y: top });
      const shift = view.subtract(transform);

      // TODO this doesn't work yet
      const scaled = shift.div(transform.scale);

      const hex = layout.toHexRounded(scaled);

      // console.clear();
      // console.log(
      //   transform,
      //   client.toString(),
      //   view.toString(),
      //   shift.toString(),
      //   scaled.toString(),
      //   hex.toString()
      // );

      if (hex.distance(position) === 1) setDestination(hex);
      else setDestination(undefined);
    },
    [layout, left, top, position, panZoomInstance]
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
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      height={height}
      width={width}
      viewBox={`${left} ${top} ${width} ${height}`}
      onMouseMove={onMouseMove}
      onMouseOut={onMouseOut}
      onClick={onClick}
    >
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
    </svg>
  );
}

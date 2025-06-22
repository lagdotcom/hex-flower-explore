import classNames from "classnames";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import HexDisplay, { HexDisplayProps } from "./HexDisplay";
import { addHex, asData, getHexId } from "../redux/hexes";
import Hex from "../lib/Hex";
import { int } from "../lib/flavours";
import { EngineIndex } from "../redux/engine";
import { useLayout } from "./LayoutContext";
import { selectHexesRecord } from "../redux/selectors";
import styles from "./App.module.scss";
import Marker from "./Marker";
import { randomPick } from "../lib/maths";

const enginePositions = [
  new Hex<int>(0, 2),
  new Hex<int>(-1, 2),
  new Hex<int>(1, 1),
  new Hex<int>(-2, 2),
  new Hex<int>(0, 1),
  new Hex<int>(2, 0),
  new Hex<int>(-1, 1),
  new Hex<int>(1, 0),
  new Hex<int>(-2, 1),
  new Hex<int>(0, 0),
  new Hex<int>(2, -1),
  new Hex<int>(-1, 0),
  new Hex<int>(1, -1),
  new Hex<int>(-2, 0),
  new Hex<int>(0, -1),
  new Hex<int>(2, -2),
  new Hex<int>(-1, -1),
  new Hex<int>(1, -2),
  new Hex<int>(0, -2),
];

interface EngineDisplayProps {
  className?: string;
}

const paddingX = 50;
const paddingY = 80;
const offsetX = 0;
const offsetY = 10;

export default function EngineDisplay({ className }: EngineDisplayProps) {
  const layout = useLayout();
  const { width, height, viewBox, legendY } = useMemo(() => {
    const width = layout.size.x * 8 + paddingX;
    const height = layout.size.y * 8 + paddingY;

    const hw = width / 2;
    const hh = height / 2;

    const viewBox = `${-hw + offsetX} ${-hh + offsetY} ${width} ${height}`;

    const legendY = layout.size.y * 5;

    return { width, height, viewBox, legendY };
  }, [layout]);

  const dispatch = useAppDispatch();

  const position = useAppSelector((s) => s.map.position);
  const hexes = useAppSelector(selectHexesRecord);
  const marker = useMemo(
    () => enginePositions[hexes[getHexId(position)].index],
    [hexes, position]
  );

  const engine = useAppSelector((s) => s.engine);
  const engineHexes = useMemo(() => {
    const hdp: HexDisplayProps[] = [];

    for (let i = 0; i < enginePositions.length; i++) {
      const pos = enginePositions[i];
      const types = engine.types[i];

      const onClick = () =>
        dispatch(addHex(asData(position, i as EngineIndex, randomPick(types))));

      const scaleStep = 1 / types.length;
      var scale = 1;
      for (const type of types) {
        hdp.push({
          hex: asData(pos, i as EngineIndex, type),
          showIcon: types.length === 1,
          onClick,
          scale,
          className: classNames(styles.canHover, {
            [styles.dashed]: types.length > 1,
          }),
        });

        scale -= scaleStep;
      }
    }

    return hdp;
  }, [dispatch, engine, position]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={width}
      height={height}
      viewBox={viewBox}
    >
      {engineHexes.map((data, i) => (
        <HexDisplay key={i} {...data} />
      ))}
      <Marker position={marker} />
      <text y={legendY} alignmentBaseline="central" textAnchor="middle">
        {engine.name}
      </text>
    </svg>
  );
}

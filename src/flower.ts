import { Direction } from "./lib/Hex";
import { ceil, random } from "./lib/maths";
import {
  EngineIndex,
  EngineMove,
  EngineRule,
  EngineState,
} from "./redux/engine";

function makeRules(
  from: EngineIndex,
  se: EngineIndex,
  s: EngineIndex,
  sw: EngineIndex,
  nw: EngineIndex,
  n: EngineIndex,
  ne: EngineIndex,
): EngineRule[] {
  return [
    { from, move: "SE", type: "redirect", to: se },
    { from, move: "S", type: "redirect", to: s },
    { from, move: "SW", type: "redirect", to: sw },
    { from, move: "NW", type: "redirect", to: nw },
    { from, move: "N", type: "redirect", to: n },
    { from, move: "NE", type: "redirect", to: ne },
  ];
}

const defaultMoveRules: EngineRule[] = [
  ...makeRules(0, 3, 18, 5, 1, 4, 2),
  ...makeRules(1, 0, 16, 10, 3, 6, 4),
  ...makeRules(2, 8, 17, 0, 4, 7, 5),
  ...makeRules(3, 1, 13, 15, 0, 8, 6),
  ...makeRules(4, 0, 1, 6, 9, 7, 2),
  ...makeRules(5, 13, 15, 2, 7, 10, 0),
  ...makeRules(6, 1, 3, 8, 11, 9, 4),
  ...makeRules(7, 2, 4, 9, 12, 10, 5),
  ...makeRules(8, 6, 3, 17, 2, 13, 11),
  ...makeRules(9, 7, 4, 6, 11, 14, 12),
  ...makeRules(10, 16, 5, 7, 12, 15, 1),
  ...makeRules(11, 9, 6, 8, 13, 16, 14),
  ...makeRules(12, 10, 7, 9, 14, 17, 15),
  ...makeRules(13, 11, 8, 18, 5, 3, 16),
  ...makeRules(14, 12, 9, 11, 16, 18, 17),
  ...makeRules(15, 18, 10, 12, 17, 5, 3),
  ...makeRules(16, 14, 11, 13, 10, 1, 18),
  ...makeRules(17, 15, 12, 14, 18, 2, 8),
  ...makeRules(18, 17, 14, 16, 15, 0, 13),
];

export function roll2d6() {
  const a = ceil(random() * 6);
  const b = ceil(random() * 6);
  return a + b;
}

export const moves: Record<EngineMove, Direction> = {
  SE: 0,
  S: 1,
  SW: 2,
  NW: 3,
  N: 4,
  NE: 5,
};

const isRuleMatch =
  (from: EngineIndex, move: EngineMove) => (rule: EngineRule) =>
    rule.from === from && rule.move === move;

export function applyEngine(engine: EngineState, from: EngineIndex) {
  const navigation = roll2d6() - 2;
  const move = engine.moves[navigation];
  const match = isRuleMatch(from, move);

  const rule = engine.rules.find(match) ?? defaultMoveRules.find(match);
  if (!rule) throw new Error(`Could not find rule match for ${from}:${move}`);

  // console.log("applyEngine", from, navigation, move, rule);

  if (rule.type === "stay") return from;
  return rule.to;
}

import { float } from "./flavours";
import Hex, { HexLike } from "./Hex";
import { cos, sin, π2 } from "./maths";
import Orientation from "./Orientation";
import Point, { PointLike } from "./Point";

export default class Layout {
  constructor(
    public orientation: Orientation,
    public size: Point,
    public origin: Point = new Point(0, 0),
  ) {}

  toPixel(h: HexLike) {
    const { orientation, size, origin } = this;
    const x = (orientation.f0 * h.q + orientation.f1 * h.r) * size.x;
    const y = (orientation.f2 * h.q + orientation.f3 * h.r) * size.y;

    return new Point(x + origin.x, y + origin.y);
  }

  toHex(p: PointLike) {
    const { orientation, size, origin } = this;
    const pt = new Point((p.x - origin.x) / size.x, (p.y - origin.y) / size.y);
    const q = orientation.b0 * pt.x + orientation.b1 * pt.y;
    const r = orientation.b2 * pt.x + orientation.b3 * pt.y;

    return new Hex<float>(q, r);
  }

  toHexRounded(p: PointLike) {
    return this.toHex(p).round();
  }

  getCornerOffset(corner: 0 | 1 | 2 | 3 | 4 | 5) {
    const { orientation, size } = this;
    const angle = (π2 * (orientation.startAngle + corner)) / 6;
    return new Point(size.x * cos(angle), size.y * sin(angle));
  }

  getPolygonCorners(h: HexLike) {
    const centre = this.toPixel(h);
    return [
      centre.add(this.getCornerOffset(0)),
      centre.add(this.getCornerOffset(1)),
      centre.add(this.getCornerOffset(2)),
      centre.add(this.getCornerOffset(3)),
      centre.add(this.getCornerOffset(4)),
      centre.add(this.getCornerOffset(5)),
    ];
  }
}

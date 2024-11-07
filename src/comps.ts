import { k } from "./kaplay";

export function doubleSling(): any {
  let isAreaPressed = false;
  return {
    id: "sling",
    require: ["area", "pos"],

    add() {
      k.onMousePress(() => {
        isAreaPressed = true;
      });
      k.onMouseRelease(() => {
        const v = this.pos.sub(k.mousePos());
        const speed = v.len();
        this.use(k.move(v.scale(1 / speed), speed));
        isAreaPressed = false;
      });
    },
    draw() {
      if (isAreaPressed) {
        const v = this.pos.sub(k.mousePos()).normal().unit();
        const p = this.fromScreen(k.mousePos());
        k.drawLines({
          pts: [v.scale(32), p, v.scale(-32)],
          width: 14,
          color: k.rgb(0, 0, 255),
          join: "round",
        });
      }
    },
  };
}

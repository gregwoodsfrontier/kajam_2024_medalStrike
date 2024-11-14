import { k } from "../kaplay";
import { GameObj, AreaComp, PosComp, FixedComp } from "kaplay";
import { createZombie } from "../prefabs/zombie";

export type BeSummoned = "zombie";

// custom comps start
export function spawner() {
  return {
    id: "spawner",
    require: ["area", "pos"],
      execute(this: PosComp, _summon: BeSummoned) {
        // grab a random position within the designed radius.
      if (_summon === "zombie") {
        createZombie(k, this.pos.x, this.pos.y);
      }
    },
    add() {},
  };
}

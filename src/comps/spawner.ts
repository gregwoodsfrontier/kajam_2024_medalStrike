import { k } from "../kaplay";
import { GameObj, AreaComp, PosComp, FixedComp, Vec2, Comp, TimerComp, OpacityComp } from "kaplay";
import { createZombie } from "../prefabs/zombie";
import { GAME_PARAMS } from "../utils";

export type BeSummoned = "zombie";

export interface SpawnerComp extends Comp {
  isSpawnerActive: boolean;
}

// custom comps start
export function spawner(): SpawnerComp {
  let isSpawnerActive = false
  const MAX_ZOMBIE_COUNT = 9
  return {
    isSpawnerActive,
    id: "spawner",
    require: ["pos", "timer", "opacity"],
    update(this: GameObj<PosComp|TimerComp|SpawnerComp|OpacityComp>) {
      if(!this.isSpawnerActive || GAME_PARAMS.zombCount > MAX_ZOMBIE_COUNT) {
        this.opacity = 0.5
      } else {
        this.opacity = 1.0
      }
    },
    add(this: GameObj<PosComp|TimerComp|SpawnerComp|OpacityComp>) {
      
      // loop create the zombies on spawn points
      this.loop(5, () => {
        console.log("comp is ", isSpawnerActive)
        
        if(!this.isSpawnerActive || GAME_PARAMS.zombCount > MAX_ZOMBIE_COUNT) {
          return
        }

        let a = k.rand(359)     
        const z = createZombie(k, this.pos.x, this.pos.y);
        z.addForce(k.vec2(2e5 * Math.cos(a/180*Math.PI), 2e5 * Math.sin(a/180*Math.PI)))
      })
    }
  };
}

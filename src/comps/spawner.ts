import { k } from "../kaplay";
import { GameObj, AreaComp, PosComp, FixedComp, Vec2, Comp, TimerComp } from "kaplay";
import { createZombie } from "../prefabs/zombie";

export type BeSummoned = "zombie";

export interface SpawnerComp extends Comp {
  spawnPoints: Vec2[];
  r: number;
  isSpawnerActive: boolean
}

// custom comps start
export function spawner(): SpawnerComp {
  let spawnPoints = [] as Vec2[]
  let r = 20
  let isSpawnerActive = false
  return {
    spawnPoints,
    r,
    isSpawnerActive,
    id: "spawner",
    require: ["pos", "timer"],
    add(this: GameObj<PosComp|TimerComp|SpawnerComp>) {
      // create spawn points
      for(let i = 0; i < 3; i++) {
        spawnPoints.push(
          k.vec2(
            r*Math.cos(Math.PI*i/2), 
            r*Math.sin(Math.PI*i/2)
          )
        )
        // create area game obj to check if there is zombie on the area. Dont spawn if there is.
      }
      // loop create the zombies on spawn points
      this.loop(5, () => {
        console.log("comp is ", isSpawnerActive)
        if(!this.isSpawnerActive) return
        let selectedPoint = spawnPoints[1]
        let a = k.rand(359)     
        const z = createZombie(k, this.pos.x + selectedPoint.x, this.pos.y + selectedPoint.y);
        z.addForce(k.vec2(100000 * Math.cos(a/180*Math.PI), 100000 * Math.sin(a/180*Math.PI)))
      })
    }
  };
}

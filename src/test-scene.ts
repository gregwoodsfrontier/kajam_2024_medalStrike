import { GAME_OVER_SCENE_KEY } from "./game-over-scene"
import { createBounds } from "./game-scene"
import { k } from "./kaplay"
import { setPlanckWorld, world } from "./planck/world"
import { createPlayer } from "./prefabs/player"
import { createTomb } from "./prefabs/tomb"
import { createZombie } from "./prefabs/zombie"
import { LAYER_NAME } from "./utils"

export const TEST_SCENE_KEY = "test"

export const createTestScene = () => {

    k.layers(
        [
            LAYER_NAME.BG,
            LAYER_NAME.GAME,
            LAYER_NAME.UI
        ], 
        LAYER_NAME.GAME
    )

    const scoreObj = k.add([
        k.layer(LAYER_NAME.BG),
        k.anchor("topleft"),
        k.text("Score: 0"),
        {
            value: 0
        }
    ])

    const scoreIncrementer = k.loop(2, () => {
        scoreObj.value += 10
        scoreObj.text = `Score: ${scoreObj.value}`
    })

    const  setGameOverCondition = () => {
        if(k.get("player")) return
        // else
        scoreIncrementer.cancel()
        k.go(GAME_OVER_SCENE_KEY, { score: scoreObj.value })
    }

    // const setupPhyDestory = () => {
    //     k.get("QDestroy").forEach((obj: GameObj) => {
    //         if(obj.is("circleCollider")) {
    //           obj.filterGroupIdx = -1
    //         } else {
    //           console.error("No circle collider for this obj")
    //         }
      
    //         if(obj.is("rigidBody")) {
    //           obj.linearDrag = 7
    //         } else {
    //           console.error("No rigidBody for this obj")
    //         }
      
    //         obj.angularVelocity = 2
      
    //         if(obj.is("scale")) {
    //           if (obj.scale.x > 0.51) {
    //             obj.scaleTo(k.lerp(obj.scale.x, 0.5, 1/15))
    //           } else {
    //             obj.destroy()
    //           }
    //         }
    //       });
    // }

    // scoreIncrementer.cancel()

    k.onUpdate(() => {
        setPlanckWorld(world)

        // setupPhyDestory()

        setGameOverCondition()
    })

    createBounds(k, 1024, 512);

    const tomb = createTomb(k, k.width()/2, k.height()/2)

    k.onKeyPress("space", () => {
        tomb.isSpawnerActive = !tomb.isSpawnerActive
        console.log("tomb is ", tomb.isSpawnerActive)
    })

    // const z = createZombie(k, k.width()/2, k.height()/2)
    
    // const z = createZombie(k, k.width()/2 - 100, k.height()/2 - 100)
    const p = createPlayer(k, k.width()/2 - 100, k.height()/2 - 100)

    // z.addForce(k.vec2(50000, 0))

    // k.onMousePress(() => {
    //     // const v = z.pos.sub(k.mousePos());
    //     const v = k.mousePos().sub(z.pos)
    //     z.addForce(v.unit().scale(z.speed))
    // })

    // const sensor = k.add([
    //     k.pos(250, 400),
    //     k.circle(64),
    //     k.color(134, 255, 100),
    //     k.outline(4),
    //     k.rotate(0),
    //     rigidBody({
    //       type: "static",
    //     }),
    //   ]);
    //   sensor.use(
    //     circleCollider({
    //       radius: sensor.radius,
    //       isTrigger: true,
    //     })
    //   );
    //   sensor.onCollisionEnter((_body: GameObj) => {
    //     sensor.color = k.rgb(255, 0, 0);
    //     _body.use("QDestroy");
    //   });
    //   sensor.onCollisionExit(() => {
    //     sensor.color = k.rgb(134, 255, 100);
    //   });
}
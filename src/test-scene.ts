import { k } from "./kaplay"
import { setPlanckWorld, world } from "./planck/world"
import { createTomb } from "./prefabs/tomb"
import { createZombie } from "./prefabs/zombie"

export const TEST_SCENE_KEY = "test"

export const createTestScene = () => {
    k.onUpdate(() => {
        setPlanckWorld(world)
    })

    const tomb = createTomb(k, k.width()/2, k.height()/2)

    k.onKeyPress("space", () => {
        tomb.isSpawnerActive = !tomb.isSpawnerActive
        console.log("tomb is ", tomb.isSpawnerActive)
    })

    // const z = createZombie(k, k.width()/2, k.height()/2)
    // const z = createZombie(k, 100, 100)

    // z.addForce(k.vec2(50000, 0))

    // k.onMousePress(() => {
    //     // const v = z.pos.sub(k.mousePos());
    //     const v = k.mousePos().sub(z.pos)
    //     z.addForce(v.unit().scale(z.speed))
    // })
}
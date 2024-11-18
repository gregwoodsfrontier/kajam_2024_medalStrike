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

    const levelChar = [
        "1^^^^^^^^^^^^^^2",
        "[              ]",
        "[              ]",
        "[              ]",
        "[              ]",
        "[              ]",
        "[              ]",
        "3vvvvvvvvvvvvvv4"
    ]

    createBounds(k, 1024, 512, false);

    const level = k.addLevel(levelChar, {
        tileWidth: 64,
        tileHeight: 64,
        pos: k.vec2(128 + 32, 104 + 32),
        tiles: {
            "1": () => [
                k.sprite("grave-tile", {
                    frame: 0
                }),
                k.layer(LAYER_NAME.GAME),
                k.anchor("center"),
                k.rotate(0)
            ],
            "2": () => [
                k.sprite("grave-tile", {
                    frame: 0
                }),
                k.layer(LAYER_NAME.GAME),
                k.anchor("center"),
                k.rotate(90)
            ],
            "3": () => [
                k.sprite("grave-tile", {
                    frame: 0
                }),
                k.layer(LAYER_NAME.GAME),
                k.anchor("center"),
                k.rotate(-90)
            ],
            "4": () => [
                k.sprite("grave-tile", {
                    frame: 0
                }),
                k.layer(LAYER_NAME.GAME),
                k.anchor("center"),
                k.rotate(180)
            ],
            "^": () => [
                k.sprite("grave-tile", {
                    frame: 1
                }),
                k.layer(LAYER_NAME.GAME),
                k.anchor("center"),
                k.rotate(0)
            ],
            "v": () => [
                k.sprite("grave-tile", {
                    frame: 1
                }),
                k.layer(LAYER_NAME.GAME),
                k.anchor("center"),
                k.rotate(180)
            ],
            "[": () => [
                k.sprite("grave-tile", {
                    frame: 1
                }),
                k.layer(LAYER_NAME.GAME),
                k.anchor("center"),
                k.rotate(-90)
            ],
            "]": () => [
                k.sprite("grave-tile", {
                    frame: 1
                }),
                k.layer(LAYER_NAME.GAME),
                k.anchor("center"),
                k.rotate(90)
            ],
            " ": () => [
                k.sprite("grave-tile", {
                    frame: 2
                }),
                k.layer(LAYER_NAME.GAME),
                k.anchor("center"),
                k.rotate(90)
            ],
        }
    })
    
    k.onUpdate(() => {
        setPlanckWorld(world)

        setGameOverCondition()
    })


    // const tomb = createTomb(k, k.width()/2, k.height()/2)

    const p = createPlayer(k, k.width()/2 - 100, k.height()/2 - 100)

}
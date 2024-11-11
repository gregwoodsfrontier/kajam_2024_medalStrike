import { k } from './kaplay'

export const GAME_OVER_SCENE_KEY = "gameover"

export const createGameOverScene = () => {
    const bottle = k.add([
        k.pos(k.width()/2, k.height()/2),
        k.anchor("center"),
    ])
    bottle.add([
        k.pos(0,0),
        k.rect(500, 100),
        k.color(255, 0, 0),
        k.anchor("center"),
    ])
    bottle.add([
        k.pos(0, 0),
        k.text("You Win!"),
        k.anchor("center"),
        k.color(0, 0, 255)
    ])

    console.log(bottle)
}
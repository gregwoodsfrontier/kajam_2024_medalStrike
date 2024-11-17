import { GAME_SCENE_KEY } from './game-scene'
import { k } from './kaplay'
import { GAME_PARAMS } from './utils'

export const GAME_OVER_SCENE_KEY = "gameover"

//@ts-ignore
export const createGameOverScene = ({score}) => {
    if(score > GAME_PARAMS.highScore) {
        GAME_PARAMS.highScore = score
    }

    const bottle = k.add([
        k.pos(k.width()/2, k.height()/2),
        k.anchor("center"),
    ])
    bottle.add([
        k.pos(0,0),
        k.rect(600, 100),
        k.color(255, 0, 0),
        k.anchor("center"),
    ])
    bottle.add([
        k.pos(0, 0),
        k.text("GLNT! (Good luck Next Time)"),
        k.anchor("center"),
        k.color(0, 0, 255)
    ])
    bottle.add([
        k.pos(0, 100),
        k.text(`${GAME_PARAMS.highScore}`),
        k.anchor("center"),
        k.color(0, 0, 255)
    ])

    k.wait(3, () => {
        k.go(GAME_SCENE_KEY)
    })
}
import { k } from "./kaplay";
import { p2k, setPlanckWorld, world } from "./planck/world";
import { Game, GameObj, KAPLAYCtx, SpriteComp, StateComp, TweenController } from "kaplay";
import { rigidBody, RigidBodyComp } from "./planck/rigid_body";
import { circleCollider, CircleColliderComp, edgeCollider } from "./planck/collider";
import { createPlayer } from "./prefabs/player";
import { GAME_PARAMS, LAYER_NAME } from "./utils";
import { GAME_OVER_SCENE_KEY } from "./game-over-scene";
import { createTomb } from "./prefabs/tomb";

export const GAME_SCENE_KEY = "game"

export const levelChar = [
  "1^^^^^^^^^^^^^^2",
  "[              ]",
  "[              ]",
  "[              ]",
  "[              ]",
  "[              ]",
  "[              ]",
  "3vvvvvvvvvvvvvv4"
]

export function renderGround(_k: KAPLAYCtx , _inputChar: string[]): GameObj {
  return _k.addLevel(_inputChar, {
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
}

export function createEnemy(_k: KAPLAYCtx, _posx: number, _posy: number): void {
  const e = _k.add([
    _k.sprite("bean"),
    _k.color(255, 0, 255),
    _k.pos(_posx, _posy),
    _k.area(),
    _k.anchor("center"),
    _k.rotate(0),
    rigidBody({
      type: "dynamic",
      gravityScale: 0,
      linearDrag: 0.5,
      angularDrag: 0.8,
    }),
    circleCollider({
      radius: 25,
      friction: 0.5,
      bounciness: 0.8,
    }),
    "enemy",
  ]);
  e.filterGroupIdx = 1
}

export function createBounds(_k: KAPLAYCtx, _width: number, _height: number, _isSensor: boolean) {
  const points = [
    _k.vec2(0, 0),
    _k.vec2(_width, 0),
    _k.vec2(_width, _height),
    _k.vec2(0, _height),
  ];
  const b = _k.add([
    _k.layer(LAYER_NAME.GAME),
    _k.polygon(points),
    // _k.outline(4, _k.rgb(255, 0, 255)),
    _k.color(255, 255, 10),
    _k.pos(_k.width() / 2 - _width / 2, _k.height() / 2 - _height / 2),
    _k.rotate(0),
    rigidBody({
      type: "static",
    }),
    edgeCollider({
      points: points,
      bounciness: 0.2,
      isLoop: true,
      isTrigger: _isSensor
    }),
  ]);

  if(_isSensor) {
    b.onCollisionEnter((obj) => {
      obj.use("QDestroy")
    })
  }
}

export const createGameScene = () => {

  if(!GAME_PARAMS.isLayerDefined) {
    k.layers(
      [
          LAYER_NAME.BG,
          LAYER_NAME.GAME,
          LAYER_NAME.UI
      ], 
      LAYER_NAME.GAME
    )
    GAME_PARAMS.isLayerDefined = true
  }

  

  k.on("zombie_spawned", "zombie", () => {
    GAME_PARAMS.zombCount += 1
    console.log(`${GAME_PARAMS.zombCount} zombies are spawned`)
  })

  k.on("zombie_destroyed", "zombie", () => {
    GAME_PARAMS.zombCount -= 1
    console.log(`${GAME_PARAMS.zombCount} zombies are destroyed`)
  })

  //zombie_destroyed


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
      if(k.get("player").length> 0) return
      // else
      scoreIncrementer.cancel()
      k.go(GAME_OVER_SCENE_KEY, { score: scoreObj.value })
  }

  const setupPhyDestory = () => {
    //@ts-ignore
    k.get(["QDestroy", "rigidBody", "circleCollider", "state"]).forEach((obj: GameObj<StateComp>) => {
      obj.enterState("dead")
    })

    // k.get("QDestroy").forEach((obj: GameObj) => {
    //     if(obj.is("circleCollider")) {
    //       obj.filterGroupIdx = -1
    //     } else {
    //       console.error("No circle collider for this obj")
    //     }
  
    //     if(obj.is("rigidBody")) {
    //       obj.linearDrag = 7
    //     } else {
    //       console.error("No rigidBody for this obj")
    //     }
  
    //     obj.angularVelocity = 2
  
    //     if(obj.is("scale")) {
    //       if (obj.scale.x > 0.51) {
    //         obj.scaleTo(k.lerp(obj.scale.x, 0.5, 1/15))
    //       } else {
    //         obj.destroy()
    //       }
    //     }
    //   });
  }

  // scoreIncrementer.cancel()

  k.onUpdate(() => {
      setPlanckWorld(world)

      setupPhyDestory()

      setGameOverCondition()
  })

  createBounds(k, 1024, 512, true);

  renderGround(k, levelChar)

  const tomb = createTomb(k, k.width()/2, k.height()/2)

  const p = createPlayer(k, k.width()/2 - 100, k.height()/2 - 100)

  if(tomb.isSpawnerActive === false) {
    k.wait(1, () => {
      tomb.isSpawnerActive = true
    })
  }

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

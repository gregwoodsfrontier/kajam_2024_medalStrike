import { k } from "./kaplay";
import { Vec2 as pV2, World } from "planck";
import { world } from "./planck/world";
import { GameObj, KAPLAYCtx } from "kaplay";
import { rigidBody } from "./planck/rigid_body";
import { circleCollider, edgeCollider } from "./planck/collider";
import { slingLine } from "./comps/slingLine";

export function setPlanckWorld(_world: World) {
  const timeStep = 1 / 60;
  const velocityIterations = 10;
  const positionIterations = 8;
  _world.setGravity(pV2(0, 0));
  _world.step(timeStep, velocityIterations, positionIterations);
}

export function createPlayer(_k: KAPLAYCtx, _posx: number, _posy: number): void {
  _k.add([
    _k.pos(_posx, _posy),
    _k.sprite("bean"),
    _k.anchor("center"),
    _k.area(),
    _k.rotate(0),
    rigidBody({
      type: "dynamic",
      freezeRotation: true,
      gravityScale: 0,
      linearDrag: 0.5,
    }),
    circleCollider({
      radius: 25,
      friction: 0.5,
      bounciness: 0.8,
    }),
    slingLine({
      speed: 5000,
    }),
    "player",
  ]);
}

export function createEnemy(_k: KAPLAYCtx, _posx: number, _posy: number): void {
  _k.add([
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
      bounciness: 0.8 
    }),
    "enemy",
  ]);
}

export function createBounds(_k: KAPLAYCtx, _width: number, _height: number) {
  const points = [
    _k.vec2(0,0), _k.vec2(_width,0),
    _k.vec2(_width,_height), _k.vec2(0,_height)
  ]
  _k.add([
    _k.polygon(points),
    _k.outline(4, _k.rgb(255, 0, 255)),
    _k.color(255, 255, 10),
    _k.pos(_k.width()/2 - _width/2, _k.height()/2 - _height/2),
    _k.rotate(0),
    rigidBody({
      type:"static"
    }),
    edgeCollider({
      points: points,
      bounciness: 0.2,
      isLoop: true
    })
  ])
}

export const createGameScene = () => {
    k.onUpdate(() => {
      setPlanckWorld(world)
    });

    k.on("onOutBounds", "rigidBody", (_obj: GameObj) => {
      console.log("char falls into pit")
      console.log(world.getBodyList())

      k.destroy(_obj)
      

      // if(_obj.is("circleCollider")) {
      //   _obj.unuse("circleCollider")
      // }

      // if(_obj.is("rigidBody")) {
      //   _obj.unuse("rigidBody")
      // }
      
      console.log(world.getBodyCount())
    })

    createBounds(k, 1024, 512)

    const sensor = k.add([
      k.pos(250, 400),
      k.circle(64),
      k.color(134, 255, 100),
      k.outline(4),
      k.rotate(0),
      rigidBody({
        type: "static"
      })
    ])
    sensor.use(circleCollider({
      radius: sensor.radius,
      isTrigger: true
    }))
    sensor.onCollisionEnter((_body: GameObj) => {
      sensor.color = k.rgb(255, 0, 0)
      _body.trigger("onOutBounds")
    })
    sensor.onCollisionExit(() => {
      sensor.color = k.rgb(134, 255, 100)
    })

    const enemyCoords = [
      { x: k.width() * 0.35, y: k.height() * 0.5 },
      { x: k.width() * 0.55, y: k.height() * 0.5 },
      { x: k.width() * 0.45, y: k.height() * 0.6 },
    ];
  
    for (let i = 0; i < enemyCoords.length; i++) {
      createEnemy(k, enemyCoords[i].x, enemyCoords[i].y)
    }

    
  
    createPlayer(k, k.width() / 2, k.height() / 2);
    createPlayer(k, k.width() / 2 -100, k.height() / 2 - 100);
    createPlayer(k, k.width() / 2 + 100, k.height() / 2 + 100);
  };


import { k } from "./kaplay";
import { Vec2 as pV2, World } from "planck";
import { p2k, world } from "./planck/world";
import { Game, GameObj, KAPLAYCtx, SpriteComp, TweenController } from "kaplay";
import { rigidBody, RigidBodyComp } from "./planck/rigid_body";
import { circleCollider, edgeCollider } from "./planck/collider";
import { slingLine } from "./comps/slingLine";

export function setPlanckWorld(_world: World) {
  const timeStep = 1 / 60;
  const velocityIterations = 10;
  const positionIterations = 8;
  _world.setGravity(pV2(0, 0));
  _world.step(timeStep, velocityIterations, positionIterations);
}

export function createPlayer(
  _k: KAPLAYCtx,
  _posx: number,
  _posy: number
): void {
  const p = _k.add([
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
  p.filterGroupIdx = 1
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

export function createBounds(_k: KAPLAYCtx, _width: number, _height: number) {
  const points = [
    _k.vec2(0, 0),
    _k.vec2(_width, 0),
    _k.vec2(_width, _height),
    _k.vec2(0, _height),
  ];
  _k.add([
    _k.polygon(points),
    _k.outline(4, _k.rgb(255, 0, 255)),
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
    }),
  ]);
}

export const createGameScene = () => {
  function createTween(_obj: GameObj) {
    const tw = k.tween(1, 0.5, 1, (v) => {
      _obj.scale = k.vec2(v, v)
    })
    
    return tw
  }

  let currTw: TweenController | undefined = undefined

  k.onUpdate(() => {
    setPlanckWorld(world);

    k.get("QDestroy").forEach((obj: GameObj) => {
      if(obj.is("circleCollider")) {
        obj.filterGroupIdx = -1
      } else {
        console.error("No circle collider for this obj")
      }

      if(obj.is("rigidBody")) {
        obj.linearDrag = 7
      } else {
        console.error("No rigidBody for this obj")
      }

      obj.angularVelocity = 2
      obj.use("scale")
      if(currTw) return
      currTw = createTween(obj)
      currTw.onEnd(() => {
        console.log("despawn bean here")
        obj.destroy()
        currTw = undefined
      })

      // k.wait(0.75, () => {
      //   console.log("despawn bean here")
      //   // obj.destroy()
      // })
    });
  });

  createBounds(k, 1024, 512);

  const sensor = k.add([
    k.pos(250, 400),
    k.circle(64),
    k.color(134, 255, 100),
    k.outline(4),
    k.rotate(0),
    rigidBody({
      type: "static",
    }),
  ]);
  sensor.use(
    circleCollider({
      radius: sensor.radius,
      isTrigger: true,
    })
  );
  sensor.onCollisionEnter((_body: GameObj) => {
    sensor.color = k.rgb(255, 0, 0);
    _body.use("QDestroy");
  });
  sensor.onCollisionExit(() => {
    sensor.color = k.rgb(134, 255, 100);
  });

  const enemyCoords = [
    { x: k.width() * 0.35, y: k.height() * 0.5 },
    { x: k.width() * 0.55, y: k.height() * 0.5 },
    { x: k.width() * 0.45, y: k.height() * 0.6 },
  ];

  for (let i = 0; i < enemyCoords.length; i++) {
    createEnemy(k, enemyCoords[i].x, enemyCoords[i].y);
  }

  createPlayer(k, k.width() / 2, k.height() / 2);
  createPlayer(k, k.width() / 2 - 100, k.height() / 2 - 100);
  createPlayer(k, k.width() / 2 + 100, k.height() / 2 + 100);
};

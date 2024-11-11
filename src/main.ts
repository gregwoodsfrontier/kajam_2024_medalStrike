import kaplay, { AreaComp, FixedComp, GameObj, KAPLAYCtx, PosComp, Vec2 } from "kaplay";
import { k } from "./kaplay";
import { Vec2 as pV2, World } from "planck";
import { rigidBody, RigidBodyComp } from "./planck/rigid_body";
import {
  circleCollider,
  edgeCollider,
  polygonCollider,
} from "./planck/collider";
import { k2p, world } from "./planck/world";
import { createGameScene } from "./game-scene";
import { createGameOverScene, GAME_OVER_SCENE_KEY } from "./game-over-scene";
// import { createGameScene } from "./game-scene";

k.loadSprite("bean", "sprites/bean.png");

export type SlingLineOpt = {
  speed: number;
};

// custom comps start
function slingLine(_opt: SlingLineOpt) {
  let isAreaPressed = false;
  return {
    id: "sling",
    require: ["area", "pos", "rigidBody"],
    add(this:GameObj<AreaComp|PosComp|RigidBodyComp>) {
      k.onMousePress(() => {
        if (this.isHovering()) {
          isAreaPressed = true;
        }
      });
      k.onMouseRelease(() => {
        if (isAreaPressed == true) {
          const v = this.pos.sub(k.mousePos());
          let speed = _opt.speed || 1;

          this.addForce(v.scale(speed));
          isAreaPressed = false;
        }
      });
    },
    draw(this:GameObj<PosComp|FixedComp>) {
      if (isAreaPressed) {
        k.drawLine({
          p1: k.vec2(0, 0),
          p2: this.fromScreen(k.mousePos()),
          width: 14,
          color: k.rgb(0, 0, 255),
        });
      }
    },
  };
}

function setPlanckWorld(_world: World) {
  const timeStep = 1 / 60;
  const velocityIterations = 10;
  const positionIterations = 8;
  _world.setGravity(pV2(0, 0));
  _world.step(timeStep, velocityIterations, positionIterations);
}

function createPlayer(_k: KAPLAYCtx, _posx: number, _posy: number): void {
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

function createBounds(_k: KAPLAYCtx, _width: number, _height: number) {
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

// custom function end
k.scene("game", createGameScene);
k.scene(GAME_OVER_SCENE_KEY, createGameOverScene)

k.scene("test", () => {
  // setPlanckWorld(world);
  const borderPoints = [] as Vec2[];
  for (let i = 0; i < 8; i++) {
    const R = 250;
    const v = k.vec2(
      R * Math.cos(k.deg2rad(22.5 + 45 * i)),
      R * Math.sin(k.deg2rad(22.5 + 45 * i))
    );
    borderPoints.push(v);
  }

  k.add([
    k.pos(k.width() / 2, k.height() / 2),
    k.polygon(borderPoints),
    k.outline(5, k.rgb(255, 0, 0)),
    "wall",
    k.rotate(),
    rigidBody({
      type: "static",
      freezeRotation: true,
    }),
    edgeCollider({
      points: borderPoints,
      bounciness: 1.0,
      isLoop: true,
    }),
  ]);

  world.setGravity(pV2(0, 0));

  k.onUpdate(() => {
    const timeStep = 1 / 60;
    const velocityIterations = 10;
    const positionIterations = 8;
    world.step(timeStep, velocityIterations, positionIterations);
  });

  const bean = k.add([
    k.pos(500, 400),
    k.sprite("bean"),
    k.anchor("center"),
    k.area(),
    k.rotate(0),
    rigidBody({
      type: "dynamic",
      freezeRotation: true,
      gravityScale: 0,
      linearDrag: 1.0,
    }),
    circleCollider({ radius: 25, friction: 0.5, bounciness: 1.0 }),
    // doubleSling()
    slingLine({
      speed: 1000,
    }),
    "player",
  ]);

  k.add([
    k.pos(k.width() / 2, k.height() / 2),
    k.sprite("bean"),
    k.anchor("center"),
    k.area(),
    k.rotate(0),
    rigidBody({
      type: "dynamic",
      gravityScale: 0,
      linearDrag: 0.5,
    }),
    circleCollider({ radius: 25, friction: 0.5, bounciness: 1.0 }),
  ]);
});

// k.go("test");
k.go("game");
// k.go(GAME_OVER_SCENE_KEY)

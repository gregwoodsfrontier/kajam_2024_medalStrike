import kaplay, { Vec2 } from "kaplay";
import { k } from "./kaplay";
import { Vec2 as pV2 } from "planck";
import { rigidBody } from "./planck/rigid_body";
import { circleCollider, edgeCollider, polygonCollider } from "./planck/collider";
import { k2p, world } from "./planck/world";
import { createGameScene } from "./game-scene";

// const k = kaplay({
//   global: false,
//   // width: 960,
//   // height: 640,
//   // stretch: true,
//   debug: true,
//   background: [0, 255, 255],
// });

k.loadSprite("bean", "sprites/bean.png");

// custom comps start
function slingLine() {
  let isAreaPressed = false;
  return {
    id: "sling",
    require: ["area", "pos", "rigidBody"],
    add() {
      k.onMousePress(() => {
        isAreaPressed = true;
      });
      k.onMouseRelease(() => {
        //@ts-ignore
        const v = this.pos.sub(k.mousePos()) as Vec2;
        const speed = v.len();
        //@ts-ignore
        // this.use(k.move(v.scale(1 / speed), speed));
        this.addForce(v.scale(1000));
        isAreaPressed = false;
      });
    },
    draw() {
      if (isAreaPressed) {
        k.drawLine({
          p1: k.vec2(0, 0),
          //@ts-ignore
          p2: this.fromScreen(k.mousePos()),
          width: 14,
          color: k.rgb(0, 0, 255),
        });
      }
    },
  };
}

export function doubleSling(): any {
  let isAreaPressed = false;
  return {
    id: "sling",
    require: ["area", "pos"],

    add() {
      k.onMousePress(() => {
        isAreaPressed = true;
      });
      k.onMouseRelease(() => {
        const v = this.pos.sub(k.mousePos());
        const speed = v.len();
        this.use(k.move(v.scale(1 / speed), speed));
        isAreaPressed = false;
      });
    },
    draw() {
      if (isAreaPressed) {
        const v = this.pos.sub(k.mousePos()).normal().unit();
        const p = this.fromScreen(k.mousePos());
        k.drawLines({
          pts: [v.scale(32), p, v.scale(-32)],
          width: 14,
          color: k.rgb(0, 0, 255),
          join: "round",
        });
      }
    },
  };
}

// custom function end

k.scene("game", createGameScene)

k.scene("test", () => {
  const borderPoints = [] as Vec2[]
  for (let i = 0; i < 8; i++) {
    const R = 250
    const v = k.vec2(R * Math.cos(k.deg2rad(22.5 + 45 * i)), R * Math.sin(k.deg2rad(22.5+45 * i)))
    borderPoints.push(v)
  }

  k.add([
    k.pos(k.width()/2, k.height()/2),
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
      isLoop: true
    })
  ])

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
    slingLine(),
    "player"
  ]);



  k.add([
    k.pos(k.width()/2, k.height()/2),
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

k.go("test")
// k.go("game");

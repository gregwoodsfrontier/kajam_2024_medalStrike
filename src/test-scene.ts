import { k } from "./kaplay";
import { Vec2 } from "planck";

export const TEST_SCENE_KEY = "test";

export const createTestScene = () => {
  const worldContainer = k.add([
    k.kpWorld({
      gravity: new Vec2(0, 10),
    }),
  ]);

  // adding a static body with edge shape
  worldContainer.add([
    k.kpPos(k.kpCenter()),
    k.kpRotate(Math.PI * 0.1),
    k.kpEdgeShape({
      v1: new Vec2(-10, 0),
      v2: new Vec2(10, 0),
      draw: true,
    }),
    k.kpBody({
      type: "static",
    }),
    k.kpFixture(),
    k.sprite("bean"),
    k.anchor("center"),
  ]);

  // 5. Add a ball by creating a dynamic body with a circle shape.
  worldContainer.add([
    k.kpPos(k.kpCenter().sub({ x: k.rand(-10, 10), y: k.rand(10, 15) })),
    k.kpRotate(),
    k.kpCircleShape({
      radius: 2,
      draw: true,
    }),
    k.kpBody({ type: "dynamic" }),
    k.kpFixture({ density: 1, friction: 0.3, restitution: 0.5 }),
    k.offscreen({ destroy: true }),
    k.sprite("bean"),
    k.anchor("center"),
  ]);

};

import { KAPLAYCtx, GameObj } from "kaplay";
import { slingLine } from "../comps/slingLine";
import { circleCollider } from "../planck/collider";
import { rigidBody } from "../planck/rigid_body";
import { LAYER_NAME } from "../utils";

export function createPlayer(
  _k: KAPLAYCtx,
  _posx: number,
  _posy: number
): GameObj {
  const p = _k.add([
    _k.layer(LAYER_NAME.GAME),
    _k.pos(_posx, _posy),
    _k.sprite("bean"),
    _k.anchor("center"),
    _k.area(),
    _k.rotate(0),
    _k.scale(1),
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
      speed: 2e5,
    }),
    _k.state("alive", ["alive", "dead"]),
    "player",
  ]);

  p.filterGroupIdx = 1;

  p.onStateEnter("dead", async () => {
    _k.wait(0.5, () => {
      _k.destroy(p)
    })
  })

  return p;
}

import { KAPLAYCtx, GameObj } from "kaplay";
import { slingLine } from "../comps/slingLine";
import { circleCollider } from "../planck/collider";
import { rigidBody } from "../planck/rigid_body";

export function createPlayer(
  _k: KAPLAYCtx,
  _posx: number,
  _posy: number
): GameObj {
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
  p.filterGroupIdx = 1;

  return p;
}

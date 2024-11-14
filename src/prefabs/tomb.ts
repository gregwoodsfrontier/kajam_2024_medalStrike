import { KAPLAYCtx, GameObj, PosComp } from "kaplay";
import { circleCollider } from "../planck/collider";
import { rigidBody, RigidBodyComp } from "../planck/rigid_body";
import { slingLine } from "../comps/slingLine";

export function createTomb(
  _k: KAPLAYCtx,
  _posx: number,
  _posy: number
): GameObj<PosComp> {
  const obj = _k.add([
    _k.sprite("tomb"),
    _k.pos(_posx, _posy),
    _k.anchor("center"),
    "spawner"
  ])

  return obj;
}

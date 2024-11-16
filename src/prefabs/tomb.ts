import { KAPLAYCtx, GameObj, PosComp } from "kaplay";
import { circleCollider } from "../planck/collider";
import { rigidBody, RigidBodyComp } from "../planck/rigid_body";
import { slingLine } from "../comps/slingLine";
import { spawner, SpawnerComp } from "../comps/spawner";

export function createTomb(
  _k: KAPLAYCtx,
  _posx: number,
  _posy: number
): GameObj<PosComp|SpawnerComp> {
  const obj = _k.add([
    _k.sprite("tomb"),
    _k.pos(_posx, _posy),
    _k.anchor("center"),
    _k.timer(),
    _k.scale(1),
    spawner()
  ])

  return obj;
}

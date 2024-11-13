import { KAPLAYCtx, GameObj, PosComp } from "kaplay";
import { circleCollider } from "../planck/collider";
import { rigidBody, RigidBodyComp } from "../planck/rigid_body";
import { slingLine } from "../comps/slingLine";

export type ZombieOpt = {
  speed: number
}

export function createZombie(
  _k: KAPLAYCtx,
  _posx: number,
  _posy: number
): GameObj<PosComp|RigidBodyComp|ZombieOpt> {
  const phyObj = _k.add([
    {
      speed: 50000 * 5
    },
    _k.sprite("skuller-o"),
    _k.opacity(0),
    _k.pos(_posx, _posy),
    _k.rotate(0),
    _k.area(),
    _k.anchor("center"),
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
      filterGroupIdx: 1
    }),
    // slingLine({
    //   speed: 2500
    // }),
    "zombie"
  ])
  phyObj.add([
    _k.pos(0, 0),
    _k.sprite("skuller-o"),
    _k.anchor("center")
  ])

  return phyObj;
}

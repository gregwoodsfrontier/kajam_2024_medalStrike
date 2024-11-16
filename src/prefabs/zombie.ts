import { KAPLAYCtx, GameObj, PosComp } from "kaplay";
import { circleCollider } from "../planck/collider";
import { rigidBody, RigidBodyComp } from "../planck/rigid_body";
import { slingLine } from "../comps/slingLine";
import { toMeters } from "../planck/world";

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
      launchForce: 5e5,
      velThres: 100
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
    _k.state("idle", ["idle", "aim", "launch"]),
    "zombie"
  ])
  phyObj.add([
    _k.pos(0, 0),
    _k.sprite("skuller-o"),
    _k.anchor("center"),
    _k.z(-1)
  ])

  phyObj.onStateEnter("idle", async () => {
    await _k.wait(1)
    phyObj.enterState("aim")
  })

  phyObj.onStateEnter("aim", async () => {
    const p = _k.get("player")[0]
    if(p.exists()) {
      await _k.wait(0.5)
      phyObj.enterState("launch")
      return
    }
    phyObj.enterState("idle")
  })

  phyObj.onStateEnter("launch", () => {
    const p = _k.get("player")[0]
    if(p.exists()) {
      const dir = p.pos.sub(phyObj.pos).unit()
      phyObj.addForce(dir.scale(phyObj.launchForce))
    }
  })

  phyObj.onStateUpdate("launch", () => {
    if(phyObj.velocity.len() < phyObj.velThres) {
      phyObj.enterState("idle")
    }
  })

  return phyObj;
}

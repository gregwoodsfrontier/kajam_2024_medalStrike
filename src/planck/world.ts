import { Vec2 as kV2 } from "kaplay";
import { KAPLAYCtx } from "kaplay";
import k2 from "kaplay";
import { World, Vec2 as pV2, Contact, Manifold } from "planck";

export function p2k(v: pV2) {
  return new Vec2(v.x * 10, v.y * 10);
}

export function k2p(v: kV2) {
  return pV2(v.x / 10, v.y / 10);
}

export let world = new World({
  gravity: pV2(0.0, 2400 / 100),
});

world.on("begin-contact", function (contact) {
  const bodyA = contact.getFixtureA().getBody().getUserData() as any;
  const bodyB = contact.getFixtureB().getBody().getUserData() as any;
  bodyA.trigger("collision_enter", bodyB);
  bodyB.trigger("collision_enter", bodyA);
});

world.on("end-contact", function (contact) {
  const bodyA = contact.getFixtureA().getBody().getUserData() as any;
  const bodyB = contact.getFixtureB().getBody().getUserData() as any;
  bodyA.trigger("collision_exit", bodyB);
  bodyB.trigger("collision_exit", bodyA);
});

export function planckIntegration(k: KAPLAYCtx) {
  world.on("pre-solve", function (contact, oldManifold) {
    const bodyA = contact.getFixtureA().getBody().getUserData() as any;
    const bodyB = contact.getFixtureB().getBody().getUserData() as any;
    if (bodyA.is("platformEffector") || bodyA.is("surfaceEffector")) {
      bodyA.trigger("collision_pre_solve", bodyB, contact, oldManifold);
    }
    if (bodyB.is("platformEffector") || bodyB.is("surfaceEffector")) {
      bodyB.trigger("collision_pre_solve", bodyA, contact, oldManifold);
    }
  });

  /*world.on('post-solve', function(contact, contactImpulse) {
        
    })*/

  return {};
}

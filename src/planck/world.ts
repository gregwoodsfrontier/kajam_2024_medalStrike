import { KAPLAYCtx, Vec2 as kV2 } from "kaplay";
import { k } from "../kaplay";
import { World, Vec2 as pV2, Contact, Manifold } from "planck";

export enum COLLISION_EVENTS {
  ENTER = "collision_enter",
  STAY = "collision_stay",
  EXIT = "collision_exit",
  PRE_SOLVE = "collision_pre_solve",
}

export const PLANCK_SETTINGS = {
  TIMESTEP: 1/60,
  VELOCITY_ITERATIONS: 10,
  POSITION_ITERATIONS: 8,
  WORLDSCALE: 10 // pixels to meters ratio
}

// simple function to convert meters to pixels
export function toPixels(_n: number) {
  return _n * PLANCK_SETTINGS.WORLDSCALE
}

// simple function to convert pixels to meters
export function toMeters(_n: number) {
  return _n / PLANCK_SETTINGS.WORLDSCALE
}

export function setPlanckWorld(_world: World) {
  _world.setGravity(pV2(0, 0));
  _world.step(PLANCK_SETTINGS.TIMESTEP, PLANCK_SETTINGS.VELOCITY_ITERATIONS, PLANCK_SETTINGS.POSITION_ITERATIONS);
}

export function p2k(v: pV2) {
  return k.vec2(toPixels(v.x), toPixels(v.y));
}

export function k2p(v: kV2) {
  return pV2(toMeters(v.x), toMeters(v.y));
}

export let world = new World({
  gravity: pV2(0.0, 2400 / 100),
});

world.on("begin-contact", function (contact) {
  const bodyA = contact.getFixtureA().getBody().getUserData() as any;
  const bodyB = contact.getFixtureB().getBody().getUserData() as any;
  bodyA.trigger(COLLISION_EVENTS.ENTER, bodyB);
  bodyB.trigger(COLLISION_EVENTS.ENTER, bodyA);
});

world.on("end-contact", function (contact) {
  const bodyA = contact.getFixtureA().getBody().getUserData() as any;
  const bodyB = contact.getFixtureB().getBody().getUserData() as any;
  bodyA.trigger(COLLISION_EVENTS.EXIT, bodyB);
  bodyB.trigger(COLLISION_EVENTS.EXIT, bodyA);
});

export function planckIntegration(k: KAPLAYCtx) {
  world.on("pre-solve", function (contact, oldManifold) {
    const bodyA = contact.getFixtureA().getBody().getUserData() as any;
    const bodyB = contact.getFixtureB().getBody().getUserData() as any;
    if (bodyA.is("platformEffector") || bodyA.is("surfaceEffector")) {
      bodyA.trigger(COLLISION_EVENTS.PRE_SOLVE, bodyB, contact, oldManifold);
    }
    if (bodyB.is("platformEffector") || bodyB.is("surfaceEffector")) {
      bodyB.trigger(COLLISION_EVENTS.PRE_SOLVE, bodyA, contact, oldManifold);
    }
  });

  /*world.on('post-solve', function(contact, contactImpulse) {
        
    })*/

  return {};
}

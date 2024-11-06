import { k } from "./kaplay";
import { world } from "./planck/world";

export const createGameScene = () => {
    k.onUpdate(() => {
      const timeStep = 1 / 60;
      const velocityIterations = 10;
      const positionIterations = 8;
      world.step(timeStep, velocityIterations, positionIterations);
    });
  
    const enemy = [];
  
    const enemyCoords = [
      { x: k.width() * 0.35, y: k.height() * 0.5 },
      { x: k.width() * 0.55, y: k.height() * 0.5 },
      { x: k.width() * 0.45, y: k.height() * 0.6 },
    ];
  
    for (let i = 0; i < enemyCoords.length; i++) {
      enemy.push(
        k.add([
          k.sprite("bean"),
          k.color(255, 0, 255),
          k.pos(enemyCoords[i].x, enemyCoords[i].y),
          k.area(),
          k.anchor("center"),
        ])
      );
    }
  };
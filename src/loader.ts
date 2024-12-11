import { k } from "./kaplay"

k.loadRoot("./");
k.loadSprite("grave-tile", "sprites/grave-tile.png", {
  sliceX: 3,
  anims: {
    corner: {
      from: 0,
      to: 0,
    },
    side: {
      from: 1,
      to: 1,
    },
    center: {
      from: 2,
      to: 2,
    },
  },
});
k.loadSprite("bean", "sprites/bean.png");
k.loadSprite("skuller", "sprites/skuller.png");
k.loadSprite("skuller-o", "sprites/skuller-o.png");
k.loadSprite("pointer", "sprites/pointer.png");
k.loadSprite("pointer-o", "sprites/pointer-o.png");
k.loadSprite("tomb", "sprites/tomb.png");
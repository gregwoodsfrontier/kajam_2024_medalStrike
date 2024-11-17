import { k } from "./kaplay";
import { createGameScene, GAME_SCENE_KEY } from "./game-scene";
import { createGameOverScene, GAME_OVER_SCENE_KEY } from "./game-over-scene";
import { createTestScene, TEST_SCENE_KEY } from "./test-scene";
// import { createGameScene } from "./game-scene";

k.loadSprite("bean", "sprites/bean.png");
k.loadSprite("skuller", "./sprites/skuller.png");
k.loadSprite("skuller-o", "./sprites/skuller-o.png");
k.loadSprite("pointer", "./sprites/pointer.png");
k.loadSprite("pointer-o", "./sprites/pointer-o.png");
k.loadSprite("tomb", "./sprites/tomb.png");

k.scene(GAME_SCENE_KEY, createGameScene);
k.scene(GAME_OVER_SCENE_KEY, createGameOverScene);
k.scene(TEST_SCENE_KEY, createTestScene)

// k.go(TEST_SCENE_KEY);
k.go(GAME_SCENE_KEY);
// k.go(GAME_OVER_SCENE_KEY, {score: 10})

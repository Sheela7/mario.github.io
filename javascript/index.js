import Camera from "./camera.js";
import Timer from "./timer.js";
import { createLevelLoader } from "./loaders/level.js";
import { loadEntities } from "./entities.js";
import { setupKeyboard } from "./input.js";
import { createCollisionLayer } from "./layers/collision.js";
import { loadFont } from "./loaders/font.js";
import { createDashboardLayer } from "./layers/dashboard.js";
import { createPlayerEnv, createPlayer } from "./player.js";

async function main(canvas) {
  const context = canvas.getContext("2d");
  const audioContext = new AudioContext();

  const [entityFactory, font] = await Promise.all([loadEntities(audioContext), loadFont()]);

  const loadLevel = await createLevelLoader(entityFactory);

  const level = await loadLevel("level1");

  const camera = new Camera();

  const mario = createPlayer(entityFactory.mario());
  mario.player.name = "MARIO";
  level.entities.add(mario);

  const playerEnv = createPlayerEnv(mario);
  level.entities.add(playerEnv);

  level.comp.layers.push(createCollisionLayer(level));
  level.comp.layers.push(createDashboardLayer(font, level));

  const input = setupKeyboard(mario);
  input.listenTo(window);

  const gameContext = {
    audioContext,
    entityFactory,
    deltaTime: null,
  };

  const timer = new Timer(1 / 60);
  timer.update = function update(deltaTime) {
    gameContext.deltaTime = deltaTime;
    level.update(gameContext);

    camera.pos.x = Math.max(0, mario.pos.x - 100);

    level.comp.draw(context, camera);
  };

  timer.start();
}

const canvas = document.getElementById("canvas");

const startGame = () => {
  // Hide the startup screen
  const startupScreen = document.querySelector(".startup-wrapper");
  startupScreen.style.display = "none";
  // Start the game
  main(canvas);
};

const startButton = document.getElementById("startButton");
startButton.addEventListener("click", startGame);

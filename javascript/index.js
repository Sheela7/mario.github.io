import Timer from "./timer.js";
import { loadLevel } from "./loaders.js";
import { createMario } from "./entities.js";
import { setupKeyboard } from "./input.js";
import { createCollisionLayer } from "./layers.js";

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

Promise.all([createMario(), loadLevel("level1")]).then(([mario, level]) => {
  mario.pos.set(64, 64);
  level.comp.layers.push(createCollisionLayer(level));

  level.entities.add(mario);
  const input = setupKeyboard(mario);
  input.listenTo(window);

  ["mousedown", "mousemove"].forEach((eventName) => {
    canvas.addEventListener(eventName, (event) => {
      if (event.buttons === 1) {
        mario.vel.set(0, 0);
        mario.pos.set(event.offsetX, event.offsetY);
      }
    });
  });

  const timer = new Timer(1 / 60);

  timer.update = function update(deltaTime) {
    level.update(deltaTime);
    level.comp.draw(context);
  };
  timer.start();
});

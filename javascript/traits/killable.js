import { Sides, Trait } from "../entity.js";

export default class Killable extends Trait {
  constructor() {
    super("killable");
    this.dead = false;
    this.deadTime = 0;
    this.removeAfter = 2;
  }

  kill() {
    this.queue(() => (this.dead = true));
  }

  revive() {
    console.log("Reviving the player");
    this.dead = false;
    this.deadTime = 0;
  }

  update(entity, { deltaTime }, level) {
    if (this.dead) {
      this.deadTime += deltaTime;
      if (this.deadTime > this.removeAfter) {
        this.queue(() => {
          level.entities.delete(entity);
          const startupScreen = document.querySelector(".startup-wrapper");
          startupScreen.style.display = "flex";
          const restartButton = document.getElementById("startButton");
          restartButton.textContent = "Restart";
        });
      }
    }
  }
}

import Entity from "../entity.js";
import Go from "../traits/go.js";
import Jump from "../traits/jump.js";
import Killable from "../traits/killable.js";
import Physics from "../traits/physics.js";
import Solid from "../traits/solid.js";
import Stomper from "../traits/stomper.js";
import { loadAudioBoard } from "../loaders/audio.js";
import { loadSpriteSheet } from "../loaders/sprite.js";
import PipeTraveller from "../traits/pipeTraveller.js";
import PoleTraveller from "../traits/poleTraveller.js";

const SLOW_DRAG = 1 / 1000;
const FAST_DRAG = 1 / 5000;

export function loadMario(audioContext) {
  return Promise.all([loadSpriteSheet("mario"), loadAudioBoard("mario", audioContext)]).then(
    ([sprite, audio]) => {
      return createMarioFactory(sprite, audio);
    }
  );
}

function createMarioFactory(sprite, audio) {
  const runAnim = sprite.animations.get("run");
  const climbAnim = sprite.animations.get("climb");
  function getHeading(mario) {
    const poleTraveller = mario.poleTraveller;
    if (poleTraveller.distance) {
      return false;
    }
    return mario.go.heading < 0;
  }

  function routeFrame(mario) {
    const pipeTraveller = mario.pipeTraveller;
    if (pipeTraveller.movement.x != 0) {
      return runAnim(pipeTraveller.distance.x * 2);
    }
    if (pipeTraveller.movement.y != 0) {
      return "idle";
    }

    const poleTraveller = mario.poleTraveller;
    if (poleTraveller.distance) {
      return climbAnim(poleTraveller.distance);
    }

    if (mario.jump.falling) {
      return "jump";
    }

    const go = mario.go;
    if (go.distance > 0) {
      if ((mario.vel.x > 0 && go.dir < 0) || (mario.vel.x < 0 && go.dir > 0)) {
        return "break";
      }

      return runAnim(mario.go.distance);
    }

    return "idle";
  }

  function setTurboState(turboOn) {
    this.go.dragFactor = turboOn ? FAST_DRAG : SLOW_DRAG;
  }

  function drawMario(context) {
    // sprite.draw(routeFrame(this), context, 0, 0, this.go.heading < 0);
    sprite.draw(routeFrame(this), context, 0, 0, getHeading(this));
  }

  return function createMario() {
    const mario = new Entity();
    mario.audio = audio;
    mario.size.set(14, 16);

    mario.addTrait(new Physics());
    mario.addTrait(new Solid());
    mario.addTrait(new Go());
    mario.addTrait(new Jump());
    mario.addTrait(new Killable());
    mario.addTrait(new Stomper());
    mario.addTrait(new PipeTraveller());
    mario.addTrait(new PoleTraveller());

    console.log("The pipetraveller is:", mario.pipeTraveller);
    mario.killable.removeAfter = 0;
    mario.jump.velocity = 175;

    mario.turbo = setTurboState;
    mario.draw = drawMario;

    mario.turbo(false);

    return mario;
  };
}

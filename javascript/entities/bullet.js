import Entity, { Sides, Trait } from "../entity.js";
import Killable from "../traits/killable.js";
import Gravity from "../traits/gravity.js";
import Velocity from "../traits/velocity.js";
import { loadSpriteSheet } from "../loaders/sprite.js";

export function loadBullet() {
  return loadSpriteSheet("bullet").then(createBulletFactory);
}

class Behavior extends Trait {
  constructor() {
    super("behavior");
    this.gravity = new Gravity();
  }

  collides(us, them) {
    if (us.killable.dead) {
      return;
    }

    // console.log("Collision in Bullet", them.vel.y);
    if (them.stomper) {
      if (them.vel.y > us.vel.y) {
        us.killable.kill();
        us.vel.set(100, -200);
      } else {
        them.killable.kill();
      }
    }
  }

  update(entity, gameContext, level) {
    if (entity.killable.dead) {
      this.gravity.update(entity, gameContext, level);
    }
  }
}

function createBulletFactory(sprite) {
  function drawBullet(context) {
    sprite.draw("bullet", context, 0, 0, this.vel.x < 0);
  }

  return function createBullet() {
    const bullet = new Entity();
    bullet.size.set(16, 14);

    bullet.addTrait(new Velocity());
    bullet.addTrait(new Behavior());
    bullet.addTrait(new Killable());

    bullet.draw = drawBullet;

    return bullet;
  };
}

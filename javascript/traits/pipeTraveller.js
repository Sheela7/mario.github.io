import { Vec2 } from "../math.js";
import { Trait } from "../entity.js";

export default class PipeTraveller extends Trait {
  constructor() {
    super("pipeTraveller");
    this.direction = new Vec2(0, 0);
    this.movement = new Vec2(0, 0);
    this.distance = new Vec2(0, 0);
    console.log("The directionn is as: ", this.direction);
  }
}

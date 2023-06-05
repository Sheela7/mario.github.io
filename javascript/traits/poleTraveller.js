import { Vec2 } from "../math.js";
import { Trait } from "../entity.js";

export default class PoleTraveller extends Trait {
  constructor() {
    super("poleTraveller");
    this.distance = 0;
  }
}

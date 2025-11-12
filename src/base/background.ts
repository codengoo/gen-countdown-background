import { CanvasRenderingContext2D, Image, loadImage } from "canvas";
import { BaseDraw } from "./base";

export class Background extends BaseDraw {
  public draw(ctx: CanvasRenderingContext2D, backgroundImage: Image): void {
    const width = backgroundImage.width;
    const height = backgroundImage.height;

    ctx.drawImage(backgroundImage, 0, 0, width, height);
    ctx.save();
    console.log("Hele");
  }
}

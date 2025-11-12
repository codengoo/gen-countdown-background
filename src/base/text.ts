import { CanvasRenderingContext2D } from "canvas";
import { BaseDraw } from "./base";

export type Position = {
  x: number;
  y: number;
};

interface ITextOption {
  position: Position;
  color: string;
  fontSize: number;
  fontFamily: string;
  rotate?: number; // in rad
}

export class Text extends BaseDraw {
  constructor(private readonly option: ITextOption) {
    super();
  }

  public draw(ctx: CanvasRenderingContext2D, text: string) {
    // Move to position
    ctx.rotate(this.option.rotate || 0);

    // Apply style
    ctx.font = `bold ${this.option.fontSize}px ${this.option.fontFamily}`;
    ctx.textAlign = "start";
    ctx.textBaseline = "middle";
    ctx.fillStyle = this.option.color;

    // Draw
    ctx.fillText(text, this.option.position.x, this.option.position.y);

    // Save
    ctx.save();
  }
}

import { CanvasRenderingContext2D, CanvasTextAlign, CanvasTextBaseline } from "canvas";

export type Position = {
  x: number;
  y: number;
};

interface ITextOption {
  position: Position;
  color: string;
  fontSize: number;
  fontFamily: string;
  baseline?: CanvasTextBaseline;
  align?: CanvasTextAlign;
  rotate?: number; // in rad
}

export class Text {
  constructor(private readonly option: ITextOption) {}

  public draw(ctx: CanvasRenderingContext2D, text: string) {
    // Move to position
    if (this.option.rotate) {
      ctx.translate(this.option.position.x, this.option.position.y);
      ctx.rotate(this.option.rotate || 0);
    }

    // Apply style
    ctx.font = `bold ${this.option.fontSize}px ${this.option.fontFamily}`;
    ctx.textAlign = this.option.align || "center";
    ctx.textBaseline = this.option.baseline || "middle";
    ctx.fillStyle = this.option.color;

    // Draw
    if (this.option.rotate) {
      ctx.fillText(text, 0, 0);
    } else {
      ctx.fillText(text, this.option.position.x, this.option.position.y);
    }

    // Save
    ctx.save();
  }
}

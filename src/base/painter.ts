import { Canvas, createCanvas } from "canvas";
import { BaseDraw, IBaseOption } from "./base";
import { Text } from "./text";

interface IPainterOption extends IBaseOption {
  width?: number;
  height?: number;
}

export class Painter extends BaseDraw<IPainterOption> {
  private readonly canvas: Canvas;
  constructor(options: IPainterOption) {
    super(options);
    this.canvas = createCanvas(options.width || 100, options.height || 100);
  }

  public drawText(textStyles: Text[], text: string[]) {
    for (let i = 0; i < textStyles.length; i++) {
      const ctx = this.canvas.getContext("2d");
      textStyles[i].draw(ctx, text[i] || "");
    }
  }

  public save(){
    return super.save(this.canvas);
  }
}

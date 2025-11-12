import path from "path";
import fs from "fs";
import { Canvas, createCanvas, loadImage } from "canvas";
import { Text } from "./text";
import { Background } from "./background";

interface IPainterOption {
  outputPath: string;
  inputFolder: string;
}

export class Painter {
  private readonly canvas: Canvas;
  constructor(private readonly options: IPainterOption) {
    this.canvas = createCanvas(2048, 1280);
  }

  private ensurePath(inp: string) {
    const dir = path.dirname(inp);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  public drawText(textStyles: Text[], text: string[]) {
    const ctx = this.canvas.getContext("2d");

    for (let i = 0; i < textStyles.length; i++) {
      textStyles[i].draw(text[i] || "", ctx);
    }
  }

  public async drawBackground(imagePath: string) {
    const backgroundImage = await loadImage(imagePath);
    const background = new Background();
    
    // reset canvas size
    this.canvas.width = backgroundImage.width;
    this.canvas.height = backgroundImage.height;
    
    const ctx = this.canvas.getContext("2d");
    background.draw(ctx, backgroundImage);
  }

  public save(): void {
    this.ensurePath(this.options.outputPath);

    // Lưu file PNG
    const buffer = this.canvas.toBuffer("image/png");
    fs.writeFileSync(this.options.outputPath, buffer);

    console.log(`✅ Đã tạo ảnh: ${this.options.outputPath}`);
  }
}

import { Canvas } from "canvas";
import fs from "fs";
import path from "path";
import { v7 as uuid } from "uuid";

export interface IBaseOption {
  outputFolder: string;
}

export abstract class BaseDraw<T extends IBaseOption> {
  constructor(protected readonly options: T) {}
  protected ensurePath(inp: string) {
    const dir = path.dirname(inp);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  protected save(canvas: Canvas): string {
    const outputPath = path.join(this.options.outputFolder, `${uuid()}.png`);
    this.ensurePath(outputPath);

    // Lưu file PNG
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(outputPath, buffer);

    console.log(`✅ Đã tạo ảnh: ${outputPath}`);
    return path.resolve(outputPath);
  }
}

import { Canvas, createCanvas, loadImage } from "canvas";
import fs from "fs";
import path from "path";
import { BaseDraw, IBaseOption } from "./base";

interface IBackgroundOption extends IBaseOption {
  inputFolder: string;
  countdownPath?: string;
  cleanOutputFolder?: boolean;
}

export class Background extends BaseDraw<IBackgroundOption> {
  constructor(options: IBackgroundOption) {
    super(options);
  }

  private scanImagesInFolder(folderPath: string): string[] {
    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
    });
    return imageFiles;
  }

  private cleanFolder() {
    fs.rmSync(this.options.outputFolder, { recursive: true, force: true });
    fs.mkdirSync(this.options.outputFolder, { recursive: true });
  }

  private async draw(backgroundPath: string): Promise<Canvas> {
    const bgImage = await loadImage(backgroundPath);
    const countdownImage = await loadImage(this.options.countdownPath || "");

    const canvas = createCanvas(bgImage.width, bgImage.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bgImage, 0, 0, bgImage.width, bgImage.height);
    ctx.drawImage(
      countdownImage,
      bgImage.width / 2 - countdownImage.width / 2,
      50,
      countdownImage.width,
      countdownImage.height
    );

    ctx.save();
    return canvas;
  }

  public async createBackground() {
    if (this.options.cleanOutputFolder) this.cleanFolder();
    const files = this.scanImagesInFolder(this.options.inputFolder);
    console.log("Found: ", files);

    const results = [];
    for (const file of files) {
      const filePath = path.join(this.options.inputFolder, file);
      const canvas = await this.draw(filePath);
      const bgPath = this.save(canvas);
      results.push(bgPath);
    }

    return results;
  }
}

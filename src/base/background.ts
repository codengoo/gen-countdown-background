import { Canvas, createCanvas, loadImage } from "canvas";
import fs from "fs";
import path from "path";
import { downloadImage, getImageLink } from "../core";
import { BaseDraw, IBaseOption } from "./base";

interface IBackgroundOption extends IBaseOption {
  inputFolder?: string;
  downloadFolder?: string;
  countdownPath?: string;
  cleanOutputFolder?: boolean;
  useOnlineImage?: boolean;
}

export class Background extends BaseDraw<IBackgroundOption> {
  constructor(options: IBackgroundOption) {
    super(options);
  }

  private scanImagesInFolder(): string[] {
    if (!this.options.inputFolder) throw new Error("Missing input folder");
    const files = fs.readdirSync(this.options.inputFolder);
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
    });
    return imageFiles.map((file) => path.join(this.options.inputFolder || "", file));
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

  private async downloadImage() {
    if (!this.options.downloadFolder) throw new Error("Missing download folder");
    const imageUrl = await getImageLink();
    const filePath = await downloadImage(imageUrl, this.options.downloadFolder);
    return filePath;
  }

  public async createBackground() {
    if (this.options.cleanOutputFolder) this.cleanFolder();

    const files = this.options.useOnlineImage ? [await this.downloadImage()] : this.scanImagesInFolder();
    console.log("Found: ", files);

    const results = [];
    for (const filepath of files) {
      const canvas = await this.draw(filepath);
      const bgPath = this.save(canvas, "image/jpeg");
      results.push(bgPath);
    }

    return results;
  }
}

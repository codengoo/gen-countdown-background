import axios from "axios";
import dotenv from "dotenv";
import { createWriteStream, mkdirSync } from "fs";
import path from "path";
import { v7 as uuid } from "uuid";
dotenv.config();

interface IImageDownloaderOption {
  outputFolder: string;
  maxWidth?: number;
}

export class ImageDownloader {
  constructor(private readonly options: IImageDownloaderOption) {}

  private async getImageLink() {
    const url = `https://api.unsplash.com/photos/random`;
    const access_key = process.env.SPLASH_API_KEY;

    const response = await axios.get(url, {
      params: {
        client_id: access_key,
        orientation: "landscape",
        fit: "crop",
      },
    });

    const imageUrl = response.data.urls.full;
    return imageUrl;
  }

  private async downloadImage(imageUrl: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const outputFolder = this.options.outputFolder;
      mkdirSync(outputFolder, { recursive: true });
      const img = await axios.get(imageUrl, {
        responseType: "stream",
        params: this.options.maxWidth ? { w: this.options.maxWidth } : {},
      });

      const filePath = path.join(outputFolder, `${uuid()}.jpg`);
      const writer = createWriteStream(filePath);
      img.data.pipe(writer);

      writer.on("finish", () => {
        console.log("Đã tải:", filePath);
        resolve(filePath);
      });

      writer.on("error", (err) => {
        console.error("Lỗi:", err);
        reject(err);
      });
    });
  }

  public async get() {
    const imageUrl = await this.getImageLink();
    return this.downloadImage(imageUrl);
  }
}

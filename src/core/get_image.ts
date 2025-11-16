import axios from "axios";
import dotenv from "dotenv";
import { createWriteStream, mkdirSync } from "fs";
import path from "path";
import { v7 as uuid } from "uuid";
import { Rotation } from "./rotation";
dotenv.config();

interface IImageDownloaderOption {
  outputFolder: string;
  keyword?: string;
  maxWidth?: number;
}

export class ImageDownloader {
  private readonly accessKey: Rotation;
  constructor(private readonly options: IImageDownloaderOption) {
    const keys = process.env.SPLASH_API_KEY?.split(",").map((key) => key.trim()) || [];
    this.accessKey = new Rotation(keys);
  }

  private async getImageLink() {
    const url = `https://api.unsplash.com/photos/random`;
    const key = this.accessKey.next();
    console.log(key);
    
    const response = await axios.get(url, {
      params: {
        client_id: key,
        orientation: "landscape",
        ...(this.options.keyword && { query: this.options.keyword }),
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

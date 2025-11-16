import axios from "axios";
import dotenv from "dotenv";
import { createWriteStream, mkdirSync } from "fs";
import path from "path";
import { v7 as uuid } from "uuid";
dotenv.config();

export async function getImageLink() {
  const url = `https://api.unsplash.com/photos/random`;
  const access_key = process.env.SPLASH_API_KEY;

  const response = await axios.get(url, {
    params: {
      client_id: access_key,
      orientation: "landscape",
      fit: "crop",
      w: 2048,
      h: 1280,
    },
  });

  const imageUrl = response.data.urls.full;
  return imageUrl;
}

export async function downloadImage(imageUrl: string, outputFolder: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    mkdirSync(outputFolder, { recursive: true });
    const img = await axios.get(imageUrl, { responseType: "stream" });
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

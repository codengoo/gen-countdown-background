import { createCanvas, loadImage, registerFont } from "canvas";
import fs from "fs";
import path from "path";

interface TextImageOptions {
  mainNumber: string;
  sideText: string;
  bottomText: string;
  backgroundImagePath: string;
  outputPath: string;
}

async function createImageWithTextOverlay(options: TextImageOptions) {
  const { mainNumber, sideText, bottomText, backgroundImagePath, outputPath } =
    options;

  try {
    // Load ảnh nền
    const backgroundImage = await loadImage(backgroundImagePath);
    const width = backgroundImage.width;
    const height = backgroundImage.height;

    // Tạo canvas với kích thước của ảnh nền
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Vẽ ảnh nền trước
    ctx.drawImage(backgroundImage, 0, 0, width, height);

    // Tính toán kích thước text dựa trên kích thước ảnh
    const mainFontSize = Math.floor(height * 0.35); // 35% chiều cao
    const sideFontSize = Math.floor(height * 0.12); // 12% chiều cao
    const bottomFontSize = Math.floor(height * 0.08); // 8% chiều cao

    // Vị trí Y cho phần text (ở giữa bên trên - khoảng 30% từ trên xuống)
    const textCenterY = height * 0.3;

    //  Vẽ số lớn ở giữa "101" với viền inside
    ctx.font = `bold ${mainFontSize}px Audiowide`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Vẽ fill trắng trước (phần bên ngoài)
    ctx.fillStyle = "#ffffff";
    ctx.fillText(mainNumber, width / 2, textCenterY);

    // Vẽ stroke đen bên trong (tạo hiệu ứng outline inside)
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = Math.floor(mainFontSize * 0.02);
    ctx.strokeText(mainNumber, width / 2, textCenterY);

    // Vẽ chữ bên phải "DAYS" - xoay 90 độ
    ctx.save(); // Lưu trạng thái canvas

    const sideTextX = width / 2 + mainFontSize * 0.7;
    const sideTextY = textCenterY;

    // Di chuyển điểm gốc đến vị trí muốn vẽ
    ctx.translate(sideTextX, sideTextY);

    // Xoay 90 độ (PI/2 radians)
    ctx.rotate(Math.PI / 2);

    // Vẽ text (sau khi xoay)
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = `bold ${sideFontSize}px Koulen`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(sideText, 0, 0);

    ctx.restore(); // Khôi phục trạng thái canvas

    // Vẽ chữ ký dưới "Đến Tết Nguyên đán" với font chữ viết tay
    ctx.fillStyle = "#ffffff";
    ctx.font = `italic ${bottomFontSize}px "Fz Fashion Signature", cursive`;
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText(bottomText, width / 2, textCenterY + mainFontSize * 0.6);

    // Reset shadow
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    // Tạo thư mục output nếu chưa tồn tại
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Lưu file PNG
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(outputPath, buffer);

    console.log(`✅ Đã tạo ảnh: ${outputPath}`);
    console.log(`📐 Kích thước: ${width}x${height}px`);
  } catch (error) {
    console.error(`❌ Lỗi khi xử lý ảnh: ${error}`);
  }
}

// Hàm xử lý tất cả ảnh trong thư mục input
async function processAllImagesInFolder() {
  const inputFolder = "./input";
  const outputFolder = "./output";

  // Kiểm tra thư mục input có tồn tại không
  if (!fs.existsSync(inputFolder)) {
    console.log("📁 Tạo thư mục input...");
    fs.mkdirSync(inputFolder, { recursive: true });
    console.log("⚠️  Vui lòng đặt ảnh nền vào thư mục ./input/");
    return;
  }

  // Đọc tất cả file trong thư mục input
  const files = fs.readdirSync(inputFolder);
  const imageFiles = files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
  });

  if (imageFiles.length === 0) {
    console.log("⚠️  Không tìm thấy ảnh nào trong thư mục ./input/");
    console.log("📝 Hỗ trợ: .jpg, .jpeg, .png, .webp");
    return;
  }

  console.log(`🎨 Tìm thấy ${imageFiles.length} ảnh trong thư mục input`);

  // Xử lý từng ảnh
  for (const imageFile of imageFiles) {
    const inputPath = path.join(inputFolder, imageFile);
    const outputFileName = `countdown_${path.parse(imageFile).name}.png`;
    const outputPath = path.join(outputFolder, outputFileName);

    await createImageWithTextOverlay({
      mainNumber: "101",
      sideText: "DAYS",
      bottomText: "Đến Tết Nguyên đán",
      backgroundImagePath: inputPath,
      outputPath: outputPath,
    });
  }

  console.log("✨ Hoàn thành tất cả ảnh!");
}

// Ví dụ sử dụng với 1 ảnh cụ thể
async function createSingleImage() {
  await createImageWithTextOverlay({
    mainNumber: "101",
    sideText: "DAYS",
    bottomText: "Đến Tết Nguyên đán",
    backgroundImagePath: "./input/background.jpg",
    outputPath: "./output/countdown.png",
  });
}

// Chạy xử lý tất cả ảnh trong thư mục
processAllImagesInFolder();

// Hoặc chỉ xử lý 1 ảnh:
// createSingleImage();

// Export functions
export { createImageWithTextOverlay, processAllImagesInFolder };

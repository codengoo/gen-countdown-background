import { execSync } from "child_process";
import { readFile, writeFile } from "fs/promises";
import path from "path";

async function updateXML() {
  try {
    const XML_FILE_PATH = "action.xml";
    const NEW_WORKING_DIRECTORY = __dirname;
    let xmlContent = await readFile(XML_FILE_PATH, "utf-16le");
    const regex = /<WorkingDirectory>.*?<\/WorkingDirectory>/g;
    const newXmlContent = xmlContent.replace(regex, `<WorkingDirectory>${NEW_WORKING_DIRECTORY}</WorkingDirectory>`);

    // Ghi nội dung XML đã sửa đổi vào một file tạm thời
    const tempXmlPath = path.join(__dirname, "action.xml");
    await writeFile(tempXmlPath, newXmlContent, "utf-16le");

    console.log(`✅ Đã thay thế WorkingDirectory thành: ${NEW_WORKING_DIRECTORY}`);
  } catch (error) {
    console.error(`❌ Lỗi khi xử lý file XML: ${(error as Error).message}`);
  }
}

async function updateTaskScheduler() {
  const TASK_NAME = "Set Countdown Background";
  const tempXmlPath = path.join(__dirname, "action.xml");
  const createTaskCmd = `schtasks /Create /XML "${tempXmlPath}" /TN "${TASK_NAME}" /F`;
  execSync(createTaskCmd);
  console.log("✅ Đã tạo task scheduler");
}

async function setup() {
  await updateXML();
  await updateTaskScheduler();
}

setup();

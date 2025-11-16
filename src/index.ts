import { spawn } from "child_process";
import { Background } from "./base/background";
import { Event } from "./base/event";

async function draw2() {
  const event = new Event({ name: "Tết rồi", time: new Date("2026-02-17"), outputPath: "./input/countdown" });
  const countdownPath = event.createCountdown();
  console.log(countdownPath);

  const bg = new Background({
    // inputFolder: "./input/original",
    downloadFolder: "./input/download",
    outputFolder: "./output",
    countdownPath: countdownPath,
    cleanOutputFolder: true,
    useOnlineImage: true,
  });
  const allBgPaths = await bg.createBackground();
  console.log(allBgPaths);

  if (allBgPaths?.length > 0) {
    console.log("Setting background...");
    const bgPath = allBgPaths[Math.floor(Math.random() * allBgPaths.length)];
    console.log(bgPath);
    if (!bgPath) return;

    const child = spawn("./bin/setbg.exe", [bgPath]);

    child.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    child.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    child.on("close", (code) => {
      console.log(`Child process exited with code ${code}`);
    });
  }
}

draw2();

import { Background } from "./base/background";
import { Event } from "./base/event";

async function draw2() {
  const event = new Event({ name: "Tết rồi", time: new Date("2026-02-17"), outputPath: "./input/countdown" });
  const countdownPath = event.createCountdown();
  console.log(countdownPath);

  const bg = new Background({
    inputFolder: "./input/original",
    outputFolder: "./output",
    countdownPath: countdownPath,
  });
  await bg.createBackground();
}

draw2();

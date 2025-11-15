import { execSync } from "child_process";
import path from "path";

function setupSchedule() {
  const taskName = "Set Countdown background";
  const action = `cmd /k "cd ${path.resolve("./")} && start.bat"`;
  const createCmd = `schtasks /Create /SC DAILY /TN "${taskName}" /TR "${action}" /ST 00:00 /RL LIMITED /F`;

  execSync(createCmd);
}

setupSchedule();

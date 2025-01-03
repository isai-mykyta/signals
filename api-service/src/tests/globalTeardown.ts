import { exec } from "child_process";
import fs from "fs";
import path from "path";

export default async function globalTeardown() {
  console.log("[globalTeardown] Tearing down Postgres container...");
  const globalConfigPath = path.resolve(__dirname, "globalConfig.json");

  if (!fs.existsSync(globalConfigPath)) {
    console.log("[globalTeardown] No container config found, skipping teardown.");
    return;
  }

  const { containerId } = JSON.parse(fs.readFileSync(globalConfigPath, "utf8"));

  if (containerId) {
    console.log(`[globalTeardown] Removing container ${containerId}...`);
    exec(`docker rm -f ${containerId}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`[globalTeardown] Error removing container: ${error}`);
      } else {
        console.log(`[globalTeardown] Container removed: ${stdout}`);
      }
    });
  }

  fs.unlinkSync(globalConfigPath);
}

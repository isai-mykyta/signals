import { exec } from "child_process";
import fs from "fs";
import path from "path";

export default async function globalTeardown() {
  console.log("[globalTeardown] Tearing down containers...");
  const globalConfigPath = path.resolve(__dirname, "globalConfig.json");

  if (!fs.existsSync(globalConfigPath)) {
    console.log("[globalTeardown] No container config found, skipping teardown.");
    return;
  }

  const { pgContainerId, rmqContainerId } = JSON.parse(fs.readFileSync(globalConfigPath, "utf8"));

  if (pgContainerId) {
    console.log(`[globalTeardown] Removing Postgress container ${pgContainerId}...`);
    exec(`docker rm -f ${pgContainerId}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`[globalTeardown] Error removing Postgress container: ${error}`);
      } else {
        console.log(`[globalTeardown] Postgress container removed: ${stdout}`);
      }
    });
  }

  if (rmqContainerId) {
    console.log(`[globalTeardown] Removing RabbitMQ container ${rmqContainerId}...`);
    exec(`docker rm -f ${rmqContainerId}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`[globalTeardown] Error removing RabbitMQ container: ${error}`);
      } else {
        console.log(`[globalTeardown] RabbitMQ container removed: ${stdout}`);
      }
    });
  }

  fs.unlinkSync(globalConfigPath);
}

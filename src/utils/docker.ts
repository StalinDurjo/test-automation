import { execSync } from "child_process";

export const isDockerRunning = () => {
  try {
    execSync("docker ps", { encoding: "utf-8" });
    return true;
  } catch (error) {
    return false;
  }
};

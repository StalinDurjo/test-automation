import { exec, execSync } from "child_process";

export const executeCommand = async (command: string, directory: string) => {
  try {
    const { stdout, stderr } = exec(command, { cwd: directory });
    return JSON.stringify({ stdout, stderr });
  } catch (error) {
    console.log(`Failed to execute command: ${command}`);
    console.log(error);
  }
};

export const executeCommandSync = (command: string) => {
  try {
    const terminalCode = execSync(command, { encoding: "utf-8" });
    return terminalCode;
  } catch (error) {
    console.log(error);
  }
};

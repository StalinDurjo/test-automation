import cliSpinners from "cli-spinners";

export function waitUntil(condition: () => boolean, timeout = 20): Promise<boolean> {
  const startTime = Date.now();

  return new Promise<boolean>((resolve, reject) => {
    const intervalId = setInterval(() => {
      if (condition()) {
        clearInterval(intervalId);
        resolve(true);
      } else if (Date.now() - startTime > timeout * 1000) {
        clearInterval(intervalId);
        reject(new Error("Condition not met within timeout"));
      } else {
        console.log(`Waiting... (${Math.floor((Date.now() - startTime) / 1000)} seconds)`);
      }
    }, 1000);
  });
}

export function wait(timeout: number) {
  const startTime = Date.now();

  return new Promise<boolean>((resolve, reject) => {
    const intervalId = setInterval(() => {
      if (Date.now() - startTime > timeout * 1000) {
        clearInterval(intervalId);
        resolve(true);
      } else {
        console.log(`Waiting... (${Math.floor((Date.now() - startTime) / 1000)} seconds)`);
        // console.log(cliSpinners.dots);
      }
    }, 1000);
  });
}

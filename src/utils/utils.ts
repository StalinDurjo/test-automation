import detect from "detect-port";

export const isPortTaken = async (port: number) => {
  return detect(port)
    .then((_port) => {
      if (port === _port) {
        return false;
      } else {
        return true;
      }
    })
    .catch((error: any) => {
      console.log(error);
    });
};

export const generateAvailblePortNumber = async () => {
  return await detect();
};

export const countOccurances = (list: any, content: string) => {
  let count = 0;

  for (const item of list) {
    if (item.includes(content)) {
      count++;
    }
  }
  return count;
};

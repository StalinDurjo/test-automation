import { onFrameworkStart } from "@src/lifecycle/onFrameworkStart.js";
import { IEvent } from "@src/types/global.js";

export const registry = (event: IEvent) => {
  event.register("onFrameworkStart", onFrameworkStart);
};

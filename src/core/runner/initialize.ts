import event from "../events/Events.js";

export const initialize = () => {
  event.publish("onFrameworkStart", {});
};

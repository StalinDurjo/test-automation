import { _createDockerWordpressResources } from "@src/services/_virtual_env/createResource.js";
import { checkDockerWordpressTestReadiness, startDockerEnvironment } from "@src/services/_virtual_env/_dockerEnv.js";
import testConfig from "@testConfig/*";

export const initialize = () => {
  _createDockerWordpressResources();
  startDockerEnvironment()
    .then((networks) => {
      // console.log(networks);
      console.log("Docker environment started.");
      checkDockerWordpressTestReadiness(networks).then((state) => {
        if (testConfig.debugger.isEnabled && testConfig.debugger.allowDockerEnvCreation === false) state = true;

        if (state === true) {
          console.log("Docker environment is ready to test.");
          console.log(state);
        }
      });
    })
    .catch((error) => {
      console.log("Failed to start docker environment.");
    });
};

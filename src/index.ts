import { initialize } from "./core/runner/initialize.js";
import { dockerActiveContainerList, getDockerContainersByNetwork, isDockerWordpressProjectReady, startDockerEnvironment } from "./services/virtual_env/dockerEnv.js";
// initialize();

// startDockerEnvironment();

// (async () => {
//   console.log(await isDockerWordpressProjectReady());
// })();

import Dockerode from "dockerode";

// Create a new Docker instance

// getDockerContainersByNetwork("wp_1_wordpress-network").then((data) => {
//   console.log(data);
// });

dockerActiveContainerList()
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  });

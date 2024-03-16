import Dockerode from "dockerode";
import DockerodeCompose from "dockerode-compose";
import { getAllDockerWordpressProjects } from "@src/core/database.js";
import testConfig from "@testConfig/*";

export const startDockerEnvironment = async () => {
  const activeDockerNetworkList = [];

  try {
    const environmentConfigList = getAllDockerWordpressProjects();

    if (testConfig.debugger.isEnabled && testConfig.debugger.allowDockerEnvCreation === false) return [];

    for (const envConfig of environmentConfigList) {
      const docker = new Dockerode();
      const dockercompose = new DockerodeCompose(docker, `${envConfig.projectDirectory}/docker-compose.yml`, `${envConfig.projectName}`);
      await dockercompose.pull();
      await dockercompose.down();
      const upstate = await dockercompose.up();
      activeDockerNetworkList.push(upstate.networks[0].name);
    }

    return activeDockerNetworkList;
  } catch (error) {
    console.log("Failed to start docker environment.");
    console.log(error);
  }

  return activeDockerNetworkList;
};

// Get a list of all running containers
const dockerActiveContainerList = () => {
  const docker = new Dockerode();
  const containerList = [];
  return new Promise((resolve, reject) => {
    docker.listContainers({ all: true }, (err, containers) => {
      if (err) {
        reject(err);
      } else {
        for (const containerInfo of containers) {
          containerList.push({
            Names: containerInfo.Names,
            Image: containerInfo.Image,
            State: containerInfo.State,
            Status: containerInfo.Status,
            Networks: [...Object.keys(containerInfo.NetworkSettings.Networks)]
          });
        }
        resolve(containerList);
      }
    });
  });
};

const getDockerContainersByNetwork = async (networkName: string) => {
  const containerList = [];
  const allContainerList: any = await dockerActiveContainerList();

  for (const container of allContainerList) {
    if (container.Networks.includes(networkName)) {
      containerList.push(container);
    }
  }
  return containerList;
};

export const checkDockerWordpressTestReadiness = async (networks: string[]) => {
  try {
    let isTestReady = true;
    const configuredContainerCount = getAllDockerWordpressProjects().length;

    if (networks.length === 0) isTestReady = false;

    for (const network of networks) {
      const containers = await getDockerContainersByNetwork(network);

      if (containers.length === configuredContainerCount) {
        // checks if wordpress container and database container is present
        const containerNames = containers.map((info) => info.Names[0]);
        const wordpressContainerIsPresent = containerNames.some((name) => name.includes("wordpress"));
        const databaseContainerIsPresent = containerNames.some((name) => name.includes("database"));

        if (!wordpressContainerIsPresent && !databaseContainerIsPresent) {
          isTestReady = false;
        }

        // checks if wordpress state and database state is 'running'
        const containerStates = containers.map((info) => info.State);
        containerStates.forEach((state) => {
          if (state !== "running") {
            isTestReady = false;
          }
        });
      } else {
        isTestReady = false;
      }
    }

    return isTestReady;
  } catch (error) {
    console.log(error);
    return false;
  }
};

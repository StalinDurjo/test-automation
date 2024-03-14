// start docker
// stop docker
// check if docker is active
// all required virtual projects active?

import Dockerode from "dockerode";
import DockerodeCompose from "dockerode-compose";

import { getAllDockerWordpressProjects } from "@src/core/database.js";
import { v2 as compose } from "docker-compose";

export const startDockerEnvironment = async () => {
  const environmentConfigList = getAllDockerWordpressProjects();
  const activeDockerNetworkList = [];

  for (const envConfig of environmentConfigList) {
    const docker = new Dockerode();
    const dockercompose = new DockerodeCompose(docker, `${envConfig.projectDirectory}/docker-compose.yml`, `${envConfig.projectName}`);
    await dockercompose.pull();
    const downstate = await dockercompose.down();
    const upstate = await dockercompose.up();
    // console.log(downstate);
    // console.log(upstate);
    activeDockerNetworkList.push(upstate.networks[0].name);
  }

  console.log(activeDockerNetworkList);
};
function getKeys(obj) {
  let keys = [];
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      keys.push(key);
    }
  }
  return keys;
}
// Get a list of all running containers
export const dockerActiveContainerList = () => {
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

export const getDockerContainersByNetwork = async (networkName: string) => {
  const containerList = [];
  const allContainerList: any = await dockerActiveContainerList();

  for (const container of allContainerList) {
    if (container.Networks[networkName]) {
      containerList.push(container);
    }
  }

  return containerList;
};

// REMOVE
export const isDockerWordpressProjectReady = async () => {
  const environmentConfigList = getAllDockerWordpressProjects();
  const configuredContainerCount = 2;
  let dockerIsReady = true;

  for (const envConfig of environmentConfigList) {
    const result = await compose.ps({ cwd: envConfig.projectDirectory });
    const containerNames = result.data.services.map((details: { name: any }) => {
      return details.name;
    });

    console.log(result);

    if (containerNames.length === configuredContainerCount) {
      const projectNamePrefix = envConfig.projectName;

      const wordpressContainer = containerNames.filter((container: string | string[]) => container.includes(projectNamePrefix + "-wordpress"));
      const mysqlContainer = containerNames.filter((container: string | string[]) => container.includes(projectNamePrefix + "-database"));

      // const phpMyAdminContainer = containerNames.filter((container: string | string[]) => container.includes(projectNamePrefix + "-phpmyadmin"));

      // if (wordpressContainer.length === 0 && mysqlContainer.length === 0 && phpMyAdminContainer.length === 0) {
      //   dockerIsReady = false;
      // }

      if (wordpressContainer.length === 0 && mysqlContainer.length === 0) {
        dockerIsReady = false;
      }
    } else {
      dockerIsReady = false;
    }
  }

  return dockerIsReady;
};

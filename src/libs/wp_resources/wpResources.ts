import { DockerWordpressProjectTable, getAllDockerWordpressProjects } from "@src/core/database.js";
import { WP_DIR } from "@src/helper/directory.js";
import { createDirectorySync, createFileSync, isDirectoryPresentSync, isFilePresentSync, writeToFileSync } from "@src/utils/file.js";
import { dockerComposeTemplate } from "./dockerComposeTemplate.js";

// Create 'wp' directory
export const createWpDirectory = () => {
  if (!isDirectoryPresentSync(WP_DIR)) {
    const isDirectoryCreated = createDirectorySync(WP_DIR);
    if (isDirectoryCreated) {
      console.log(`'wp' directory created at: ${WP_DIR}`);
    } else {
      console.log(`Failed to create 'wp' directory at: ${WP_DIR}`);
    }
  } else {
    console.log(`'wp' directory already exists at: ${WP_DIR}`);
  }
};

// create wordpress project directories present in database configuration
export const createWordpressProjectDirectory = (environmentConfigList: DockerWordpressProjectTable[]) => {
  if (isDirectoryPresentSync(WP_DIR)) {
    for (const envConfig of environmentConfigList) {
      if (!isDirectoryPresentSync(envConfig.projectDirectory)) {
        createDirectorySync(envConfig.projectDirectory);
        console.log(`Directory Created: ${envConfig.projectDirectory}`);
      }

      if (isDirectoryPresentSync(envConfig.projectDirectory)) {
        console.log(`Directory already exists at: ${envConfig.projectDirectory}`);
      }
    }
  } else {
    console.log(`'wp' directory must be created before creating wordpress environment setup directories.`);
  }
};

// create docker compose files in each wordpress project directory
export const createDockerComposeFiles = (environmentConfigList: DockerWordpressProjectTable[]) => {
  for (const envConfig of environmentConfigList) {
    if (isDirectoryPresentSync(envConfig.projectDirectory)) {
      const fileName = "docker-compose.yml";
      const fullFilePath = `${envConfig.projectDirectory}/${fileName}`;

      if (!isFilePresentSync(fullFilePath)) {
        createFileSync(fileName, envConfig.projectDirectory);
        writeToFileSync(
          fullFilePath,
          dockerComposeTemplate({
            wordpressVersion: envConfig.wordpressVersion,
            mysqlVersion: envConfig.mysqlVersion,
            wordpressPort: envConfig.wordpressPort,
            databasePort: envConfig.mysqlPort,
            mysqlDatabase: "wordpress",
            mysqlUser: "wp_user",
            mysqlPassword: "wp_password",
            mysqlRootPassword: "MYSQL_ROOT_PASSWORD"
          })
        );

        console.log(`Docker compose file created at: ${fullFilePath}`);
      }
    } else {
      console.log(`Failed to create docker compose file. Could not locate project directory: "${envConfig.projectDirectory}"`);
    }
  }
};

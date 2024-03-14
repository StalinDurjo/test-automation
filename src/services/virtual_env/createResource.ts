import { getAllDockerWordpressProjects } from "@src/core/database.js";
import { WP_DIR } from "@src/helper/directory.js";
import { createDirectorySync, createFileSync, deleteFileSync, isDirectoryPresentSync, isFilePresentSync, overwriteFileContentSync, writeToFileSync } from "@src/libs/file.js";
import { addDockerWordpressProjectsToDatabase } from "./processConfig.js";
import { dockerComposeContent, dockerComposeTemplate } from "./dockerComposeTemplate.js";

export const createDockerWordpressResources = () => {
  addDockerWordpressProjectsToDatabase();
  createWpDirectory();
  createWordpressProjectDirectory();
  createDockerComposeFiles();
  createWordpressProjectEnvFiles();
  createDockerExecutableShellScripts();
};

// create wp directory if not created
const createWpDirectory = () => {
  if (!isDirectoryPresentSync(WP_DIR)) {
    const isDirectoryCreated = createDirectorySync(WP_DIR);
    if (isDirectoryCreated) {
      console.log(`Directory Created: ${WP_DIR}`);
    }
  }
};

const createWordpressProjectDirectory = () => {
  if (isDirectoryPresentSync(WP_DIR)) {
    const environmentConfigList = getAllDockerWordpressProjects();

    for (const envConfig of environmentConfigList) {
      if (!isDirectoryPresentSync(envConfig.projectDirectory)) {
        createDirectorySync(envConfig.projectDirectory);
        console.log(`Directory Created: ${envConfig.projectDirectory}`);
      }
    }
  } else {
    throw new Error(`'wp' directory must be created before creating wordpress environment setup directories.`);
  }
};

const createDockerComposeFiles_deprecated = () => {
  const environmentConfigList = getAllDockerWordpressProjects();

  for (const envConfig of environmentConfigList) {
    if (isDirectoryPresentSync(envConfig.projectDirectory)) {
      const fileName = "docker-compose.yml";
      const fullFilePath = `${envConfig.projectDirectory}/${fileName}`;

      if (!isFilePresentSync(fullFilePath)) {
        createFileSync(fileName, envConfig.projectDirectory);
        overwriteFileContentSync(fullFilePath, "");
        writeToFileSync(fullFilePath, dockerComposeContent());
      }
    } else {
      console.log(`Failed to create docker compose file. Could not locate project directory: "${envConfig.projectDirectory}"`);
    }
  }
};

const createDockerComposeFiles = () => {
  const environmentConfigList = getAllDockerWordpressProjects();

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
      }
    } else {
      console.log(`Failed to create docker compose file. Could not locate project directory: "${envConfig.projectDirectory}"`);
    }
  }
};

const createWordpressProjectEnvFiles = () => {
  const environmentConfigList = getAllDockerWordpressProjects();

  for (const envConfig of environmentConfigList) {
    if (isDirectoryPresentSync(envConfig.projectDirectory)) {
      const fileName = ".env";
      const fullFilePath = `${envConfig.projectDirectory}/${fileName}`;

      if (!isFilePresentSync(fullFilePath)) {
        createFileSync(fileName, envConfig.projectDirectory);
        overwriteFileContentSync(fullFilePath, "");
        writeToFileSync(fullFilePath, `WORDPRESS_VERSION=${envConfig.wordpressVersion}\n`);
        writeToFileSync(fullFilePath, `MYSQL_VERSION=${envConfig.mysqlVersion}\n`);
        writeToFileSync(fullFilePath, `DB_PORT=${envConfig.mysqlPort}\n`);
        writeToFileSync(fullFilePath, `PHPMYADMIN_PORT=8686\n`);
        writeToFileSync(fullFilePath, `WORDPRESS_PORT=${envConfig.wordpressPort}\n`);

        writeToFileSync(fullFilePath, `MYSQL_DATABASE=wordpress\n`);
        writeToFileSync(fullFilePath, `MYSQL_USER=wp_user\n`);
        writeToFileSync(fullFilePath, `MYSQL_PASSWORD=wp_password\n`);
        writeToFileSync(fullFilePath, `MYSQL_ROOT_PASSWORD=MYSQL_ROOT_PASSWORD\n`);
      }
    } else {
      console.log(`Failed to create docker compose file. Could not locate project directory: "${envConfig.projectDirectory}"`);
    }
  }
};

const deleteWordpressProjectEnvFiles = () => {
  const environmentConfigList = getAllDockerWordpressProjects();

  for (const envConfig of environmentConfigList) {
    if (isDirectoryPresentSync(envConfig.projectDirectory)) {
      const fileName = ".env";
      const fullFilePath = `${envConfig.projectDirectory}/${fileName}`;

      if (isFilePresentSync(fullFilePath)) {
        deleteFileSync(fullFilePath);
      }
    }
  }
};

const createDockerExecutableShellScripts = () => {
  const environmentConfigList = getAllDockerWordpressProjects();

  for (const envConfig of environmentConfigList) {
    if (isDirectoryPresentSync(envConfig.projectDirectory)) {
      const startFileName = `${envConfig.projectName}_start.sh`;
      const stopFileName = `${envConfig.projectName}_stop.sh`;

      const startFile = `${envConfig.projectDirectory}/${startFileName}`;
      const stopFile = `${envConfig.projectDirectory}/${stopFileName}`;

      // create docker start shell script
      if (!isFilePresentSync(startFile)) {
        createFileSync(startFileName, envConfig.projectDirectory);
        overwriteFileContentSync(startFile, "");
        writeToFileSync(startFile, `cd ./\n`);
        writeToFileSync(startFile, `docker-compose up`);
      }

      // create docker stop shell script
      if (!isFilePresentSync(stopFile)) {
        createFileSync(stopFileName, envConfig.projectDirectory);
        overwriteFileContentSync(stopFile, "");
        writeToFileSync(stopFile, `cd ./`);
        writeToFileSync(stopFile, `docker-compose up`);
      }
    } else {
      console.log(`Failed to create docker compose file. Could not locate project directory: "${envConfig.projectDirectory}"`);
    }
  }
};

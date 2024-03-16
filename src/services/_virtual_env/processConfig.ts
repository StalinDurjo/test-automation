import { addDockerWordpressProject, getAllDockerWordpressProjects } from "@src/core/database.js";
import { WP_DIR } from "@src/helper/directory.js";
import testConfig from "@testConfig/*";

// adds project configuration to database if not already added
export const addDockerWordpressProjectsToDatabase = () => {
  const dockerWordpressProjectNames = getAllDockerWordpressProjects().map((projectConfig) => projectConfig.projectName);

  for (const projectConfig of testConfig.virtualTestEnvironments.dockerWordpressProjects) {
    if (!dockerWordpressProjectNames.includes(projectConfig.projectName)) {
      const _projectDirectory = `${WP_DIR}/${projectConfig.projectName}`;
      const _baseUrl = `http://localhost:${projectConfig.wordpressPort}`;

      addDockerWordpressProject({
        projectName: projectConfig.projectName,
        wordpressVersion: projectConfig.wordpressVersion,
        mysqlVersion: projectConfig.mysqlVersion,
        wordpressPort: projectConfig.wordpressPort,
        mysqlPort: projectConfig.mysqlPort,
        plugins: projectConfig.plugins,
        themes: projectConfig.themes,
        projectDirectory: _projectDirectory,
        baseUrl: _baseUrl
      });
    }
  }
};

// TODO
export const adjustPortIfTaken = () => {};

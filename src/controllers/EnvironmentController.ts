import { DockerWordpressProjectTable, addDockerWordpressProject, getAllDockerWordpressProjects } from "@src/core/database.js";
import { TestConfiguration } from "@src/core/defineConfig.js";
import { WP_DIR } from "@src/helper/directory.js";
import { checkDockerWordpressTestReadiness, startDockerEnvironment } from "@src/libs/docker_env/dockerEnv.js";
import { createDockerComposeFiles, createWordpressProjectDirectory, createWpDirectory } from "@src/libs/wp_resources/wpResources.js";
import testConfig from "@testConfig/*";

class EnvironmentController {
  private testConfig: TestConfiguration;

  constructor() {
    this.testConfig = testConfig;
  }

  // adds project configuration to database if not already added
  addProjectsToDatabase() {
    try {
      const dockerWordpressProjectNames = getAllDockerWordpressProjects().map((projectConfig) => projectConfig.projectName);

      for (const projectConfig of this.testConfig.virtualTestEnvironments.dockerWordpressProjects) {
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
    } catch (error) {
      throw new Error(`Failed to add projects to database.`);
    }
  }

  // create docker resources for virtual wordpress environment
  createResources() {
    const environmentConfigList = getAllDockerWordpressProjects();

    try {
      createWpDirectory();
      createWordpressProjectDirectory(environmentConfigList);
      createDockerComposeFiles(environmentConfigList);
    } catch (error) {
      throw new Error(`Failed to create docker wordpress resources`);
    }
  }

  startDocker(callback) {
    const environmentConfigList = getAllDockerWordpressProjects();

    try {
      startDockerEnvironment(environmentConfigList, this.testConfig).then((networks) => {
        console.log("Docker environment started.");
        checkDockerWordpressTestReadiness(networks, environmentConfigList.length).then((state) => {
          if (this.testConfig.debugger.isEnabled && this.testConfig.debugger.allowDockerEnvCreation === false) state = true;

          if (state === true) {
            console.log("Docker environment is ready to test.");
            callback(state);
          }
        });
      });
    } catch (error) {
      console.log("Failed to start docker wordpress environment(s)");
      console.log(error);
    }
  }
}

const environmentController = new EnvironmentController();

export default environmentController;

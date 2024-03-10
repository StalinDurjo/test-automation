import { wait } from "@src/libs/wait.js";
import {
  createDockerComposeFiles,
  createDockerExecutableShellScripts,
  createWordpressProjectDirectory,
  createWordpressProjectEnvFiles,
  createWpDirectory,
  deleteWordpressProjectEnvFiles
} from "@src/services/virtual_env/createResource.js";
import { addDockerWordpressProjectsToDatabase } from "@src/services/virtual_env/processConfig.js";
import { EventStream } from "@src/types/global.js";
import testConfig from "@testConfig/*";

export const onFrameworkStart = (stream: EventStream) => {
  wait(5);
  // add docker wordpress project configuration to database
  addDockerWordpressProjectsToDatabase();
  createWpDirectory();
  createWordpressProjectDirectory();
  createDockerComposeFiles();
  createWordpressProjectEnvFiles();
  // deleteWordpressProjectEnvFiles();
  createDockerExecutableShellScripts();
};

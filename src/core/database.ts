import path from "path";
import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";

export type Database = {
  configuration: ConfigurationTable;
  virtualProjects: {
    dockerWordpressProjects: DockerWordpressProjectTable[];
  };
};

export type ConfigurationTable = {
  currentTestType: string;
};

export type DockerWordpressProjectTable = {
  projectName?: string;
  wordpressVersion?: string;
  mysqlVersion?: string;
  wordpressPort?: number;
  mysqlPort?: number;
  plugins?: string[];
  themes?: string[];
  projectDirectory?: string;
  baseUrl?: string;
};

const defaultData: Database = {
  configuration: {
    currentTestType: ""
  },
  virtualProjects: {
    dockerWordpressProjects: []
  }
};

const databaseFilePath = path.join(path.resolve(process.cwd()), "./out/database.json");

const connect = () => {
  return new LowSync<Database>(new JSONFileSync(databaseFilePath), defaultData);
};

export const getAllConfigurations = () => {
  const db = connect();
  db.read();
  return db.data.configuration;
};

export const getAllDockerWordpressProjects = () => {
  let db: LowSync<Database>;
  db = connect();
  db.read();
  return db.data.virtualProjects.dockerWordpressProjects;
};

export const addDockerWordpressProject = ({
  projectName,
  wordpressVersion,
  mysqlVersion,
  wordpressPort,
  mysqlPort,
  plugins,
  themes,
  projectDirectory,
  baseUrl
}: DockerWordpressProjectTable) => {
  const db = connect();
  db.read();
  db.data.virtualProjects.dockerWordpressProjects.push({
    projectName,
    wordpressVersion,
    mysqlVersion,
    wordpressPort,
    mysqlPort,
    plugins,
    themes,
    projectDirectory,
    baseUrl
  });
  db.write();
};

export const updateDockerWordpressProject = (
  _projectName: string,
  { wordpressVersion, mysqlVersion, wordpressPort, mysqlPort, plugins, themes, projectDirectory, baseUrl }: DockerWordpressProjectTable
) => {
  const db = connect();
  db.read();
  db.update((data) => {
    for (const projectConfig of data.virtualProjects.dockerWordpressProjects) {
      if (_projectName === projectConfig.projectName) {
        if (wordpressVersion) projectConfig.wordpressVersion = wordpressVersion;
        if (mysqlVersion) projectConfig.mysqlVersion = mysqlVersion;
        if (wordpressPort) projectConfig.wordpressPort = wordpressPort;
        if (mysqlPort) projectConfig.mysqlPort = mysqlPort;
        if (themes) projectConfig.themes = themes;
        if (plugins) projectConfig.plugins = plugins;
        if (projectDirectory) projectConfig.projectDirectory = projectDirectory;
        if (baseUrl) projectConfig.baseUrl = baseUrl;
      }
    }
  });

  db.write();
};

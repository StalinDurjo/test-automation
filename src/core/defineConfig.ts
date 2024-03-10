export interface TestConfiguration {
  testType: string[];
  headless: boolean;
  e2e: {};
  api: {};
  virtualTestEnvironments: VirtualTestEnvironments;
}

export interface VirtualTestEnvironments {
  dockerWordpressProjects: DockerWordpressProject[];
}

export interface DockerWordpressProject {
  projectName: string;
  wordpressVersion: string;
  mysqlVersion: string;
  wordpressPort: number;
  mysqlPort: number;
  plugins: string[];
  themes: string[];
}

export const defineConfig = (testConfiguration: TestConfiguration) => {
  for (const projectConfig of testConfiguration.virtualTestEnvironments.dockerWordpressProjects) {
    projectConfig.projectName = formattedProjectname(projectConfig.projectName);
  }
  return testConfiguration;
};

const formattedProjectname = (projectName: string) => {
  projectName = projectName
    .trim()
    .replace(/[^\w\s]+/g, "_") // Replace special characters with underscore
    .replace(/\s+/g, "_") // Replace multiple spaces with underscore
    .replace(/_+/g, "_"); // Replace multiple underscores with one underscore
  return projectName;
};

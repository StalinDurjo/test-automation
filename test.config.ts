import { defineConfig } from "@src/core/defineConfig.js";

export default defineConfig({
  testType: ["e2e", "api"],
  headless: false,
  e2e: {},
  api: {},
  virtualTestEnvironments: {
    dockerWordpressProjects: [
      {
        projectName: "wp-1",
        wordpressVersion: "",
        mysqlVersion: "",
        wordpressPort: 8081,
        mysqlPort: 3607,
        plugins: [],
        themes: []
      },
      {
        projectName: "wp-2",
        wordpressVersion: "",
        mysqlVersion: "",
        wordpressPort: 8081,
        mysqlPort: 3607,
        plugins: [],
        themes: []
      }
    ]
  }
});

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
        wordpressVersion: "6.2.2-apache",
        mysqlVersion: "8.1",
        wordpressPort: 8084,
        mysqlPort: 3308,
        plugins: [],
        themes: []
      },
      {
        projectName: "wp-2",
        wordpressVersion: "6.2.2-apache",
        mysqlVersion: "8.1",
        wordpressPort: 8085,
        mysqlPort: 3309,
        plugins: [],
        themes: []
      }
    ]
  }
});

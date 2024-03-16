import environmentController from "./controllers/EnvironmentController.js";
import testController from "./controllers/TestController.js";

environmentController.addProjectsToDatabase();
environmentController.createResources();
environmentController.startDocker((status) => {
  if (status === true) {
    testController.start();
  }
});

import testConfig from "@testConfig/*";

class TestController {
  private testConfig = testConfig;

  constructor() {
    this.testConfig = testConfig;
  }

  start() {
    for (const testType of testConfig.testType) {
      console.log(testType);
    }
  }
}

const testController = new TestController();

export default testController;

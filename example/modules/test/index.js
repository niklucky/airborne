const TestController = require('./controllers/test.controller');
const IndexController = require('./controllers/index.controller');

class Test {
  constructor () {
    this.controllers = {
      TestController,
      IndexController
    }
  }

}

module.exports = Test;

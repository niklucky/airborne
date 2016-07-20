var TestController = require('./controllers/test.controller');

class Auth {
  constructor() {
    this.controllers = {
      TestController
    }
  }

}

module.exports = Auth;

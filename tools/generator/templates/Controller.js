const {BaseController} = require('airborne');%SERVICE_REQUIRE%

class %CONTROLLER%Controller extends BaseController {
  constructor(di) {
    super(di);%SERVICE_INIT%
    this.rules = {}
  }
}

module.exports = %CONTROLLER%Controller;

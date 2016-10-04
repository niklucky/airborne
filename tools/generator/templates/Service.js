const {BaseService} = require('airborne');%MAPPER_REQUIRE%

class %SERVICE%Service extends BaseService {
  constructor(di) {
    super(di);%MAPPER_INIT%
  }
}

module.exports = %SERVICE%Service;

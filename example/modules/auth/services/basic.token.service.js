const BasicTokenMapper = require('./../mappers/basic.token.mapper');
const {BaseService} = require('airborne-engine');

class BasicTokenService extends BaseService {
  constructor(di) {
    super(di);
    this.mapper = new BasicTokenMapper(di);
  }
}

module.exports = BasicTokenService;

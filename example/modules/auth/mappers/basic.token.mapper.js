const {HTTPMapper} = require('airborne-engine');
const BasicToken = require('./../models/basic.token');

class BasicTokenMapper extends HTTPMapper {
  constructor(di) {
    super(di);
    this.host = di.get('config').http.TOKEN_BASIC.host;
    this.port = di.get('config').http.TOKEN_BASIC.port;
    this.path = di.get('config').http.TOKEN_BASIC.path;
    this.Model = BasicToken;
  }
}

module.exports = BasicTokenMapper;

const { BaseService } = require('airborne-base');
const UsersMapper = require('../mappers/users.mapper.js');

class UsersService extends BaseService {
  constructor(di) {
    super(di);
    this.mapper = new UsersMapper(di);
  }
}

module.exports = UsersService;

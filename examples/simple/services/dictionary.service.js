const { BaseService } = require('../../../dist');
const UsersMapper = require('../mappers/dictionary.mapper.js');

class UsersService extends BaseService {
  constructor(di) {
    super(di);
    this.mapper = new UsersMapper(di);
  }
}

module.exports = UsersService;

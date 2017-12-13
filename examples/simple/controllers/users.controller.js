const { BaseController } = require('airborne-base');
const UsersService = require('../services/users.service');

class UsersController extends BaseController {
  constructor(di) {
    super(di);
    this.service = new UsersService(di);
    this.rules = {
      create: {
        userId: { type: 'number' },
        eMail: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        age: { type: 'number' }
      },
      load: {
        userId: { type: 'number' },
        age: { type: 'number' },
        firstName: { type: 'string' },
        lastName: { type: 'string' }
      }
    };
  }
  load(params) {
    if (Object.keys(params).length > 0) {
      return this.service.get(params);
    }
    return this.service.load();
  }
}

module.exports = UsersController;

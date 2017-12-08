const { BaseController } = require('../../../dist');
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
      get: {
        userId: { type: 'number' },
        eMail: { type: 'string' }
      },
      load: {
        userId: { type: 'number' },
        age: { type: 'number' },
        firstName: { type: 'string' },
        lastName: { type: 'string' }
      }
    };
  }
}

module.exports = UsersController;
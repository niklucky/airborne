const { BaseController } = require('../../../dist');
const DictionaryService = require('../services/dictionary.service.js');

class UsersController extends BaseController {
  constructor(di) {
    super(di);
    this.service = new DictionaryService(di);
    this.rules = {
      load: {
        id: { type: 'number' },
        orderBy: { type: 'string' }
      },
      create: {
        title: { type: 'string', required: true }
      }
    };
  }
}

module.exports = UsersController;

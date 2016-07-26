const {BaseController} = require('./../../index.js');
const TestMysqlService = require('./../services/test-mysql.service.js');

class TestMysqlController extends BaseController {
  constructor(di) {
    super(di);
    this.service = new TestMysqlService(di);

    this.rules = {
      update: {
        username: {
          type: 'string',
          required: true
        },
        password: {
          type: 'string',
          required: true
        }
      },
      create: {
        id: {
          type: 'number',
          required: true
        },
        username: {
          type: 'string',
          required: true
        },
        password: {
          type: 'string',
          required: true
        }
      },
      load: {
      }
    }
  }
}

module.exports = TestMysqlController;

const {BaseService} = require('./../../index');
const TestMysqlMapper = require('./../mappers/test-mysql.mapper');

class TestMysqlService extends BaseService {
  constructor(di) {
    super(di);
    this.mapper = new TestMysqlMapper(di);
  }
}

module.exports = TestMysqlService;

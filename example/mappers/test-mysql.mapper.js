const {MySQLMapper} = require('./../../index');
const TestMysql = require('./../models/test-mysql');

class TestMysqlMapper extends MySQLMapper {
  constructor(di) {
    super(di);
    this.dbTable = di.get('config').mysql.TABLE_TEST;
    this.db = this.di.get('db').connections.mysql;
    this.Model = TestMysql;
  }
}

module.exports = TestMysqlMapper;

const { MySQLMapper } = require('airborne-base');
const Users = require('../models/user.js');

class UsersMapper extends MySQLMapper {
  constructor(di) {
    super(di);
    this.dbTable = di.get('config').sources.users;
    this.db = this.di.get('db').connections.mysql;
    this.Model = Users;
  }
}

module.exports = UsersMapper;

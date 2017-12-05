const { MySQLMapper } = require('airborne-base');
const Categories = require('../models/dictionary.js');

class UsersMapper extends MySQLMapper {
  constructor(di) {
    super(di);
    this.dbTable = di.get('config').sources.categories;
    this.db = this.di.get('db').connections.mysql;
    this.Model = Categories;
  }
  // load(params, payload) {
  //   console.log(params, payload);
  // }
  create(params, payload) { // eslint-disable-line
    console.log(params, payload);
    return 'From mapper create()';
  }
  // load(params, payload) { // eslint-disable-line
  //   return 'From mapper load()';
  // }
}

module.exports = UsersMapper;

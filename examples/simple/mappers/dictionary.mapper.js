const { MySQLMapper } = require('airborne-base');
const Dictionary = require('../models/dictionary.js');

class DictionaryMapper extends MySQLMapper {
  constructor(di) {
    super(di);
    this.dbTable = di.get('config').sources.dictionary;
    this.db = this.di.get('db').connections.mysql;
    this.Model = Dictionary;
  }
  // create(params, payload) {
  //   return { params, payload };
  // }
  load(params, payload) {
    console.log(params, payload);
    return super.load(params, payload);
  }
}

module.exports = DictionaryMapper;

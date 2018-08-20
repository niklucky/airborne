const MySQLMapper = require('../../../../airborne-base/dist/lib/mysql.mapper').default;
const Dictionary = require('../models/dictionary.js');

class DictionaryMapper extends MySQLMapper {
  constructor(di) {
    super(di);
    this.dbTable = di.get('config').sources.dictionary;
    this.db = this.di.get('db').connections.mysql;
    this.Model = Dictionary;
  }
}

module.exports = DictionaryMapper;

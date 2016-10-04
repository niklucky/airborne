const {BaseService} = require('../../../dist').default;
const DictionaryMapper = require('../mappers/dictionary.mapper.js');

class DictionaryService extends BaseService {
  constructor(di) {
    super(di);
    this.mapper = new DictionaryMapper(di);
  }
}

module.exports = DictionaryService;

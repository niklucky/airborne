const { BaseController } = require('../../../dist').default;
const DictionaryService = require('../services/dictionary.service.js');

class DictionaryController extends BaseController {
  constructor(di) {
    super(di);
    this.service = new DictionaryService(di);
    this.rules = {
      create: {
        word: { type: 'string', required: true },
        translation: { type: 'string', required: true },
        lang: { type: 'string', required: true },
        avatar: { type: 'file', fileTypes: ['xls'], size: 2, required: true }
      }
    };
  }
}

module.exports = DictionaryController;

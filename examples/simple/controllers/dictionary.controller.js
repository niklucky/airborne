const { BaseController } = require('../../../dist');
const DictionaryService = require('../services/dictionary.service.js');

class DictionaryController extends BaseController {
  constructor(di) {
    super(di);
    this.service = new DictionaryService(di);
    this.rules = {
      load: {
        id: { type: 'number' },
        orderBy: { type: 'string' }
      },
      create: {
        title: { type: 'string', required: true },
        // translation: { type: 'string', required: true },
        // lang: { type: 'string', required: true },
        // avatar: { type: 'file', fileTypes: ['xls'], size: 2, required: true }
      }
    };
  }
}

module.exports = DictionaryController;

const { BaseController } = require('../../../dist/index.js');

class IndexController extends BaseController {
  constructor(di) {
    super(di);
    this.di = di;
    this.rules = {
      load: {}
    };
  }
}

module.exports = IndexController;

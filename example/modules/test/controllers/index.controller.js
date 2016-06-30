class IndexController {
  constructor (di) {
    this.di = di;
  }
  load () {
    return {
      test: 1
    }
  }
}

module.exports = IndexController;

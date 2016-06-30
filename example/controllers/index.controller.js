class IndexController {
  constructor (di) {
    this.di = di;
  }

  load (params) {
    return {
      a: 1
    }
  }
}

module.exports = IndexController;

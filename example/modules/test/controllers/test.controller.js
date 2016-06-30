class TestController {
  constructor (di) {
    this.di = di;
  }
  load () {
    return new Promise((resolve, reject) => {
      resolve({
        test2: 22
      });
    });
  }
}

module.exports = TestController;

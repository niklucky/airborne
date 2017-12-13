class SimpleMiddleware {
  constructor(di) {
    this.di = di;
  }
  init() {
    try {
      console.log('[SIMPLE MIDDLEWARE]');
    } catch (err) {
      console.log(err);
      throw new Error(`Error in SimpleMiddleware: ${err}`);
    }
  }
}

module.exports = SimpleMiddleware;

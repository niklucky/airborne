class SimpleMiddleware {
  constructor(di) {
    this.di = di;
  }
  Init() {
    try {
      console.log('[SIMPLE MIDDLEWARE]');
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

module.exports = SimpleMiddleware;

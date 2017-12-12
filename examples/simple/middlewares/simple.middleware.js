class SimpleMiddleware {
  constructor(di) {
    this.di = di;
    // this.responder = this.di.get('responder');
    // this.responder.setServerResponse(this.di.get('response'));
  }
  Init() {
    console.log('====================');
    console.log('SIMPLE MIDDLEWARE');
    console.log('====================');
    return true;
  }
}

module.exports = SimpleMiddleware;

class SimpleMiddleware {
  constructor(di) {
    this.di = di;
    // this.responder = this.di.get('responder');
    // this.responder.setServerResponse(this.di.get('response'));
  }
  Init() {
    const req = this.di.get('request').url;
    console.log('====================');
    console.log('SIMPLE MIDDLEWARE', req);
    console.log('====================');
  }
}

module.exports = SimpleMiddleware;

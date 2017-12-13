class AuthMiddleware {
  constructor(di) {
    this.di = di;
    this.responder = this.di.get('responder');
    this.responder.setServerResponse(this.di.get('response'));
  }
  Init() {
    console.log('[AUTH MIDDLEWARE]');
    if (this.di.get('services') === undefined) {
      throw new Error('[Fatal] AUTH ERROR: services that contains Authorization service are not provided');
    }
    const AuthLibrary = this.di.get('services').Authorization;
    if (AuthLibrary === undefined) {
      throw Error('[Fatal] Dispatcher error: Auth library not initialized. You need to provide core service or disable authorization for route');
    }
    const Auth = new AuthLibrary(this.di);
    return Auth.init()
      .then((authData) => {
        if (!authData.status) {
          this.responder.sendError('Not authorized', 401);
          throw new Error('Auth error: not authorized');
        } else { // eslint-disable-line
          this.authData = authData;
          this.di.set('authData', authData);
        }
      })
      .catch((authData) => {
        this.responder.sendError(authData, 401);
        throw new Error(`Auth error: ${authData}`);
      });
  }
}

module.exports = AuthMiddleware;

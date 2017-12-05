const AuthMapper = require('../mappers/auth.mapper');

class AuthService {
  constructor(di) {
    this.di = di;
    this.mapper = new AuthMapper(di);
  }

  init() {
    const token = this.isTokenProvided();
    return this.mapper.load({ token: token }).then((session) => {
      console.log('AuthService init()', session);
      let result = session;
      if (result !== null) {
        result.status = 1;
      } else {
        result = {
          status: 0
        };
      }
      return result;
    })
    .catch(() => this.authError('Not authorized'));
  }

  isTokenProvided() {
    const token = this.di.get('request').headers.authorization;
    if (!token) {
      this.authError('Token is not provided');
    }
    return token;
  }

  authError(message) {
    console.log('MESSAGE', message);
    console.log('RESPONDER', this.di.get('responder'));
    return this.di.get('responder').sendError({ message: message }, 401);
  }
}

module.exports = AuthService;

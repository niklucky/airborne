const AuthMapper = require('../mappers/auth.mapper');

class AuthService {
  constructor(di) {
    this.di = di;
    this.mapper = new AuthMapper(di);
  }

  init() {
    const token = this.isTokenProvided();
    return this.mapper.load({ token: token }).then((session) => {
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
    // .catch((err) => this.authError('Not authorized', err));
  }

  isTokenProvided() {
    const token = this.di.get('request').headers.authorization;
    if (!token) {
      this.authError('Token is not provided');
    }
    return token;
  }

  authError(message, err) {
    console.log('MES', err);
    return this.di.get('responder').sendError({ message: message }, 401);
  }
}

module.exports = AuthService;

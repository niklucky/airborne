const AuthMiddleware = require('../middlewares/auth.middleware');
const SimpleMiddleware = require('../middlewares/simple.middleware');

const middlewares = {
  // authorization: {
  //   route: '/orders/',
  //   module: AuthMiddleware
  // },
  simple: {
    route: '/orders/',
    module: SimpleMiddleware
  }
};

module.exports = middlewares;

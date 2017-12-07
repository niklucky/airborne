const AuthMiddleware = require('../middlewares/auth.middleware');

const middlewares = {
  authorization: {
    route: 'orders',
    module: AuthMiddleware
  }
};

module.exports = middlewares;

const AuthMiddleware = require('../middlewares/auth.middleware');
const SimpleMiddleware = require('../middlewares/simple.middleware');

const middlewares = [
  AuthMiddleware,
  SimpleMiddleware
];

exports.module = middlewares;

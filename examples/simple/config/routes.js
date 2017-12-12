const OrdersController = require('../controllers/orders.controller');
const UsersController = require('../controllers/users.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const SimpleMiddleware = require('../middlewares/simple.middleware');
const LogMiddleware = require('../middlewares/log.middleware');

const routes = {
  '/orders/:orderId?': {
    get: {
      handler: OrdersController,
      method: 'load',
      middleware: [LogMiddleware, SimpleMiddleware]
    },
    post: {
      handler: OrdersController,
      method: 'create',
      middleware: [LogMiddleware, AuthMiddleware, SimpleMiddleware]
    }
  },
  '/orders/:orderId?/users/:userId?': {
    get: {
      handler: OrdersController,
      method: 'load',
      middleware: [LogMiddleware, SimpleMiddleware, AuthMiddleware]
    }
  },
  '/users/:userId?': {
    get: {
      handler: UsersController,
      method: 'load'
    },
    put: {
      handler: UsersController,
      method: 'create'
    }
  }
  /* Routes */

  /* // Routes */
};

module.exports = routes;

const OrdersController = require('../controllers/orders.controller');
const UsersController = require('../controllers/users.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const SimpleMiddleware = require('../middlewares/simple.middleware');

const routes = {
  '/orders/': {
    get: {
      handler: OrdersController,
      method: 'load',
      middleware: [AuthMiddleware, SimpleMiddleware]
    },
    put: {
      handler: OrdersController,
      method: 'create',
      middleware: [AuthMiddleware, SimpleMiddleware]
    }
  },
  '/orders/:orderId': {
    get: {
      handler: OrdersController,
      method: 'get',
      middleware: [SimpleMiddleware, AuthMiddleware]
    }
  },
  '/users/': {
    get: {
      handler: UsersController,
      method: 'load'
    },
    put: {
      handler: UsersController,
      method: 'create'
    }
  },
  '/users/:userId': {
    get: {
      handler: UsersController,
      method: 'get'
    }
  }
};

module.exports = routes;

const OrdersController = require('../controllers/orders.controller');
const UsersController = require('../controllers/users.controller');

const routes = {
  '/orders/': {
    get: {
      handler: OrdersController,
      method: 'load'
    },
    put: {
      handler: OrdersController,
      method: 'create'
    }
  },
  '/orders/:orderId/': {
    get: {
      handler: OrdersController,
      method: 'get'
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
  '/users/:userId/': {
    get: {
      handler: UsersController,
      method: 'get'
    }
  }
};

module.exports = routes;

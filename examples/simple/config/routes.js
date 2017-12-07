const OrdersController = require('../controllers/orders.controller');

const routes = {
  '/orders/': {
    get: {
      handler: OrdersController,
      method: 'load',
    },
    post: {
      handler: OrdersController,
      method: 'create',
    }
  },
  '/orders/:orderId/': {
    get: {
      handler: OrdersController,
      method: 'get',
    }
  }
};

module.exports = routes;

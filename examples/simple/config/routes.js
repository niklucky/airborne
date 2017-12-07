const OrdersController = require('../controllers/orders.controller');

const routes = {
  '/orders/': {
    get: {
      handler: OrdersController,
      method: 'load',
      auth: true
    },
    post: {
      handler: OrdersController,
      method: 'create',
      auth: true
    }
  },
  '/orders/:orderId/': {
    get: {
      handler: OrdersController,
      method: 'get',
      auth: true
    }
  }
};

module.exports = routes;

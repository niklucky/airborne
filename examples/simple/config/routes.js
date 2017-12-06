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
  '/order/:orderId/': {
    get: {
      handler: OrdersController,
      method: 'load',
      auth: true
    }
  }
};

module.exports = routes;

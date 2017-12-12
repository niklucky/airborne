const { BaseController } = require('airborne-base');
const OrdersService = require('../services/orders.service');

class OrdersController extends BaseController {
  constructor(di) {
    super(di);
    this.service = new OrdersService(di);
    this.rules = {
      create: {
        orderId: { type: 'number' },
        userId: { type: 'number' }
      },
      get: {
        orderId: { type: 'number' },
        userId: { type: 'number' }
      },
      load: {
        orderId: { type: 'number' },
        userId: { type: 'number' }
      }
    };
  }
}

module.exports = OrdersController;

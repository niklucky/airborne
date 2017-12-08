const { BaseController } = require('../../../dist');
const OrdersService = require('../services/orders.service');

class OrdersController extends BaseController {
  constructor(di) {
    super(di);
    this.service = new OrdersService(di);
    this.rules = {
      get: {
        orderId: { type: 'number' },
      },
      load: {
        orderId: { type: 'number' },
        userId: { type: 'number' }
      },
      create: {
        orderId: { type: 'number' },
        userId: { type: 'number' }
      }
    };
  }
}

module.exports = OrdersController;

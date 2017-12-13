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
      load: {
        orderId: { type: 'number' },
        userId: { type: 'number' }
      }
    };
  }
  load(params) {
    if (Object.keys(params).length > 0) {
      return this.service.get(params);
    }
    return this.service.load();
  }
}

module.exports = OrdersController;

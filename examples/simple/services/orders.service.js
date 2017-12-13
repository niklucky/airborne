const { BaseService } = require('airborne-base');
const OrdersMapper = require('../mappers/orders.mapper.js');

class OrdersService extends BaseService {
  constructor(di) {
    super(di);
    this.mapper = new OrdersMapper(di);
  }
  get(params) {
    return this.mapper.get(params);
  }
}

module.exports = OrdersService;

const { BaseService } = require('../../../dist');
const OrdersMapper = require('../mappers/orders.mapper.js');

class OrdersService extends BaseService {
  constructor(di) {
    super(di);
    this.mapper = new OrdersMapper(di);
  }
  // load(params) {
  //   return super.load(params);
  //     // .then(res => console.log('FROM SERVICE', res));
  // }
}

module.exports = OrdersService;

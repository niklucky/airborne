const { MySQLMapper } = require('airborne-base');
const Orders = require('../models/order.js');

class OrdersMapper extends MySQLMapper {
  constructor(di) {
    super(di);
    this.dbTable = di.get('config').sources.orders;
    this.db = this.di.get('db').connections.mysql;
    this.Model = Orders;
  }
  load(params) {
    console.log(params);
  }
}

module.exports = OrdersMapper;

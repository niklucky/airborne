class Orders {
  constructor(data) {
    console.log('DATA', data);
    this.orderId = data.orderId;
    this.userId = data.userId;
    if (data.orderedAt !== undefined) {
      this.orderedAt = data.orderedAt;
    }
  }
}

module.exports = Orders;

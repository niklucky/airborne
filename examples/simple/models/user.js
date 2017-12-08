class Orders {
  constructor(data) {
    this.userId = data.userId;
    this.eMail = data.eMail;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.age = data.age;
  }
}

module.exports = Orders;

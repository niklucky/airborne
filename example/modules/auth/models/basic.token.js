class BasicToken {
  constructor(model) {
    this.token = model.token;
    this.accountKey = model.accountKey;
    this.apiKey = model.key;
    this.keyState = model.keyState;
  }
}

module.exports = BasicToken;

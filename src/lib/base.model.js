class BaseModel {
  constructor(data) {
    this.data = data;
  }
  get() {
    return this.data;
  }
}

module.exports = BaseModel;

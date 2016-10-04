

const BaseModel = require('./base.model');

class BaseMapper {
  constructor(di) {
    this.di = di;
    this.Model = BaseModel;
  }

  load(params) {
    return this.nullObject(params);
  }

  get(params) {
    return this.nullObject(params);
  }

  create(params, payload) {
    return this.nullObject(payload);
  }

  update(params, data) {
    return this.nullObject(params, data);
  }

  search(params) {
    return this.nullObject(params);
  }

  status(params) {
    return this.nullObject(params);
  }

  del(params) {
    return this.nullObject(params);
  }

  nullObject() { // eslint-disable-line class-methods-use-this
    return {};
  }

  buildCollection(collection) {
    const builtCollection = [];
    for (const item of collection) {
      builtCollection.push(
        this.build(item)
      );
    }
    return builtCollection;
  }

  build(object) {
    return new this.Model(object);
  }
}

module.exports = BaseMapper;

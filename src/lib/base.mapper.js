'use strict';
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

  create(payload) {
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

  nullObject(params){
    params = {};
    return params;
  }

  buildCollection(collection){
    let builtCollection = {};
    for(let i in collection){
      builtCollection[i] = this.build(collection[i]);
    }
    return builtCollection;
  }

  build(object) {
    return new this.Model(object);
  }
}

module.exports = BaseMapper;

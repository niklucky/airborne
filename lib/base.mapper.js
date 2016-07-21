"use strict";
const BaseModel = require('./base.model');

class BaseMapper {
  constructor(di) {
    this.di = di;
    this.Model = BaseModel;
  }

  load(params) {
    return this.nullObject();
  }

  get(params) {
    return this.nullObject();
  }

  create(payload) {
    return this.nullObject();
  }

  update(params, data) {
    return this.nullObject();
  }

  search(params) {
    return this.nullObject();
  }

  nullObject(){
    return {};
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

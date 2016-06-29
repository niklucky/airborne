"use strict";
const BaseModel = require('./base.model');

class BaseMapper {

  constructor(di) {
    this.di = di;
    this.Model = BaseModel;
  }
  build(object) {
    return new this.Model(object);
  }
}

module.exports = BaseMapper;

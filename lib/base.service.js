"use strict";

const BaseMapper = require('./base.mapper');
class BaseService {

  constructor(di) {
    this.di = di;
    this.mapper = BaseMapper;
  }
  
  load(params) {
    return this.mapper.load(params);
  }

  get(params) {
    return this.mapper.get(params);
  }

  create(params, data) {
    return this.mapper.create(params, data);
  }

  update(params, data) {
    return this.mapper.update(params, data);
  }

  search(params) {
    return this.mapper.search(params);
  }
}

module.exports = BaseService;

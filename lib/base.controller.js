"use strict";
const BaseService = require('./base.service');

class BaseController {
  constructor(di) {
    this.di = di;
    this.service = new BaseService(di);
    this.rules = {};
  }

  load(params) {
    return this.service.load(params);
  }

  get(params) {
    return this.service.get(params);
  }

  create(params) {
    return this.service.create(params);
  }

  update(params, data) {
    return this.service.update(params, data);
  }

  search(params) {
    return this.service.search(params);
  }
}

module.exports = BaseController;

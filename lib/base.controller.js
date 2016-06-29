"use strict";
const BaseService = require('./base.service');

class BaseController {
  constructor(di) {
    this.di = di;
    this.service = new BaseService(di);
  }

  load(params) {
    return this.service.load(params);
  }

  get(params) {
    return this.service.get(params);
  }

  create(params) {
    let postData = this.di.get('request').body;
    return this.service.create(params, postData);
  }

  update(params) {
    let data = this.di.get('request').body;
    return this.service.update(params, data);
  }

  search(params) {
    return this.service.search(params);
  }
}

module.exports = BaseController;

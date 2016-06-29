"use strict";

const BaseMapper = require('./base.mapper');
class BaseService {

  constructor(di) {
    this.di = di;
    this.mapper = BaseMapper;
  }
  create(params) {
    return {
      basic: 1
    }

  }
}

module.exports = BaseService;

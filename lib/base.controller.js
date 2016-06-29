import BaseService from './base.service';

class BaseController {
  constructor(di) {
    this.di = di;
    this.service = new BaseService(di);
  }

  afterAction(params, data) {
    return data;
  }

  beforeAction(params, data) {
    return data;
  }

  load(params) {
    return {};
  }

  get(params) {
    return {};
  }

  create(params) {
    return this.service.create(params);
  }
}

export default BaseController;

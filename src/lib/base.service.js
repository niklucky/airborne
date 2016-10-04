import BaseMapper from './base.mapper';

class BaseService {
  constructor(di) {
    this.di = di;
    this.mapper = new BaseMapper(di);
  }

  load(params) {
    return this.mapper.load(params);
  }

  get(params) {
    return this.mapper.get(params);
  }

  create(params, payload) {
    return this.mapper.create(params, payload);
  }

  update(params, payload) {
    return this.mapper.update(params, payload);
  }

  search(params) {
    return this.mapper.search(params);
  }

  status(params) {
    return this.mapper.get(params);
  }

  del(params) {
    return this.mapper.del(params);
  }
}

module.exports = BaseService;

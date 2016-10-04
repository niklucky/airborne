import BaseService from './base.service';

class BaseController {
  constructor(di) {
    this.di = di;
    this.service = new BaseService(di);
    this.rules = {};
    this.options = {};
    this.params = {};
  }

  validate(method, params) {
    const requestData = this.mergeRequestData(params);
    const Validator = this.di.get('Validator');
    if (Validator) {
      const validator = new Validator(this.rules[method], this.options[method]);
      const result = validator.validate(requestData);
      if (result.result === false) {
        return this.di.get('responder').sendError({ message: 'Validation error', stack: result.errors }, 400);
      }
      return this[method](result.validated.params, result.validated.payload);
    }
    return this[method](requestData.data);
  }

  mergeRequestData(requestParams) {
    const payload = {};
    const params = (requestParams || {});

    const query = this.di.get('request').query;
    if (Object.keys(query).length > 0) {
      for (const i of Object.keys(query)) {
        const name = Object.keys(query)[i];
        params[name] = query[name];
      }
    }
    const body = this.di.get('request').body;
    if (Object.keys(body).length > 0) {
      for (const n of Object.keys(body)) {
        const name = Object.keys(body)[n];
        payload[name] = body[name];
      }
    }
    return {
      params,
      payload,
    };
  }

  load(params) {
    return this.service.load(params);
  }

  get(params) {
    return this.service.get(params);
  }

  create(params, payload) {
    return this.service.create(payload);
  }

  update(params, payload) {
    return this.service.update(params, payload);
  }

  search(params) {
    return this.service.search(params);
  }

  status(params) {
    return this.service.status(params);
  }

  del(params) {
    return this.service.del(params);
  }

}

module.exports = BaseController;

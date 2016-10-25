import BaseService from './base.service';

class BaseController {
  constructor(di) {
    if ((di instanceof Object) === false) {
      throw new Error('[Fatal] BaseController: you need to provide valid DI');
    }
    if (di.get('request') === undefined) {
      throw new Error('[Fatal] BaseController: you need to provide valid request in DI');
    }
    this.di = di;
    this.service = new BaseService(di);
    this.rules = {};
  }

  validate(method, params) {
    if (typeof method !== 'string') {
      throw new Error('[Fatal] BaseController.validate(): Controller method is not specified');
    }
    const requestData = this.mergeRequestData(params);
    const Validator = this.di.get('validator');
    if (Validator) {
      const validator = new Validator(this.rules[method]);
      const result = validator.validate(requestData);
      if (result.result === false) {
        return this.di.get('responder').sendError({ message: 'Validation error', stack: result.errors }, 400);
      }
      requestData.params = result.validated.params;
      requestData.payload = result.validated.payload;
    }
    return this.run(method, requestData.params, requestData.payload);
  }

  run(method, params, payload) {
    const result = this.beforeAction(method, params, payload);
    if (result.then !== undefined) {
      return result.then(() => (this[method](params, payload)));
    }
    return this[method](params, payload);
  }

  beforeAction(method, params, payload) { // eslint-disable-line
    return true;
  }

  mergeRequestData(requestParams) {
    const payload = {};
    const params = (requestParams || {});

    const query = this.di.get('request').query;
    if (query !== undefined && Object.keys(query).length > 0) {
      for (const name of Object.keys(query)) {
        params[name] = query[name];
      }
    }
    const body = this.di.get('request').body;
    if (body !== undefined && Object.keys(body).length > 0) {
      for (const name of Object.keys(body)) {
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
    return this.service.create(params, payload);
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

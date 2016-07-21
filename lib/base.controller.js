"use strict";
const BaseService = require('./base.service');

class BaseController {
  constructor(di) {
    this.di = di;
    this.service = new BaseService(di);
    this.rules = {};
    this.options = {};
    this.params = {};
  }

  validate(method, params){
    let requestData = this.mergeRequestData(params);
    if (this.di.get('Validator')) {
      const validator = this.di.get('Validator')
        .setRules(this.rules[method])
        .setOptions(this.options[method]);

      const result = validator.validate(requestData);
      if(result.result === false){
        return this.di.get('responder').sendError({message: "Validation error", stack: result.errors }, 401);
      }
      return this[method](result.validated.params, result.validated.payload);
    }
    return this[method](requestData.data);
  }

  mergeRequestData(params){
    var payload = {};

    if(params == undefined){
      params = {};
    }

    let query = this.di.get('request').query;
    if(Object.keys(query).length > 0){
      for (var i in query) {
        if( query.hasOwnProperty(i)){
          params[i] = query[i];
        }
      }
    }
    let body = this.di.get('request').body;
    if(Object.keys(body).length > 0){
      for (var i in body) {
        if( body.hasOwnProperty(i)){
          payload[i] = body[i];
        }
      }
    }
    return {
      params,
      payload
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
}

module.exports = BaseController;

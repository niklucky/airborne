"use strict";
const BaseService = require('./base.service');

class BaseController {
  constructor(di) {
    this.di = di;
    this.service = new BaseService(di);
    this.rules = {};
  }
  validate(method, params){
    let requestData = this.mergeRequestData(params);
    if (this.di.get('Validator')) {
      let result =
        this.di.get('Validator')
          .setRules(this.rules[method])
          .setOptions(this.options[method])
          .validate(requestData);
      return this[method](params, result.validated);
    }
    return this[method](params, requestData);
  }

  mergeRequestData(params){
    var payload = {};
    params = params[0];

    let query = this.di.get('request').query;
    if(Object.keys(query).length > 0){
      for (var i in query) {
        if( query.hasOwnProperty(i)){
          payload[i] = query[i];
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
      params: params,
      requestData: payload
    };
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

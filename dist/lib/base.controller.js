'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseService = require('./base.service');

var BaseController = function () {
  function BaseController(di) {
    _classCallCheck(this, BaseController);

    this.di = di;
    this.service = new BaseService(di);
    this.rules = {};
    this.options = {};
    this.params = {};
    this.validator = this.di.get('Validator');
  }

  _createClass(BaseController, [{
    key: 'validate',
    value: function validate(method, params) {
      var requestData = this.mergeRequestData(params);
      if (this.validator) {
        var validator = new this.validator(this.rules[method], this.options[method]);
        var result = validator.validate(requestData);
        if (result.result === false) {
          return this.di.get('responder').sendError({ message: 'Validation error', stack: result.errors }, 401);
        }
        return this[method](result.validated.params, result.validated.payload);
      }
      return this[method](requestData.data);
    }
  }, {
    key: 'mergeRequestData',
    value: function mergeRequestData(params) {
      var payload = {};

      if (params == undefined) {
        params = {};
      }

      var query = this.di.get('request').query;
      if (Object.keys(query).length > 0) {
        for (var i in query) {
          if (query.hasOwnProperty(i)) {
            params[i] = query[i];
          }
        }
      }
      var body = this.di.get('request').body;
      if (Object.keys(body).length > 0) {
        for (var n in body) {
          if (body.hasOwnProperty(n)) {
            payload[n] = body[n];
          }
        }
      }
      return {
        params: params,
        payload: payload
      };
    }
  }, {
    key: 'load',
    value: function load(params) {
      return this.service.load(params);
    }
  }, {
    key: 'get',
    value: function get(params) {
      return this.service.get(params);
    }
  }, {
    key: 'create',
    value: function create(params, payload) {
      return this.service.create(payload);
    }
  }, {
    key: 'update',
    value: function update(params, payload) {
      return this.service.update(params, payload);
    }
  }, {
    key: 'search',
    value: function search(params) {
      return this.service.search(params);
    }
  }, {
    key: 'status',
    value: function status(params) {
      return this.service.status(params);
    }
  }, {
    key: 'del',
    value: function del(params) {
      return this.service.del(params);
    }
  }]);

  return BaseController;
}();

module.exports = BaseController;
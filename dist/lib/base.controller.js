'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base = require('./base.service');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseController = function () {
  function BaseController(di) {
    _classCallCheck(this, BaseController);

    this.di = di;
    this.service = new _base2.default(di);
    this.rules = {};
    this.options = {};
    this.params = {};
  }

  _createClass(BaseController, [{
    key: 'validate',
    value: function validate(method, params) {
      var requestData = this.mergeRequestData(params);
      var Validator = this.di.get('validator');
      if (Validator) {
        var validator = new Validator(this.rules[method], this.options[method]);
        var result = validator.validate(requestData);
        if (result.result === false) {
          return this.di.get('responder').sendError({ message: 'Validation error', stack: result.errors }, 400);
        }
        return this[method](result.validated.params, result.validated.payload);
      }
      return this[method](requestData.data);
    }
  }, {
    key: 'mergeRequestData',
    value: function mergeRequestData(requestParams) {
      var payload = {};
      var params = requestParams || {};

      var query = this.di.get('request').query;
      if (Object.keys(query).length > 0) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Object.keys(query)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var name = _step.value;

            params[name] = query[name];
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
      var body = this.di.get('request').body;
      if (Object.keys(body).length > 0) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = Object.keys(body)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _name = _step2.value;

            payload[_name] = body[_name];
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
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
      return this.service.create(params, payload);
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
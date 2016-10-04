'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base = require('./base.mapper');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseService = function () {
  function BaseService(di) {
    _classCallCheck(this, BaseService);

    this.di = di;
    this.mapper = new _base2.default(di);
  }

  _createClass(BaseService, [{
    key: 'load',
    value: function load(params) {
      return this.mapper.load(params);
    }
  }, {
    key: 'get',
    value: function get(params) {
      return this.mapper.get(params);
    }
  }, {
    key: 'create',
    value: function create(params, payload) {
      return this.mapper.create(params, payload);
    }
  }, {
    key: 'update',
    value: function update(params, payload) {
      return this.mapper.update(params, payload);
    }
  }, {
    key: 'search',
    value: function search(params) {
      return this.mapper.search(params);
    }
  }, {
    key: 'status',
    value: function status(params) {
      return this.mapper.get(params);
    }
  }, {
    key: 'del',
    value: function del(params) {
      return this.mapper.del(params);
    }
  }]);

  return BaseService;
}();

module.exports = BaseService;
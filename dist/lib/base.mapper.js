'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseModel = require('./base.model');

var BaseMapper = function () {
  function BaseMapper(di) {
    _classCallCheck(this, BaseMapper);

    this.di = di;
    this.Model = BaseModel;
  }

  _createClass(BaseMapper, [{
    key: 'load',
    value: function load(params) {
      return this.nullObject(params);
    }
  }, {
    key: 'get',
    value: function get(params) {
      return this.nullObject(params);
    }
  }, {
    key: 'create',
    value: function create(payload) {
      return this.nullObject(payload);
    }
  }, {
    key: 'update',
    value: function update(params, data) {
      return this.nullObject(params, data);
    }
  }, {
    key: 'search',
    value: function search(params) {
      return this.nullObject(params);
    }
  }, {
    key: 'nullObject',
    value: function nullObject(params) {
      params = {};
      return params;
    }
  }, {
    key: 'buildCollection',
    value: function buildCollection(collection) {
      var builtCollection = {};
      for (var i in collection) {
        builtCollection[i] = this.build(collection[i]);
      }
      return builtCollection;
    }
  }, {
    key: 'build',
    value: function build(object) {
      return new this.Model(object);
    }
  }]);

  return BaseMapper;
}();

module.exports = BaseMapper;
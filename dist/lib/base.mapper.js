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
    value: function create(params, payload) {
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
    key: 'status',
    value: function status(params) {
      return this.nullObject(params);
    }
  }, {
    key: 'del',
    value: function del(params) {
      return this.nullObject(params);
    }
  }, {
    key: 'nullObject',
    value: function nullObject() {
      // eslint-disable-line class-methods-use-this
      return {};
    }
  }, {
    key: 'buildCollection',
    value: function buildCollection(collection) {
      var builtCollection = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = collection[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var i = _step.value;

          builtCollection.push(this.build(collection[i]));
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
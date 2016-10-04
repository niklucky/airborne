'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* globals Promise */

var BaseMapper = require('./base.mapper');
var MySQLQueryBuilder = require('mysql-qb');

var MySQLMapper = function (_BaseMapper) {
  _inherits(MySQLMapper, _BaseMapper);

  function MySQLMapper(di) {
    _classCallCheck(this, MySQLMapper);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MySQLMapper).call(this, di));

    _this.db = null;
    _this.dbTable = null;
    _this.queryBuilder = new MySQLQueryBuilder();
    return _this;
  }

  _createClass(MySQLMapper, [{
    key: 'get',
    value: function get(params) {
      var _this2 = this;

      return new Promise(function (resolve) {
        _this2.load(params).then(function (collection) {
          resolve(collection[0]);
        });
      });
    }
  }, {
    key: 'load',
    value: function load(params) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        try {
          var query = _this3.queryBuilder.select('*').from(_this3.dbTable).where(params).build();
          return _this3.db.query(query, function (error, rows, fields) {
            if (error) {
              reject(error, fields);
            }
            resolve(_this3.buildCollection(rows));
          });
        } catch (e) {
          return reject(e);
        }
      });
    }
  }, {
    key: 'create',
    value: function create(params) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        try {
          var _ret = function () {
            var model = new _this4.Model(params);
            var data = model.get ? model.get() : model;
            for (var i in data) {
              if (typeof data[i] === 'string') {
                data[i] = data[i].replace(/'/g, "\\'"); // eslint-disable-line
              }
            }
            var query = _this4.queryBuilder.insert(_this4.dbTable, data).build();
            return {
              v: _this4.db.query(query, function (error, result) {
                if (error) {
                  return reject(error);
                }
                data.id = result.insertId;
                for (var _i in data) {
                  if (typeof data[_i] === 'string') {
                    data[_i] = data[_i].replace(/\'/g, "'"); // eslint-disable-line
                  }
                }
                return resolve(data);
              })
            };
          }();

          if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        } catch (e) {
          return reject(e);
        }
      });
    }
  }, {
    key: 'update',
    value: function update(params, payload) {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        try {
          var model = new _this5.Model(payload);
          var data = model.get ? model.get() : payload;
          for (var i in data) {
            if (data[i] === undefined) {
              delete data[i];
            }
          }
          var query = _this5.queryBuilder.update(_this5.dbTable, data).where(params).build();
          return _this5.db.query(query, function (error, result) {
            if (error) {
              return reject(error);
            }
            return resolve(result);
          });
        } catch (e) {
          return reject(e);
        }
      });
    }
  }, {
    key: 'del',
    value: function del(params) {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        try {
          var query = _this6.queryBuilder.delete(_this6.dbTable).where(params).build();
          return _this6.db.query(query, function (error, result) {
            if (error) {
              return reject(error);
            }
            return resolve(result);
          });
        } catch (e) {
          return reject(e);
        }
      });
    }
  }]);

  return MySQLMapper;
}(BaseMapper);

module.exports = MySQLMapper;
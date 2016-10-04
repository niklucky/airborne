'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* globals Promise */
var BaseMapper = require('./base.mapper');
var BaseModel = require('./base.model');

var RedisMapper = function (_BaseMapper) {
  _inherits(RedisMapper, _BaseMapper);

  function RedisMapper(di) {
    _classCallCheck(this, RedisMapper);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RedisMapper).call(this, di));

    _this.db = di.db;
    _this.Model = BaseModel;
    _this.expired = 0;
    _this.prefix = '';
    return _this;
  }

  _createClass(RedisMapper, [{
    key: 'create',
    value: function create(requestParams, payload) {
      var params = payload;
      var object = new this.Model(params).get();
      if (params.key === undefined) {
        params.key = this._generateKey(object);
      }

      if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object') {
        return this._setter('hmset', params.key, object, this.expired);
      }
      return this._setter('set', params.key, object, this.expired);
    }
  }, {
    key: 'get',
    value: function get(params) {
      var object = new this.Model(params).get();

      if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object') {
        return this._getter('hgetall', object.key);
      }
      return this._getter('get', object);
    }
  }, {
    key: 'load',
    value: function load(params) {
      return this.get(params);
    }
  }, {
    key: 'update',
    value: function update(key, data) {
      var object = new this.Model(data).get();
      if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object') {
        return this._setter('hmset', this._getKey(key), object, this.expired);
      }
      return this._setter('set', this._getKey(key), object, this.expired);
    }
  }, {
    key: 'expire',
    value: function expire(key, _expire) {
      return this._setter('expire', this._getKey(key), _expire);
    }
  }, {
    key: 'del',
    value: function del(key) {
      return this._getter('del', this._getKey(key));
    }
  }, {
    key: '_getKey',
    value: function _getKey(key) {
      // eslint-disable-line class-methods-use-this
      if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') {
        return key.key;
      }
      return key;
    }
  }, {
    key: '_generateKey',
    value: function _generateKey(model) {
      // eslint-disable-line class-methods-use-this
      var crypto = require('crypto');

      var uuid = new Date();
      var secret = 'secret';
      var key = model.id ? model.id : model.toString() + uuid.toISOString();
      return crypto.createHmac('sha256', secret).update(key).digest('hex');
    }
  }, {
    key: '_setter',
    value: function _setter(command, key, value, expired) {
      var _this2 = this;

      var redisKey = this.prefix + ':' + key;
      return new Promise(function (resolve, reject) {
        _this2.db[command](redisKey, value, function (error, replies) {
          if (replies === 'OK') {
            return resolve(key);
          }
          return reject({ error: error, replies: replies });
        });
        if (expired > 0) {
          _this2.db.expire(redisKey, expired);
        }
      });
    }
  }, {
    key: '_getter',
    value: function _getter(command, key, expired) {
      var _this3 = this;

      var redisKey = this.prefix + ':' + key;
      return new Promise(function (resolve, reject) {
        // console.log("Command: ", command, redisKey);
        _this3.db[command](redisKey, function (error, replies) {
          if (error) {
            return reject({ error: error, replies: replies });
          }
          var data = replies;
          if ((typeof replies === 'undefined' ? 'undefined' : _typeof(replies)) === 'object' && replies !== null) {
            data.key = key;
          }
          return resolve(data);
        });
        if (expired > 0) {
          _this3.db.expire(redisKey, expired);
        }
      });
    }
  }]);

  return RedisMapper;
}(BaseMapper);

module.exports = RedisMapper;
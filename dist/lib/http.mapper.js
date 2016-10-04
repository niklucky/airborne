'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* globals Promise */

var BaseMapper = require('./base.mapper');
var BaseModel = require('./base.model');
var HTTP = require('http');
var QueryString = require('querystring');

var HTTPMapper = function (_BaseMapper) {
  _inherits(HTTPMapper, _BaseMapper);

  function HTTPMapper(di) {
    _classCallCheck(this, HTTPMapper);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HTTPMapper).call(this, di));

    _this.host = '127.0.0.1';
    _this.port = 80;
    _this.path = '';
    _this.Model = BaseModel;
    return _this;
  }

  _createClass(HTTPMapper, [{
    key: 'get',
    value: function get(params) {
      return this.request('GET', params);
    }
  }, {
    key: 'load',
    value: function load(params) {
      return this.request('GET', params);
    }
  }, {
    key: 'create',
    value: function create(params, postData) {
      return this.request('POST', params, postData);
    }
  }, {
    key: 'update',
    value: function update(params, putData) {
      return this.request('PUT', params, putData);
    }
  }, {
    key: 'del',
    value: function del(params) {
      return this.request('DELETE', params);
    }
  }, {
    key: 'status',
    value: function status(params) {
      return this.request('HEAD', params);
    }
  }, {
    key: 'request',
    value: function request(method, params, postData) {
      var _this2 = this;

      var data = QueryString.stringify(postData);
      var options = {
        hostname: this.host,
        port: this.port,
        path: this.path + this.prepareGetParams(params),
        method: method,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(data),
          Token: this.di.get('config').serverKey
        }
      };
      return new Promise(function (resolve, reject) {
        var request = HTTP.request(options, function (response) {
          // console.log(`STATUS: ${response.statusCode}`);
          // console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
          response.setEncoding('utf8');
          response.on('data', function (chunk) {
            try {
              var result = JSON.parse(chunk);
              if (response.statusCode > 199 && response.statusCode < 301) {
                resolve(new _this2.Model(result));
              }
              reject({ message: 'Remote server error', stack: result });
            } catch (e) {
              reject(e);
            }
          });
          response.on('end', function () {
            // console.log('No more data in response.')
          });
        });
        request.on('error', function (e) {
          reject(Error(e));
        });

        if (postData) {
          request.write(data);
        }
        request.end();
        return request;
      });
    }
  }, {
    key: 'prepareGetParams',
    value: function prepareGetParams(params) {
      // eslint-disable-line class-methods-use-this
      var query = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(params)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var i = _step.value;

          var name = Object.keys(params)[i];
          query.push(name + '=' + params[name]);
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

      return '?' + query.join('&');
    }
  }]);

  return HTTPMapper;
}(BaseMapper);

module.exports = HTTPMapper;
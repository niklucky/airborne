'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _config = {
  path: './',
  host: 'localhost',
  port: 3000,
  debug: true
};

var Config = function () {
  function Config(config) {
    _classCallCheck(this, Config);

    _config = this.merge(_config, config);
  }

  _createClass(Config, [{
    key: 'merge',
    value: function merge(config, userConfig) {
      for (var i in userConfig) {
        if (userConfig.hasOwnProperty(i)) {
          config[i] = userConfig[i];
        }
      }
      return config;
    }
  }, {
    key: 'get',
    value: function get() {
      return _config;
    }
  }]);

  return Config;
}();

module.exports = Config;
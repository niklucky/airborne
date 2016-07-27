'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var lib = require('./lib');

var express = require('express');
var bodyParser = require('body-parser');

var Config = require('./core/config.js');
var DI = require('./core/di.js');
var Dispatcher = require('./core/dispatcher.js');
var DbAdapter = require('./core/db.adapter.js');

var _instances = [];

var Airborne = function () {
  function Airborne(userConfig) {
    _classCallCheck(this, Airborne);

    this.di = new DI();
    this.config = new Config(userConfig).get();
    this.di.set('config', this.config);

    if (this.di.get('config').db) {
      this.database(this.di.get('config').db);
    }
  }

  _createClass(Airborne, [{
    key: 'services',
    value: function services(_services) {
      this.di.set('services', _services);
      return this;
    }
  }, {
    key: 'controllers',
    value: function controllers(_controllers) {
      this.di.set('controllers', _controllers);
      return this;
    }
  }, {
    key: 'modules',
    value: function modules(_modules) {
      this.di.set('modules', _modules);
      return this;
    }
  }, {
    key: 'routes',
    value: function routes(_routes) {
      this.di.set('routes', _routes);
      return this;
    }
  }, {
    key: 'validator',
    value: function validator(_validator) {
      this.di.set('Validator', _validator);
      return this;
    }
  }, {
    key: 'database',
    value: function database(dbConfig) {
      this.di.set('db', new DbAdapter(dbConfig));
      return this;
    }
  }, {
    key: 'start',
    value: function start() {
      var _this = this;

      this.express = express();

      var RouterObj = express.Router;
      var router = new RouterObj({
        mergeParams: true
      });

      this.express.use(bodyParser.json());
      this.express.use(bodyParser.urlencoded({ extended: true }));

      router.use(function (request, response) {
        if (request.url.indexOf('favicon') !== -1) {
          response.send();
          return;
        }

        _this.handle(request, response);
      });

      router.use(function (err, req, res) {
        console.log('Error catched: ', err);
        res.send('Error');
      });

      this.express.use('/', router);

      var server = this.express.listen(this.config.port, this.config.host, function () {
        console.log('Server running at ' + server.address().address + ':' + server.address().port);
      });
    }
  }, {
    key: 'handle',
    value: function handle(request, response) {
      this.setInstance(new Dispatcher(this.di, request, response));
    }
  }, {
    key: 'setInstance',
    value: function setInstance(dispatcher) {
      _instances.push(dispatcher);
    }
  }]);

  return Airborne;
}();

lib.Airborne = Airborne;

module.exports = lib;
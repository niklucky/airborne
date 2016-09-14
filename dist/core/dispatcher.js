'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Router = require('./router.js');
var Responder = require('./responder.js');
var DI = require('./di.js');

var Dispatcher = function () {
  function Dispatcher(di, request, response) {
    _classCallCheck(this, Dispatcher);

    this.di = new DI().merge(di);

    this.debug = this.di.get('config').debug;

    this.di.set('request', request);
    this.di.set('response', response);

    this.responder = new Responder(this.di.get('config'));
    this.responder.setServerResponse(this.di.get('response'));

    this.di.set('responder', this.responder);

    this.router = new Router(this.di);

    this.init();
  }

  _createClass(Dispatcher, [{
    key: 'init',
    value: function init() {
      if (this.router.route !== null && this.router.route.auth) {
        return this.initAuth();
      }
      return this.dispatch();
    }
  }, {
    key: 'initAuth',
    value: function initAuth() {
      var _this = this;

      var AuthLibrary = this.di.get('services').Authorization;
      if (AuthLibrary === undefined) {
        throw Error('Auth library not initialized');
      }
      new AuthLibrary(this.di).init().then(function (authData) {
        if (!authData.status) {
          _this.responder.sendError('Not authorized', 401);
        }

        _this.authData = authData;
        _this.di.set('authData', authData);
        _this.dispatch();
      }).catch(function (authData) {
        _this.responder.sendError(authData, 401);
      });
    }
  }, {
    key: 'dispatch',
    value: function dispatch() {
      var _this2 = this;

      var result = this.start();

      if (result) {
        if (typeof result.then === 'function') {
          result.then(function (data) {
            _this2.send(data);
          }).catch(function (data) {
            _this2.responder.sendError(data);
          });
          return true;
        }
      }
      return this.send(result);
    }
  }, {
    key: 'send',
    value: function send(data) {
      this.responder.send(data);
    }
  }, {
    key: 'start',
    value: function start() {
      var controllers = this.di.get('controllers');

      try {
        if (this.debug) {
          console.log('Dispatcher start: ', this.router);
        }
        if (this.router.module) {
          var _module = new this.router.module();

          var Ctrl = _module.controllers[this.router.controller];
          if (typeof Ctrl !== 'function') {
            return this.responder.send404();
          }
          var controller = new Ctrl(this.di);

          return controller.validate(this.router.method, this.router.params);
        }
        var ctrl;
        if (typeof controllers[this.router.controller] !== 'function') {
          return this.responder.send404();
        }
        ctrl = new controllers[this.router.controller](this.di);

        return ctrl.validate(this.router.method, this.router.params);
      } catch (e) {
        console.log('Dispatcher error', e);
        this.responder.sendError(e);
      }
    }
  }]);

  return Dispatcher;
}();

module.exports = Dispatcher;
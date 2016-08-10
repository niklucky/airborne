'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require('lodash');

var DEFAULT_CONTROLLER_NAME = 'index';
var DEFAULT_CONTROLLER_METHOD = 'load';
var CONTROLLER_METHODS = {
  GET: 'load',
  POST: 'create',
  PUT: 'update',
  PATCH: 'update',
  DELETE: 'del',
  HEAD: 'status'
};

var _tmpSegments = [];

var Router = function () {
  function Router(di) {
    _classCallCheck(this, Router);

    this.route = null;
    this.module = null;
    this.controller = null;
    this.method = null;
    this.view = 'json';
    this.url = '';
    this.segments = [];
    this.path = '';
    this.params = undefined;

    this.setUrl(di.get('request').url).setPathFromUrl().setSegmentsFromPath().setRoute(di.get('routes'));

    if (this.checkAllowedMethods()) {
      this.setModule(di.get('modules')).setController(di.get('controllers')).setMethod(di.get('request').method).setParams();
    }
  }

  _createClass(Router, [{
    key: 'setUrl',
    value: function setUrl(url) {
      if (url.indexOf('.json') !== -1) {
        this.view = 'json';
        url = url.replace('.json', '');
      }
      if (url.indexOf('.xml') !== -1) {
        this.view = 'xml';
        url = url.replace('.xml', '');
      }

      this.url = url;
      return this;
    }
  }, {
    key: 'setPathFromUrl',
    value: function setPathFromUrl() {
      this.path = this.url.split('?').shift();
      return this;
    }
  }, {
    key: 'setSegmentsFromPath',
    value: function setSegmentsFromPath() {
      var seg = this.path.split('/');
      var segments = [];

      for (var i in seg) {
        if (seg.hasOwnProperty(i)) {
          if (seg[i] !== '') {
            segments.push(seg[i]);
          }
        }
      }
      this.segments = segments;
      _tmpSegments = segments.map(function (segment) {
        return segment;
      });
      return this;
    }
  }, {
    key: 'setRoute',
    value: function setRoute(routes) {
      if (_tmpSegments.length === 0 && routes['/'] !== undefined) {
        this.route = routes['/'];
        return this;
      }

      var routesArray = [];
      var namedParams = [];
      for (var routePath in routes) {
        var r = routePath.split('/');
        for (var i in r) {
          if (r[i] == '') {
            continue;
          }
          if (routesArray[routePath] === undefined) {
            routesArray[routePath] = [];
          }
          routesArray[routePath].push(r[i]);
        }
      }
      for (var _routePath in routesArray) {
        for (var _i in routesArray[_routePath]) {
          var routeSegment = routesArray[_routePath][_i];
          if (routeSegment.indexOf(':') !== -1) {
            namedParams.push(routeSegment.replace(':', ''));
            continue;
          }
          if (_tmpSegments[_i] !== routeSegment) {
            break;
          }
          this.route = routes[_routePath];
        }
        if (this.route !== undefined && this.route !== null) {
          this.route.namedParams = namedParams;
          return this;
        }
      }
      return this;
    }
  }, {
    key: 'checkAllowedMethods',
    value: function checkAllowedMethods() {
      if (this.route === undefined || this.route === null) {
        return true;
      }
      if (!this.route.methods) {
        return true;
      }
      return this.route.methods.indexOf(this.request.method) !== -1;
    }
  }, {
    key: 'setModule',
    value: function setModule(modules) {
      if (this.route !== undefined && this.route !== null && this.route.module) {
        this.module = this.route.module;
        return this;
      }

      if (_tmpSegments.length < 2) {
        return this;
      }

      var moduleName = this.prepareModuleName(_tmpSegments[0]);
      if (typeof modules[moduleName] === 'function') {
        this.module = modules[moduleName];
        _tmpSegments.splice(0, 1);
      }
      return this;
    }
  }, {
    key: 'setController',
    value: function setController() {
      if (this.route !== undefined && this.route !== null && this.route.controller) {
        this.controller = this.route.controller;
        return this;
      }

      this.controller = DEFAULT_CONTROLLER_NAME;
      if (_tmpSegments.length > 0) {
        this.controller = this.prepareControllerName(_tmpSegments[0]);
        _tmpSegments.splice(0, 1);
      }
      return this;
    }
  }, {
    key: 'setMethod',
    value: function setMethod(requestMethod) {
      if (this.route !== undefined && this.route !== null && this.route.method) {
        this.method = this.route.method;
        _tmpSegments.splice(0, 1);
        return this;
      }

      this.method = this.getControllerMethodByRequestMethod(requestMethod);
      return this;
    }
  }, {
    key: 'setParams',
    value: function setParams() {
      var namedParams = [];
      if (this.route !== undefined && this.route !== null && this.route.namedParams) {
        namedParams = this.route.namedParams;
      }
      if (_tmpSegments.length > 0) {
        this.params = {};
        for (var i in _tmpSegments) {
          var key = namedParams[i] ? namedParams[i] : i;
          this.params[key] = _tmpSegments[i];
        }
      }
      return this;
    }
  }, {
    key: 'getControllerMethodByRequestMethod',
    value: function getControllerMethodByRequestMethod(method) {
      if (CONTROLLER_METHODS[method]) {
        return CONTROLLER_METHODS[method];
      }
      return DEFAULT_CONTROLLER_METHOD;
    }
  }, {
    key: 'prepareModuleName',
    value: function prepareModuleName(moduleName) {
      return this.transformDashToCamelCase(moduleName);
    }
  }, {
    key: 'prepareControllerName',
    value: function prepareControllerName(controllerName) {
      return this.transformDashToCamelCase(controllerName) + 'Controller';
    }
  }, {
    key: 'prepareMethodName',
    value: function prepareMethodName(methodName) {
      return methodName;
    }
  }, {
    key: 'transformDashToCamelCase',
    value: function transformDashToCamelCase(string) {
      var str = string.split('-');

      for (var i in str) {
        if (str.hasOwnProperty(i)) {
          str[i] = _.capitalize(str[i]);
        }
      }
      return str.join('');
    }
  }]);

  return Router;
}();

module.exports = Router;
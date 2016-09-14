'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require('lodash');

var DEFAULT_CONTROLLER_NAME = 'IndexController';
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
    this.controller = DEFAULT_CONTROLLER_NAME;
    this.method = null;
    this.view = 'json';
    this.url = '';
    this.segments = [];
    this.path = '';
    this.params = undefined;

    this.setUrl(di.get('request').url).setPathFromUrl().setSegmentsFromPath().setRoute(di.get('routes'));

    if (this.isMethodAllowed()) {
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
      for (var route in routes) {
        var is = this.checkRoute(route, routes[route]);
        if (!is) {
          continue;
        }
      }
      return this;
    }
  }, {
    key: 'checkRoute',
    value: function checkRoute(route, routeObject) {
      if (route.indexOf('/') === 0) {
        route = route.replace('/', '');
      }
      var _routeSegments = route.split('/');
      var index = 0;
      var next = false;
      var found = false;
      var routesArray = [];
      var namedParams = {};

      if (_tmpSegments.length > _routeSegments.length) {
        return false;
      }

      for (var i in _tmpSegments) {
        var segment = _tmpSegments[i];
        var routeSegment = _routeSegments[index];

        if (next === true) {
          continue;
        }

        if (routeSegment.indexOf(':') !== -1) {
          var paramName = routeSegment.replace(':', '');
          var paramValue = segment;
          _tmpSegments.splice(index, 1);
          namedParams[paramName] = paramValue;
          index++;
          continue;
        }
        if (routeSegment !== segment) {
          next = true;
          found = false;
          continue;
        }
        routesArray[index] = segment;
        index++;
        if (index === _routeSegments.length) {
          found = true;
        }
      }
      if (found) {
        this.route = routeObject;
        this.route.namedParams = namedParams;
        this.params = namedParams;
      }
      return found;
    }
  }, {
    key: 'isMethodAllowed',
    value: function isMethodAllowed() {
      if (this.route === null) {
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
      if (_tmpSegments.length < 2) {
        return this;
      }
      var moduleName = null;

      if (this.route !== null) {
        if (this.route.module) {
          moduleName = this.route.module;
        } else {
          if (this.route.method === undefined) {
            moduleName = this.prepareModuleName(_tmpSegments[0]);
          }
        }
      }

      if (moduleName !== null && typeof modules[moduleName] === 'function') {
        this.module = modules[moduleName];
        _tmpSegments.splice(0, 1);
      }
      return this;
    }
  }, {
    key: 'setController',
    value: function setController() {
      if (this.route !== null && this.route.controller) {
        this.controller = this.prepareControllerName(this.route.controller);
        return this;
      }

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
      if (this.route !== null && this.route.namedParams) {
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
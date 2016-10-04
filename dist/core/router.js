'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function dashToCamelCase(string) {
  return string.split('-').map(function (item) {
    return (0, _lodash.capitalize)(item);
  }).join('');
}

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
  function Router(request, routes, modules, controllers) {
    _classCallCheck(this, Router);

    if ((typeof request === 'undefined' ? 'undefined' : _typeof(request)) !== 'object') {
      throw new Error('Router error: request is not an object');
    }
    if ((typeof controllers === 'undefined' ? 'undefined' : _typeof(controllers)) !== 'object') {
      throw new Error('Router error: should be at least 1 controller');
    }
    this.route = null;
    this.module = null;
    this.controller = DEFAULT_CONTROLLER_NAME;
    this.method = null;
    this.view = 'json';
    this.url = '';
    this.segments = [];
    this.path = '';
    this.params = undefined;

    this.setUrl(request.url).setPathFromUrl().setSegmentsFromPath().setRoute(routes);

    if (this.isMethodAllowed()) {
      this.setModule(modules).setController(controllers).setMethod(request.method);
    }
  }

  _createClass(Router, [{
    key: 'setUrl',
    value: function setUrl(requestUrl) {
      var url = requestUrl;
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
      this.segments = seg.filter(function (item) {
        return item !== '';
      });
      _tmpSegments = [].concat(_toConsumableArray(this.segments));
      return this;
    }
  }, {
    key: 'setRoute',
    value: function setRoute(routes) {
      if ((typeof routes === 'undefined' ? 'undefined' : _typeof(routes)) !== 'object') {
        return this;
      }
      if (_tmpSegments.length === 0 && routes['/'] !== undefined) {
        this.route = routes['/'];
        return this;
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(routes)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var route = _step.value;

          if (this.checkRoute(route, routes[route])) {
            break;
          }
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

      return this;
    }
  }, {
    key: 'checkRoute',
    value: function checkRoute(routeName, routeObject) {
      var route = routeName;
      if (route.indexOf('/') === 0) {
        route = route.replace('/', '');
      }
      var _routeSegments = route.split('/');
      var _segments = [].concat(_toConsumableArray(_tmpSegments));
      var index = 0;
      var next = false;
      var found = false;
      var routesArray = [];
      var namedParams = {};

      if (_tmpSegments.length > _routeSegments.length) {
        return false;
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = _segments[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var segment = _step2.value;

          var routeSegment = _routeSegments[index];
          if (next === true) {
            continue; // eslint-disable-line no-continue
          }

          if (routeSegment.indexOf(':') !== -1) {
            var paramName = routeSegment.replace(':', '');
            var paramValue = segment;
            _tmpSegments.splice(index, 1);
            namedParams[paramName] = paramValue;
            index += 1;
            if (index === _routeSegments.length) {
              found = true;
            }
            continue; // eslint-disable-line no-continue
          }
          if (routeSegment !== segment) {
            next = true;
            found = false;
            continue; // eslint-disable-line no-continue
          }
          routesArray[index] = segment;
          index += 1;
          if (index === _routeSegments.length) {
            found = true;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
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
        } else if (this.route.method === undefined) {
          moduleName = this.prepareModuleName(_tmpSegments[0]);
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
        this.prepareControllerName(this.route.controller);
        return this;
      }

      if (_tmpSegments.length > 0) {
        this.prepareControllerName(_tmpSegments[0]);
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

      this.method = CONTROLLER_METHODS[requestMethod] || DEFAULT_CONTROLLER_METHOD;
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
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = _tmpSegments[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var i = _step3.value;

            var key = namedParams[i] ? namedParams[i] : i;
            this.params[key] = _tmpSegments[i];
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      }
      return this;
    }
  }, {
    key: 'prepareModuleName',
    value: function prepareModuleName(moduleName) {
      // eslint-disable-line class-methods-use-this
      return dashToCamelCase(moduleName);
    }
  }, {
    key: 'prepareControllerName',
    value: function prepareControllerName(controllerName) {
      if (controllerName === undefined) {
        this.controller = DEFAULT_CONTROLLER_NAME;
      } else {
        this.controller = dashToCamelCase(controllerName) + 'Controller';
      }
      return this.controller;
    }
  }]);

  return Router;
}();

exports.default = Router;
'use strict';

const _ = require('lodash');

class Dispatcher {

  constructor(di) {
    this.DEFAULT_CONTROLLER_NAME = 'index';
    this.DEFAULT_CONTROLLER_METHOD = 'load';
    this.CONTROLLER_METHODS = {
      GET: 'load',
      POST: 'create',
      PUT: 'update',
      PATCH: 'update',
      DELETE: 'remove'
    };

    this.di = di;

    this.request = {};
    this.config = di.get('config');
    this.module = null;
    this.controller = null;
    this.method = null;
    this.params = undefined;
    this.path = '';
  }

  init() {
    this.routes = this.di.get('routes');
    this.request = this.di.get('request');

    this.urlSegments = this.parseUrl(this.request.url);

    return this.checkRouteAPI();
  }

  dispatch(modules, controllers) {
    try {
      if (this.module) {
        this.updateDi();

        let module = new modules[this.module]();

        let Ctrl = module.controllers[this.controller];
        let controller = new Ctrl(this.di);

        return controller.validate(this.method, this.params);
      }
      var ctrl;
      ctrl = new controllers[this.controller](this.di);
      return ctrl.validate(this.method, this.params);
    } catch (e) {
      throw new Error(e)
    }
  }

  updateDi() {
    this.di.set('route', {
      current: this.url,
      path: this.request.originalUrl.split('?').shift()
    });
  }

  parseUrl(url) {
    this.url = url;
    this.path = this.request.originalUrl.split('?').shift();

    var seg = this.path.split('/');
    var segments = [];
    for (var i in seg) {
      if (seg.hasOwnProperty(i)) {
        if (seg[i] !== '') {
          segments.push(seg[i]);
        }
      }
    }
    return segments;
  }

  checkRouteAPI() {
    this.currentRoute = this.getRouteByUrl();
    if (this.checkAllowedMethods(this.currentRoute)) {
      if (this.urlSegments[0] !== undefined) {
        if( this.urlSegments.length > 1){
          this.module = (this.currentRoute.module) ?
            this.currentRoute.module :
            this.prepareModuleName(this.urlSegments[0]);

          this.urlSegments.splice(0, 1);
        }
      }
      if (this.urlSegments[0] === undefined) {
        this.urlSegments[0] = this.DEFAULT_CONTROLLER_NAME;
      }

      this.controller = (this.currentRoute.controller) ?
        this.currentRoute.controller :
        this.prepareControllerName(this.urlSegments[0]);

      this.urlSegments.splice(0, 1);

      this.method = (this.currentRoute.method) ?
        this.currentRoute.method :
        this.prepareMethodName(
          this.getControllerMethodByRequestMethod(this.request)
        );

      this.params = this.getParamsByUrl();
    }
    return this;
  }

  getControllerMethodByRequestMethod(request) {
    if (this.CONTROLLER_METHODS[request.method]) {
      return this.CONTROLLER_METHODS[request.method];
    }
    return this.DEFAULT_CONTROLLER_METHOD;
  }

  getRouteByUrl() {
    var route = this.routes[this.path];

    if (route === undefined) {
      return {
        methods: null
      }
    }
    return route;
  }

  getParamsByUrl() {
    return this.urlSegments;
  }

  checkAllowedMethods(currentRoute) {
    if (!currentRoute.methods) {
      return true;
    }
    return (currentRoute.methods.indexOf(this.request.method) !== -1);
  }

  prepareModuleName(moduleName) {
    return this.transformDashToCamelCase(moduleName);
  }

  prepareControllerName(controllerName) {
    return this.transformDashToCamelCase(controllerName) + 'Controller';
  }

  prepareMethodName(methodName) {
    return methodName;
  }

  transformDashToCamelCase(string) {
    let str = string.split('-');

    for (var i in str) {
      if (str.hasOwnProperty(i)) {
        str[i] = _.capitalize(str[i]);
      }
    }
    return str.join('');
  }
}

module.exports = Dispatcher;

'use strict';

const _ = require('lodash');

const Router = require('./router.js');

class Dispatcher {

  constructor(di, request, response) {
    this.di = new DI().merge(di);


    this.router = Router.process(request, di.get('routes'));
    console.log("Router: ", this.router);
    this.request = request;
    this.config = di.get('config');
    this.module = null;
    this.controller = null;
    this.method = null;
    this.params = undefined;
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


  getControllerMethodByRequestMethod(request) {
    if (this.CONTROLLER_METHODS[request.method]) {
      return this.CONTROLLER_METHODS[request.method];
    }
    return this.DEFAULT_CONTROLLER_METHOD;
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

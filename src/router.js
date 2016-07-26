'use strict';
const _ = require('lodash');

const DEFAULT_CONTROLLER_NAME = 'index';
const DEFAULT_CONTROLLER_METHOD = 'load';
const CONTROLLER_METHODS = {
  GET: 'load',
  POST: 'create',
  PUT: 'update',
  PATCH: 'update',
  DELETE: 'remove'
};

let _tmpSegments = [];

class Router {

  constructor(di){
    this.route = null;
    this.module = null;
    this.controller = null;
    this.method = null;
    this.view = 'json';
    this.url = '';
    this.segments = [];
    this.path = '';
    this.params = undefined;

    this.setUrl(di.get('request').url)
        .setPathFromUrl()
        .setSegmentsFromPath()
        .setRoute(di.get('routes'));

    if(this.checkAllowedMethods()){
      this.setModule(di.get('modules'))
          .setController(di.get('controllers'))
          .setMethod(di.get('request').method)
          .setParams();
      }
  }

  setUrl(url){
    if(url.indexOf('.json') !== -1){
      this.view = 'json';
      url = url.replace('.json', '');
    }
    if(url.indexOf('.xml') !== -1){
      this.view = 'xml';
      url = url.replace('.xml', '');
    }

    this.url = url;
    return this;
  }

  setPathFromUrl(){
    this.path = this.url.split('?').shift();
    return this;
  }

  setSegmentsFromPath() {
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
    _tmpSegments = segments.map(segment => (segment));
    return this;
  }

  setRoute(routes){
    if(_tmpSegments.length === 0 && routes['/'] !== undefined){
      this.route = routes['/'];
      return this;
    }

    let routesArray = [];
    let namedParams = [];
    for( let routePath in routes){
      let r = routePath.split('/');
      for( let i in r){
        if(r[i] == ''){
          continue;
        }
        if( routesArray[routePath] === undefined){
          routesArray[routePath] = [];
        }
        routesArray[routePath].push(r[i]);
      }
    }
    for( let routePath in routesArray){
      for(let i in routesArray[routePath]){
        let routeSegment = routesArray[routePath][i];
        if(routeSegment.indexOf(':') !== -1){
          namedParams.push(routeSegment.replace(':', '') );
          continue;
        }
        if(_tmpSegments[i] !== routeSegment){
          break;
        }
        this.route = routes[routePath];
      }
      if(this.route !== undefined && this.route !== null){
        this.route.namedParams = namedParams;
        return this;
      }
    }
    return this;
  }

  checkAllowedMethods() {
    if(this.route === undefined){
      return true;
    }
    if (!this.route.methods) {
      return true;
    }
    return (this.route.methods.indexOf(this.request.method) !== -1);
  }

  setModule(modules){
    if(this.route !== undefined && this.route.module){
      this.module = this.route.module;
      return this;
    }

    if(_tmpSegments.length < 2){
      return this;
    }

    let moduleName = this.prepareModuleName(_tmpSegments[0]);
    if(typeof modules[moduleName] === 'function'){
      this.module = modules[moduleName];
      _tmpSegments.splice(0, 1);
    }
    return this;
  }

  setController(){
    if(this.route !== undefined && this.route.controller){
      this.controller = this.route.controller;
      return this;
    }

    this.controller = DEFAULT_CONTROLLER_NAME
    if(_tmpSegments.length > 0){
      this.controller = this.prepareControllerName(_tmpSegments[0]);
      _tmpSegments.splice(0, 1);
    }
    return this;
  }

  setMethod(requestMethod){
    if(this.route !== undefined && this.route.method){
      this.method = this.route.method;
      _tmpSegments.splice(0, 1);
      return this;
    }

    this.method = this.getControllerMethodByRequestMethod(requestMethod);
    return this;
  }

  setParams(){
    let namedParams = [];
    if(this.route !== undefined && this.route.namedParams){
      namedParams = this.route.namedParams;
    }
    if(_tmpSegments.length > 0){
      this.params = {};
      for( let i in _tmpSegments){
        let key = (namedParams[i]) ? namedParams[i] : i;
        this.params[key] = _tmpSegments[i];
      }
    }
    return this;
  }


  getControllerMethodByRequestMethod(method) {
    if (CONTROLLER_METHODS[method]) {
      return CONTROLLER_METHODS[method];
    }
    return DEFAULT_CONTROLLER_METHOD;
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

module.exports = Router;

'use strict';
const _ = require('lodash');

const DEFAULT_CONTROLLER_NAME = 'IndexController';
const DEFAULT_CONTROLLER_METHOD = 'load';
const CONTROLLER_METHODS = {
  GET: 'load',
  POST: 'create',
  PUT: 'update',
  PATCH: 'update',
  DELETE: 'del',
  HEAD: 'status'
};

let _tmpSegments = [];

class Router {

  constructor(di){
    this.route = null;
    this.module = null;
    this.controller = DEFAULT_CONTROLLER_NAME;
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

    if(this.isMethodAllowed()){
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
    for( let route in routes){
      const is = this.checkRoute(route, routes[route]);
      if(!is){
        continue;
      }
    }
    return this;
  }

  checkRoute(route, routeObject){

    if(route.indexOf('/') === 0){
      route = route.replace('/', '');
    }
    let _routeSegments = route.split('/');
    let index = 0;
    let next = false;
    let found = false;
    let routesArray = [];
    let namedParams = {};

    if(_tmpSegments.length > _routeSegments.length){
      return false;
    }

    for( let i in _tmpSegments){
      const segment = _tmpSegments[i];
      const routeSegment = _routeSegments[index];

      if(next === true){
        continue;
      }

      if(routeSegment.indexOf(':') !== -1){
        let paramName = routeSegment.replace(':', '');
        let paramValue = _tmpSegments[index];
        _tmpSegments.splice(index, 1);
        namedParams[paramName] = paramValue;
        index++;
        continue;
      }
      if(routeSegment !== _tmpSegments[index]) {
        next = true;
        found = false;
        continue;
      }
      found = true;
      routesArray[index] = _tmpSegments[index];
      index++;
    }
    console.log('found', found);
    if(found){
      this.route = routeObject;
      this.route.namedParams = namedParams;
      this.params = namedParams;
    }
    return found;
  }

  isMethodAllowed() {
    if(this.route === null){
      return true;
    }
    if (!this.route.methods) {
      return true;
    }
    return (this.route.methods.indexOf(this.request.method) !== -1);
  }

  setModule(modules){
    if(_tmpSegments.length < 2){
      return this;
    }
    let moduleName = null;

    if(this.route !== null){
      if( this.route.module){
        moduleName = this.route.module;
      }else{
        if(this.route.method === undefined){
          moduleName = this.prepareModuleName(_tmpSegments[0]);
        }
      }
    }

    if(moduleName !== null && typeof modules[moduleName] === 'function'){
      this.module = modules[moduleName];
      _tmpSegments.splice(0, 1);
    }
    return this;
  }

  setController(){
    if((this.route !== null)  && this.route.controller){
      this.controller = this.prepareControllerName(this.route.controller);
      return this;
    }

    if(_tmpSegments.length > 0){
      this.controller = this.prepareControllerName(_tmpSegments[0]);
      _tmpSegments.splice(0, 1);
    }
    return this;
  }

  setMethod(requestMethod){
    if((this.route !== undefined && this.route !== null)  && this.route.method){
      this.method = this.route.method;
      _tmpSegments.splice(0, 1);
      return this;
    }

    this.method = this.getControllerMethodByRequestMethod(requestMethod);
    return this;
  }

  setParams(){
    let namedParams = [];
    if((this.route !== null)  && this.route.namedParams){
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

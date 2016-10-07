import { capitalize } from 'lodash';

function dashToCamelCase(string) {
  return string
    .split('-')
    .map(item => capitalize(item))
    .join('');
}

const DEFAULT_CONTROLLER_NAME = 'IndexController';
const DEFAULT_CONTROLLER_METHOD = 'load';
const CONTROLLER_METHODS = {
  GET: 'load',
  POST: 'create',
  PUT: 'update',
  PATCH: 'update',
  DELETE: 'del',
  HEAD: 'status',
};
let _modules = null;
let _routes = null;

class Router {

  constructor(request, routes, modules) {
    if (typeof request !== 'object') {
      throw new Error('Router error: request is not an object');
    }
    _modules = modules;
    _routes = routes;

    this.route = null;
    this.module = null;
    this.controller = DEFAULT_CONTROLLER_NAME;
    this.method = null;
    this.requestMethod = request.method;
    this.requestUrl = request.url;
    this.view = 'json';
    this.url = '';
    this.segments = [];
    this.path = '';
    this.params = undefined;
    this.tmpSegments = [];
  }

  init() {
    this.setUrl()
        .setPathFromUrl()
        .setSegmentsFromPath()
        .setRoute();
    if (this.isMethodAllowed()) {
      this.setModule()
          .setController()
          .setMethod();
    }
    return this;
  }

  setUrl() {
    let url = this.requestUrl;
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

  setPathFromUrl() {
    this.path = this.url.split('?').shift();
    return this;
  }

  setSegmentsFromPath() {
    const seg = this.path.split('/');
    this.segments = seg.filter(item => item !== '');
    this.tmpSegments = [...this.segments];
    return this;
  }

  setRoute() {
    if (typeof _routes !== 'object') {
      return this;
    }
    if (this.tmpSegments.length === 0 && _routes['/'] !== undefined) {
      this.route = _routes['/'];
      return this;
    }

    for (const route of Object.keys(_routes)) {
      if (this.checkRoute(route)) {
        this.route = _routes[route];
        break;
      }
    }
    return this;
  }

  checkRoute(routeUrl) {
    let route = routeUrl;
    let index = 0;
    let found = true;

    if (route.indexOf('/') === 0) {
      route = route.replace('/', '');
    }

    const { routeSegments, urlSegments } = this.getNamedParams(
      route.split('/').filter(item => item !== ''),
      [...this.tmpSegments]
    );
    if (routeSegments.length !== urlSegments.length) {
      return false;
    }

    for (const segment of routeSegments) {
      if (segment !== urlSegments[index]) {
        found = false;
        break;
      }
      index += 1;
    }
    return found;
  }

  getNamedParams(routeSegments, urlSegments) {
    const iterator = [...routeSegments];
    let index = 0;
    let isRequred = true;
    for (let segment of iterator) {
      isRequred = true;
      if (segment.indexOf(':') !== -1) {
        if (segment.indexOf('?') !== -1) {
          segment = segment.replace('?', '');
          isRequred = false;
        }
        const name = segment.replace(':', '');
        const value = urlSegments[index];

        if (value === undefined && isRequred === false) {
          routeSegments.splice(index, 1);
          continue; // eslint-disable-line no-continue
        } else if (value === undefined && isRequred === true) {
          break;
        }
        if (this.params === undefined) {
          this.params = {};
        }
        this.params[name] = value;
        routeSegments.splice(index, 1);
        urlSegments.splice(index, 1);
      }
      index += 1;
    }
    return {
      routeSegments,
      urlSegments
    };
  }

  isMethodAllowed() {
    if (this.route === null) {
      return true;
    }
    if (!this.route.methods) {
      return true;
    }
    return (this.route.methods.indexOf(this.requestMethod) !== -1);
  }

  setModule() {
    if (this.tmpSegments.length < 2) {
      return this;
    }
    let moduleName = null;

    if (this.route !== null) {
      if (this.route.module) {
        moduleName = this.route.module;
      } else if (this.route.method === undefined) {
        moduleName = this.prepareModuleName(this.tmpSegments[0]);
      }
    }

    if (moduleName !== null && typeof _modules[moduleName] === 'function') {
      this.module = _modules[moduleName];
      this.tmpSegments.splice(0, 1);
    }
    return this;
  }

  setController() {
    if (this.route !== null && this.route.controller) {
      this.prepareControllerName(this.route.controller);
      return this;
    }

    if (this.tmpSegments.length > 0) {
      this.prepareControllerName(this.tmpSegments[0]);
      this.tmpSegments.splice(0, 1);
    }
    return this;
  }

  setMethod() {
    if (this.route !== null && this.route.method) {
      this.method = this.route.method;
      this.tmpSegments.splice(0, 1);
      return this;
    }

    this.method = (CONTROLLER_METHODS[this.requestMethod] || DEFAULT_CONTROLLER_METHOD);
    return this;
  }

  prepareModuleName(moduleName) { // eslint-disable-line class-methods-use-this
    return dashToCamelCase(moduleName);
  }

  prepareControllerName(controllerName) {
    this.controller = (controllerName === undefined)
       ? DEFAULT_CONTROLLER_NAME
       : `${dashToCamelCase(controllerName)}Controller`;

    return this.controller;
  }
}

export default Router;

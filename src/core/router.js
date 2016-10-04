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

let _tmpSegments = [];

class Router {

  constructor(request, routes, modules, controllers) {
    if (typeof request !== 'object') {
      throw new Error('Router error: request is not an object');
    }
    if (typeof controllers !== 'object') {
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

    this.setUrl(request.url)
        .setPathFromUrl()
        .setSegmentsFromPath()
        .setRoute(routes);

    if (this.isMethodAllowed()) {
      this.setModule(modules)
          .setController(controllers)
          .setMethod(request.method);
    }
  }

  setUrl(requestUrl) {
    let url = requestUrl;
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
    _tmpSegments = [...this.segments];
    return this;
  }

  setRoute(routes) {
    if (typeof routes !== 'object') {
      return this;
    }
    if (_tmpSegments.length === 0 && routes['/'] !== undefined) {
      this.route = routes['/'];
      return this;
    }

    for (const route of Object.keys(routes)) {
      if (this.checkRoute(route, routes[route])) {
        break;
      }
    }
    return this;
  }

  checkRoute(routeName, routeObject) {
    let route = routeName;
    if (route.indexOf('/') === 0) {
      route = route.replace('/', '');
    }
    const _routeSegments = route.split('/');
    const _segments = [..._tmpSegments];
    let index = 0;
    let next = false;
    let found = false;
    const routesArray = [];
    const namedParams = {};

    if (_tmpSegments.length > _routeSegments.length) {
      return false;
    }

    for (const segment of _segments) {
      const routeSegment = _routeSegments[index];
      if (next === true) {
        continue; // eslint-disable-line no-continue
      }

      if (routeSegment.indexOf(':') !== -1) {
        const paramName = routeSegment.replace(':', '');
        const paramValue = segment;
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
    if (found) {
      this.route = routeObject;
      this.route.namedParams = namedParams;
      this.params = namedParams;
    }
    return found;
  }

  isMethodAllowed() {
    if (this.route === null) {
      return true;
    }
    if (!this.route.methods) {
      return true;
    }
    return (this.route.methods.indexOf(this.request.method) !== -1);
  }

  setModule(modules) {
    if (_tmpSegments.length < 2) {
      return this;
    }
    let moduleName = null;

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

  setController() {
    if ((this.route !== null) && this.route.controller) {
      this.prepareControllerName(this.route.controller);
      return this;
    }

    if (_tmpSegments.length > 0) {
      this.prepareControllerName(_tmpSegments[0]);
      _tmpSegments.splice(0, 1);
    }
    return this;
  }

  setMethod(requestMethod) {
    if ((this.route !== undefined && this.route !== null) && this.route.method) {
      this.method = this.route.method;
      _tmpSegments.splice(0, 1);
      return this;
    }

    this.method = (CONTROLLER_METHODS[requestMethod] || DEFAULT_CONTROLLER_METHOD);
    return this;
  }

  setParams() {
    let namedParams = [];
    if ((this.route !== null) && this.route.namedParams) {
      namedParams = this.route.namedParams;
    }
    if (_tmpSegments.length > 0) {
      this.params = {};
      for (const i of _tmpSegments) {
        const key = (namedParams[i]) ? namedParams[i] : i;
        this.params[key] = _tmpSegments[i];
      }
    }
    return this;
  }

  prepareModuleName(moduleName) { // eslint-disable-line class-methods-use-this
    return dashToCamelCase(moduleName);
  }

  prepareControllerName(controllerName) {
    if (controllerName === undefined) {
      this.controller = DEFAULT_CONTROLLER_NAME;
    } else {
      this.controller = `${dashToCamelCase(controllerName)}Controller`;
    }
    return this.controller;
  }
}

export default Router;

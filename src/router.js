'use strict';

const DEFAULT_CONTROLLER_NAME = 'index';
const DEFAULT_CONTROLLER_METHOD = 'load';
const CONTROLLER_METHODS = {
  GET: 'load',
  POST: 'create',
  PUT: 'update',
  PATCH: 'update',
  DELETE: 'remove'
};

class Router {

  process(request, routes){
    const url = request.url;
    const path = this.getPathFromUrl(url);
    const segments = this.getSegmentsFromPath(path);
    const route = this.getRouteByPath(path, routes)
    const module = this.getModule()
    
    console.log(route);
  }

  getPathFromUrl(url){
    return url.split('?').shift();
  }

  getSegmentsFromPath(path) {
    var seg = path.split('/');
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

  getRouteByPath(path, routes){
    return routes[path];
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
}

module.exports = new Router();

import DI from './core/di';
import Validator from './core/validator';
import Responder from './core/responder';

const express = require('express');
const bodyParser = require('body-parser');

const defaultConfig = require('./core/config.js');
const DbAdapter = require('./core/db.adapter.js');

class Airborne {
  constructor(config) {
    if (typeof config !== 'object') {
      throw new Error('[Fatal] Engine error: config is not an object. Failed to start');
    }
    this.di = new DI();
    this.config = Object.assign({}, defaultConfig, config);
    this.di.set('config', this.config);
    this.multipartParser = null;

    if (this.di.get('config').db) {
      this.database(this.di.get('config').db);
    }
  }

  services(services) {
    this.di.set('services', services);
    return this;
  }

  controllers(controllers) {
    this.di.set('controllers', controllers);
    return this;
  }

  modules(modules) {
    this.di.set('modules', modules);
    return this;
  }

  routes(routes) {
    this.di.set('routes', routes);
    return this;
  }

  validator(validator) {
    if (validator === true) {
      this.di.set('validator', Validator);
    }
    return this;
  }

  database(dbConfig) {
    this.di.set('db', new DbAdapter(dbConfig));
    return this;
  }

  start() {
    this.express = express();

    const RouterObj = express.Router;
    const router = new RouterObj({
      mergeParams: true
    });
    console.log('ROUTER', router);

    this.express.use(bodyParser.json({ limit: '100mb' }));
    this.express.use(bodyParser.urlencoded({ extended: true, limit: '100mb', parameterLimit: 1000000 }));
    const routes = this.di.get('routes');

    this.express.use((req, res, next) => {
      this.di.set('request', req);
      this.di.set('response', res);
      this.di.set('method', req.method);
      this.responder = new Responder(this.di.get('config'));
      this.di.set('responder', this.responder);
      next();
    });

    this.routeHandle(router, routes);
    this.middlewaresHandle(router);
    this.sendToHandler(router);

    this.express.use('/', router);
    this.express.use((request, response, next) => { // eslint-disable-line
      const responder = this.di.get('responder').setServerResponse(response);
      responder.sendError('Route not found', 404);
    });

    this.express.use((error, request, response, next) => { // eslint-disable-line
      const responder = this.di.get('responder').setServerResponse(response);
      responder.sendError(error, 500);
    });

    const server = this.express.listen(
      this.config.port,
      this.config.host,
      () => {
        console.log(`Server running at ${server.address().address}:${server.address().port}`);
      });
  }

  handle(Controller, method, request, response, params) {
    if (request.headers['content-type'] !== undefined && request.headers['content-type']
    .indexOf('multipart/form-data') !== -1) {
      return this.handleMultipart(Controller, method, request, response, params);
    } else { // eslint-disable-line
      return this.handleSimple(Controller, method, request, response, params);
    }
  }

  handleMultipart(Controller, method, request, response, params) {
    try {
      if (this.multipartParser === null) {
        require.resolve('formidable');
        this.multipartParser = require('formidable');
      }
      const form = new this.multipartParser.IncomingForm();
      form.parse(request, (err, fields, files) => {
        const req = request;
        req.body = this.mergeFilesInFields(request.body, fields, files);
        return this.handleSimple(Controller, method, request, response, params);
      });
    } catch (err) {
      console.log('e', err);
      const responder = this.di.get('responder').setServerResponse(response);
      responder.sendError({ message: 'Error parsing multipart/form-data', stack: err }, 500);
      throw Error('formidable module is not found. It is used to parse multipart form-data. Install: npm i --save formidable');
    }
  }

  handleSimple(Controller, method, request, response, params) {
    console.log('CONTROLLER', Controller);
    if (typeof request !== 'object') {
      throw new Error('[Fatal] Application handle: request is not an object');
    }
    if (typeof response !== 'object') {
      throw new Error('[Fatal] Application handle: response is not an object');
    }
    if (typeof params !== 'object') {
      throw new Error('[Fatal], Application handle: params is not an object');
    }

    const ctrl = new Controller(this.di);
    return ctrl.validate(method, params)
      .then((data) => {
        console.log('DATA', data);
        if (data !== null) {
          this.createResponse(data, response);
        }
      })
      .catch((err) => {
        const responder = this.di.get('responder').setServerResponse(response);
        responder.sendError(`[Error] Controller Initializing: ${err}`, 500);
      });
  }

  createResponse(data, response) {
    const responder = this.di.get('responder');
    responder.setServerResponse(response);
    responder.send(data);
  }

  mergeFilesInFields(body, fields, files) { // eslint-disable-line
    const newBody = body;
    for (const name in files) { // eslint-disable-line
      newBody[name] = files[name];
    }
    for (const name in fields) { // eslint-disable-line
      newBody[name] = fields[name];
    }
    return newBody;
  }

  routeHandle(router, routes) { // eslint-disable-line
    console.log('ROUTERR', router);
    for (let route in routes) { // eslint-disable-line
      for (let method in routes[route]) { // eslint-disable-line
        console.log('METHOD', method);
        router[method](route, (request, response, next) => { // eslint-disable-line
          const routeSettings = routes[route][method];
          const handlerMethod = routeSettings.method;
          const originalRoute = route;
          const routeHandler = routeSettings.handler;
          const params = request.params;
          let middlewares = null;
          if (routeSettings.middleware !== undefined && routeSettings.middleware.length !== 0) {
            middlewares = routeSettings.middleware;
          }
          if (routeSettings.method === undefined) {
            routeSettings.method = 'get';
          }
          if (routeSettings.handler === undefined || routeSettings.handler === null) {
            const responder = this.di.get('responder').setServerResponse(response);
            responder.sendError('[Fatal] routes config: handler method required', 500);
            // throw Error('[Fatal] routes config: handler method required');
          }
          next({
            route: originalRoute,
            method: handlerMethod,
            handler: routeHandler,
            params: params,
            middlewares: middlewares
          });
        });
      }
    }
  }

  middlewaresHandle(router) {
    router.use((settings, request, response, next) => {
      try {
        if (settings.middlewares !== undefined && settings.middlewares !== null) {
          settings.middlewares.reduce((promise, Middleware) => promise
        .then(() => new Middleware(this.di).init()), Promise.resolve())
          .then(() => next(settings));
        } else {
          next(settings);
        }
      } catch (err) {
        throw Error(err);
      }
    });
  }

  sendToHandler(router) {
    router.use((settings, request, response, next) => { // eslint-disable-line
      if (settings.handler !== undefined) {
        return this.handle(settings.handler, settings.method, request, response, settings.params);
      }
    });
  }
}

export default Airborne;

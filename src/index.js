import DI from './core/di';
import Validator from './core/validator';
import AuthMiddleware from './core/auth.middleware';
import Responder from './core/responder';

const lib = require('./lib');
const express = require('express');
const bodyParser = require('body-parser');
// const util = require('util');

const defaultConfig = require('./core/config.js');
const DbAdapter = require('./core/db.adapter.js');

class Airborne {
  constructor(config) {
    if (typeof config !== 'object') {
      throw new Error('Fatal: Engine error: config is not an object. Failed to start');
    }
    this.instances = [];
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

    this.express.use(bodyParser.json({ limit: '100mb' }));
    this.express.use(bodyParser.urlencoded({ extended: true, limit: '100mb', parameterLimit: 1000000 }));

    /* istanbul ignore next */
    const routes = this.di.get('routes');

    this.express.use((req, res, next) => {
      this.di.set('request', req);
      this.di.set('response', res);
      this.di.set('method', req.method);
      this.responder = new Responder(this.di.get('config'));
      this.di.set('responder', this.responder);
      next();
    });

    for (let route in routes) { // eslint-disable-line
      for (let method in routes[route]) { // eslint-disable-line
        router[method](route, async(request, response, next) => { // eslint-disable-line
          const routeSettings = routes[route][method];
          if (routeSettings.auth) {
            if (!await new AuthMiddleware(this.di).initAuth()) {
              return;
            }
          }
          if (routeSettings.method === undefined) {
            routeSettings.method = 'get';
          }
          if (routeSettings.handler === undefined) {
            throw new Error('[Fatal] routes config: handler method required');
          }
          this.handle(routeSettings.handler, routeSettings.method, request, response);
        });
      }
    }

    this.express.use('/', router);
    this.express.use(function (request, response, next) { // eslint-disable-line
      response.send(404, { status: 404, message: 'Route not found' });
    });

    /* istanbul ignore next */
    const server = this.express.listen(
      this.config.port,
      this.config.host,
      () => {
        console.log(`Server running at ${server.address().address}:${server.address().port}`);
      });
  }

  handle(Controller, method, request, response) {
    if (request.headers['content-type'] !== undefined && request.headers['content-type']
    .indexOf('multipart/form-data') !== -1) {
      return this.handleMultipart(Controller, method, request, response);
    } else { // eslint-disable-line
      return this.handleSimple(Controller, method, request, response);
    }
  }

  handleMultipart(Controller, method, request, response) {
    try {
      if (this.multipartParser === null) {
        require.resolve('formidable');
        this.multipartParser = require('formidable');
      }
      const form = new this.multipartParser.IncomingForm();
      form.parse(request, (err, fields, files) => {
        const req = request;
        req.body = this.mergeFilesInFields(request.body, fields, files);
        return this.handleSimple(Controller, method, request, response);
      });
    } catch (err) {
      console.error('formidable module is not found. It is used to parse multipart form-data. Install: npm i --save formidable');
      console.log('e', err);
      response.send('Error parsing multipart/form-data');
    }
  }

  handleSimple(Controller, method, request, response) {
    if (typeof request !== 'object') {
      throw new Error('[Fatal] Application handle: request is not an object');
    }
    if (typeof response !== 'object') {
      throw new Error('[Fatal] Application handle: response is not an object');
    }
    const ctrl = new Controller(this.di);
    return ctrl.validate(method, request.params)
      .then((data) => {
        console.log('res from handle', data);
        this.createResponse(data, response);
      })
      .catch(err => response.send(err));
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
  setInstance(dispatcher) { // eslint-disable-line class-methods-use-this
    this.instances.push(dispatcher);
  }
}
lib.Engine = Airborne;

export default lib;

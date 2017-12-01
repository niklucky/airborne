import DI from './core/di';
import Validator from './core/validator';
// import Dispatcher from './core/dispatcher';
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
      mergeParams: true,
    });

    this.express.use(bodyParser.json({ limit: '100mb' }));
    this.express.use(bodyParser.urlencoded({ extended: true, limit: '100mb', parameterLimit: 1000000 }));

    /* istanbul ignore next */
    // router.use(this.handleRoute);
    const routes = this.di.get('routes');

    // console.log(routes);
    // for (const i in routes) {
    //   console.log('I', routes[i]);
    //   for (const g in routes[i]) {
    //     console.log('G', routes[i][g]);
    //   }
    // }
    // router.get('/users', (req, res, next) => res.send('fsfdsf'))
    
    for (let i in routes) { //eslint-disable-line
      // console.log('ROUTE I', i)
      // route = { url, httpMethod, handler}
      for (let g in routes[i]) {
        console.log('MTHODS', i);
        router[g](i, (request, response) => {
          if (request.headers['content-type'] !== undefined && request.headers['content-type']
          .indexOf('multipart/form-data') !== -1) {
            this.handleMultipart(routes[i][g].handler, routes[i][g].method, request, response);
          } else {
            this.handle(routes[i][g].handler, routes[i][g].method, request, response);
          }
        });
      }

    }
    /* istanbul ignore next */
    // router.use((err, req, res) => {
    //   console.log('Error catched: ', err);
    //   res.send('Error');
    // });

    this.express.use('/', router);

    /* istanbul ignore next */
    const server = this.express.listen(
      this.config.port,
      this.config.host,
      () => {
        console.log(`Server running at ${server.address().address}:${server.address().port}`);
      });
  }

  handleMultipart(request, response) {
    try {
      if (this.multipartParser === null) {
        require.resolve('formidable');
        this.multipartParser = require('formidable');
      }
      const form = new this.multipartParser.IncomingForm();
      form.parse(request, (err, fields, files) => {
        const req = request;
        req.body = this.mergeFilesInFields(request.body, fields, files);
        this.handle(req, response);
      });
    } catch (e) {
      console.error('formidable module is not found. It is used to parse multipart form-data. Install: npm i --save formidable');
      console.log('e', e);
      response.send('Error parsing multipart/form-data');
    }
  }

  handle(Controller, method, request, response) {
    console.log(Controller);
    if (typeof request !== 'object') {
      throw new Error('[Fatal] Application handle: request is not an object');
    }
    if (typeof response !== 'object') {
      throw new Error('[Fatal] Application handle: response is not an object');
    }
    this.di.set('request', request);
    this.di.set('response', response);
    this.responder = new Responder(this.config);
    this.responder.setServerResponse(this.di.get('response'));

    this.di.set('responder', this.responder);
    const ctrl = new Controller(this.di);
    console.log(request.params);
    return this.responder.send(ctrl.validate(method, request.params));
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

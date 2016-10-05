import DI from './core/di';
import Validator from './core/validator';
import Dispatcher from './core/dispatcher';

const lib = require('./lib');
const express = require('express');
const bodyParser = require('body-parser');

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

    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: true }));

    /* istanbul ignore next */
    router.use((request, response) => {
      if (request.url.indexOf('favicon') !== -1) {
        response.send();
        return;
      }

      this.handle(request, response);
    });

    /* istanbul ignore next */
    router.use((err, req, res) => {
      console.log('Error catched: ', err);
      res.send('Error');
    });

    this.express.use('/', router);

    const server = this.express.listen(
      this.config.port,
      this.config.host,
      () => {
        console.log(`Server running at ${
          server.address().address}:${
          server.address().port}`);
      });
  }

  handle(request, response) {
    if (typeof request !== 'object') {
      throw new Error('[Fatal] Application handle: request is not an object');
    }
    if (typeof response !== 'object') {
      throw new Error('[Fatal] Application handle: response is not an object');
    }
    this.setInstance(
      new Dispatcher(this.di, request, response)
    );
  }

  setInstance(dispatcher) { // eslint-disable-line class-methods-use-this
    this.instances.push(dispatcher);
  }
}
lib.Engine = Airborne;

export default lib;

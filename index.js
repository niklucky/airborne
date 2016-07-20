'use strict';
const lib = require('./lib');

const express = require('express');
const bodyParser = require('body-parser');

const Config = require('./src/config.js');
const DI = require('./src/di.js');
const Dispatcher = require('./src/dispatcher.js');
const DbAdapter = require('./src/db.adapter.js');

let _instances = [];

class Airborne {
  constructor(userConfig) {
    this.di = new DI();
    this.config = new Config(userConfig).get();
    this.di.set('config', this.config);

    if (this.di.get('config').db) {
      this.registerDatabase(this.di.get('config').db);
    }
  }

  registerServices(services) {
    this.di.set('services', services);
    return this;
  }

  registerControllers(controllers) {
    this.di.set('controllers', controllers);
    return this;
  }

  registerModules(modules) {
    this.di.set('modules', modules);
    return this;
  }

  registerRoutes(routes) {
    this.di.set('routes', routes);
    return this;
  }

  registerValidator(validator){
    this.di.set('Validator', validator);
    return this;
  }

  registerDatabase(dbConfig){
    this.di.set('db', new DbAdapter(dbConfig));
    return this;
  }

  start() {
    this.express = express();

    var RouterObj = express.Router;
    var router = new RouterObj({
      mergeParams: true
    });

    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({extended: true}));

    router.use((request, response, next) => {
      if (request.url.indexOf('favicon') !== -1) {
        response.send();
        return;
      }

      this.handle(request, response);
    });

    router.use((err, req, res, next) => {
      console.log('Error catched: ', err);
      this.response.sendError(err);
    });

    this.express.use('/', router);

    var server = this.express.listen(
      this.config.port,
      this.config.host,
      function() {
        console.log('Server running at ' +
          server.address().address + ':' +
          server.address().port)
      })
  }

  handle(request, response) {
    this.setInstance(
      new Dispatcher(this.di, request, response)
    )
    let routerResult = this.dispatcher.init();
    if (routerResult.currentRoute.auth) {
      return this.initAuth();
    }
    return this.dispatch();
  }

  setInstance(dispatcher){
    _instances.push(dispatcher);
  }

  initAuth() {
    var AuthLibrary = this.di.get('services').Authorization;
    if (AuthLibrary === undefined) {
      throw Error('Auth library not initialized');
    }
    new AuthLibrary(this.di).init()
      .then(authData => {
        if (!authData.status) {
          throw Error('Not authorized');
        }

        this.authData = authData;
        this.di.set('authData', authData);
        this.dispatch();
      })
      .catch(authData => {
        this.response.sendError(authData);
      });
  }

  dispatch() {
    var result = this.dispatcher.dispatch(this.modules, this.controllers);

    if (result) {
      if (result.then) {
        result.then(data => {
          this.send(data)
        })
          .catch(data => {
            this.response.sendError(data)
          });
        return true;
      }
    }
    return this.send(result)
  }

  send(data) {
    this.response.send(data);
  }
}
lib.Airborne = Airborne;

module.exports = lib;

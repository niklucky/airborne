'use strict';

const BaseController = require('./lib/base.controller');
const BaseService = require('./lib/base.service');
const BaseMapper = require('./lib/base.mapper');
const BaseModel = require('./lib/base.model');

const HATEOASDecorator = require('./lib/hateoas.decorator');

const HTTPMapper = require('./lib/http.mapper');
const MySQLMapper = require('./lib/mysql.mapper');
const MySQLQueryBuilder = require('./lib/mysql.query.builder');
const RedisMapper = require('./lib/redis.mapper');

const Validator = require('./lib/validator');


const express = require('express');
const bodyParser = require('body-parser');
const config = require('./lib/config.js');

const DbAdapter = require('./lib/db.adapter');

const DI = require('./lib/di.js');
const Responder = require('./lib/responder.js');
const Dispatcher = require('./lib/dispatcher.js');

class Airborne {
  constructor(userConfig) {
    this.config = this.mergeConfig(config, userConfig);
    this.di = new DI();
    this.response = new Responder(this.config);

    this.di.set('routes', {});
    this.di.set('config', this.config);
    this.di.set('response', this.response);

    if (this.config.db) {
      this.db = new DbAdapter(this.config.db);
      this.di.set('db', this.db);
    }
    this.dispatcher = new Dispatcher(this.di);
  }

  registerServices(services) {
    this.services = services;
    this.di.set('services', services);
    return this;
  }

  registerControllers(controllers) {
    this.controllers = controllers;
    return this;
  }

  registerModules(modules) {
    this.modules = modules;
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

      this.di.set('request', request);

      this.response.setServerResponse(response);

      this.handle();
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

  handle() {
    let routerResult = this.dispatcher.init();
    if (routerResult.currentRoute.auth) {
      return this.initAuth();
    }
    return this.dispatch();
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

  mergeConfig(config, userConfig) {
    for (var i in userConfig) {
      if (userConfig.hasOwnProperty(i)) {
        config[i] = userConfig[i];
      }
    }
    return config;
  }

}

module.exports = {
  Airborne,
  BaseController,
  BaseService,
  BaseMapper,
  BaseModel,
  HATEOASDecorator,
  HTTPMapper,
  MySQLMapper,
  MySQLQueryBuilder,
  RedisMapper,
  Validator
};
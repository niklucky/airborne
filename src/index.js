'use strict';
const lib = require('./lib');

const express = require('express');
const bodyParser = require('body-parser');

const Config = require('./core/config.js');
const DI = require('./core/di.js');
const Dispatcher = require('./core/dispatcher.js');
const DbAdapter = require('./core/db.adapter.js');

let _instances = [];

class Airborne {
  constructor(userConfig) {
    this.di = new DI();
    this.config = new Config(userConfig).get();
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

  validator(validator){
    this.di.set('Validator', validator);
    return this;
  }

  database(dbConfig){
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

    router.use((request, response) => {
      if (request.url.indexOf('favicon') !== -1) {
        response.send();
        return;
      }

      this.handle(request, response);
    });

    router.use((err, req, res) => {
      console.log('Error catched: ', err);
      res.send('Error');
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
  }

  setInstance(dispatcher){
    _instances.push(dispatcher);
  }
}
lib.Airborne = Airborne;

module.exports = lib;

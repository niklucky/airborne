"use strict";
const Engine = require('./../index.js');

const config = require('./config/config');
const routes = require('./config/routes');

const controllers = require('./controllers');
const modules = require('./config/modules');
const services = require('./config/services');

const validator = new Engine.Validator();

var app = new Engine.Airborne(config);
app.registerRoutes(routes);
app.registerServices(services);
app.registerModules(modules);
app.registerControllers(controllers);
app.registerValidator(validator);
app.start();

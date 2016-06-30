var Application = require('./../airborne.js');
var controllers = require('./controllers');
var modules = require('./modules');
var services = require('./services');

var app = new Application({
  host: 'localhost',
  port: 3006,
  db: {
    tokens: {
      host: '192.168.99.100',
      port: 6379,
      driver: 'redis'
    },
    clients: {
      host: '192.168.99.100',
      port: 3306,
      driver: 'mysql'
    },
    sessions: {
      host: '192.168.99.100',
      port: 27017,
      database: 'sessions',
      driver: 'mongodb'
    }
  }
});

app.registerRoutes({
  '/': {
    auth: true
  }
})
  .registerModules(modules)
  .registerControllers(controllers)
  .registerServices(services)
  .start();

const Airborne = require('../../dist/index.js');

const config = require('./config/config');
const routes = require('./config/routes');

const controllers = require('./controllers');
const modules = require('./config/modules');
const services = require('./config/services');

const app = new Airborne.Engine(config);
app.routes(routes)
    .services(services)
    .modules(modules)
    .controllers(controllers)
    .validator(true);

app.start();

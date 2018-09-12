import { expect, assert } from 'chai';
import Airborne from '../../src/index';
import DI from '../../src/core/di';
import DbAdapter from '../../src/core/db.adapter';
import Validator from '../../src/core/validator';

import mocks from '../mocks';

class IncomingForm {
  parse(request, callback) {
    callback(null, { a: 1 }, { b: 2 });
  }
}
const formidableMock = {
  IncomingForm: IncomingForm
};

const config = {
  host: 'localhost',
  port: 3011,
  debug: true
};
const configDb = {
  host: 'localhost',
  port: 3011,
  debug: false,
  db: {
    mysql: {
      host: '127.0.0.1',
      port: 3306,
      driver: 'mysql',
      password: '12345',
      database: 'Mindset'
    }
  }
};

const routes = {
  '/': { auth: false }
};
const request = {
  url: '/',
  body: { c: 3 }
};
const response = {
  send: () => {
    // console.log('Response send mock');
  },
  status: () => {
    // console.log('Response status mock');
  }
}
const { controllers } = mocks;

let app;

describe('Airborne application', () => {
  describe('Invalid params', () => {
    it('All params are undefined', () => {
      const app = () => new Airborne.Engine();
      expect(app).to.throw(Error, /config is not an object. Failed to start/);
    });
  });
  describe('Simple config', () => {
    beforeEach(() => {
      app = new Airborne.Engine(config);
    });
    it('No database, simple config', () => {
      expect(app).to.have.property('di');
      expect(app).to.have.property('config');
      expect(app.config).to.be.an('object');
      expect(app.di).to.be.an.instanceOf(DI);
    });

    it('services init', () => {
      app.services({});
      expect(app).to.have.property('di');
      const services = app.di.get('services')
      expect(services).to.be.an('object');
    });
    it('controllers init', () => {
      app.controllers({});
      expect(app).to.have.property('di');
      const controllers = app.di.get('controllers')
      expect(controllers).to.be.an('object');
    });
    it('modules init', () => {
      app.modules({});
      expect(app).to.have.property('di');
      const modules = app.di.get('modules')
      expect(modules).to.be.an('object');
    });
    it('routes init', () => {
      app.routes(routes);
      expect(app).to.have.property('di');
      const object = app.di.get('routes')
      expect(object).to.be.an('object');
    });
    it('validator === true init', () => {
      app.validator(true);
      expect(app).to.have.property('di');
      const object = app.di.get('validator');
      expect(object).to.be.an('function');
    });
    it('validator === undefined init', () => {
      app.validator();
      expect(app).to.have.property('di');
      const object = app.di.get('validator');
      expect(object).to.be.an('undefined');
    });
  });
  describe('With databases', () => {
    it('MySQL database', () => {
      const app = new Airborne.Engine(configDb);
      expect(app).to.have.property('di');
      const db = app.di.get('db');
      expect(db.connections).to.have.property('mysql');
      expect(db).to.be.an.instanceOf(DbAdapter);
    });
  });
  describe('Start', () => {
    it('start', () => {
      const app = new Airborne.Engine(configDb);
      app.start();
      expect(app).to.have.property('express');
    });
    it('handle with invalid params', () => {
      const app = new Airborne.Engine(configDb);
      const fn = () => app.handle();
      expect(fn).to.throw(Error, /request is not an object/);
    });
    it('handle with invalid response', () => {
      const app = new Airborne.Engine(configDb);
      const fn = () => app.handle({});
      expect(fn).to.throw(Error, /response is not an object/);
    });
    it('handle with invalid request', () => {
      const app = new Airborne.Engine(configDb);
      const fn = () => app.handle(undefined, {});
      expect(fn).to.throw(Error, /request is not an object/);
    });
    it('handle', () => {
      const app = new Airborne.Engine(configDb);
      app.controllers(controllers);
      app.handle(request, response);
    });

    it('handleMultipart with not available formidable', () => {
      const app = new Airborne.Engine(configDb);
      app.controllers(controllers);
      const result = app.handleMultipart(request, response);
      expect(response.send).to.be.called;
    });
    it('handleMultipart', () => {
      const app = new Airborne.Engine(configDb);
      app.controllers(controllers);
      app.multipartParser = formidableMock;
      const result = app.handleMultipart(request, response);
      expect(response.send).to.be.called;
    });
  });
});

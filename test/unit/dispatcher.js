import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Dispatcher from '../../src/core/dispatcher';
import DI from '../../src/core/di';
import Responder from '../../src/core/responder';
import Router from '../../src/core/router';
import mocks from '../mocks';

chai.use(chaiAsPromised);

const { config, emptyControllers, request, response } = mocks.dispatcher;
const { routes, services, controllers } = mocks;

const di = new DI();
di.set('config', config);
di.set('controllers', controllers);

describe('Dispatcher', () => {
  describe('Constructor', () => {
    it('constructor — empty di', () => {
      const dispatcher = () => new Dispatcher();
      expect(dispatcher).to.throw('DI is not an object');
    });
    it('constructor — empty request', () => {
      const dispatcher = () => new Dispatcher(di);
      expect(dispatcher).to.throw('request is not an object');
    });
    it('constructor — empty response', () => {
      const dispatcher = () => new Dispatcher(di, request);
      expect(dispatcher).to.throw('response is not an object');
    });
    it('constructor — proper values', () => {
      const dispatcher = new Dispatcher(di, request, response);
      expect(dispatcher.responder).is.an.instanceof(Responder);
      expect(dispatcher.router).is.an.instanceof(Router);
      expect(dispatcher.di).is.an.instanceof(DI);
      expect(dispatcher.debug).is.equal(true);
      expect(dispatcher.router.route).is.equal(null);
      expect(dispatcher.responder.statusCode).is.equal(200);
    });
  });
  describe('Init and processing', () => {
    it('init()', () => {
      const dispatcher = new Dispatcher(di, request, response);
      dispatcher.init();
      expect(dispatcher.router).is.an.instanceof(Router);
    });
    it('init() with auth == true but services are not defined', () => {
      di.set('routes', routes);
      const dispatcher = new Dispatcher(di, { url: '/user' }, response);
      const error = () => dispatcher.init();
      expect(error).to.throw('services that contains Authorization');
    });
    it('init() with auth == true but Authorization is not defined', () => {
      di.set('routes', routes);
      di.set('services', {});
      const dispatcher = new Dispatcher(di, { url: '/user' }, response);
      const error = () => dispatcher.init();
      expect(error).to.throw('Auth library not initialized');
    });
    it('init() with auth == true and Authorization is defined', () => {
      di.set('routes', routes);
      di.set('services', services);
      const dispatcher = new Dispatcher(di, { url: '/user' }, response);
      dispatcher.init();
      expect(dispatcher.router).is.an.instanceof(Router);
      expect(dispatcher.router.route).is.not.equal(null);
      expect(dispatcher.router.route.auth).is.equal(true);
    });
    it('initAuth() checking Authorization with Promise check', () => {
      di.set('routes', routes);
      di.set('services', services);
      const dispatcher = new Dispatcher(di, { url: '/user' }, response);
      const auth = dispatcher.init();
      expect(auth).is.an.instanceof(Promise);
      expect(auth.then).is.an.instanceof(Function);
      expect(auth.catch).is.an.instanceof(Function);
      auth.then({ status: true });
    });
    it('initAuth() checking Authorization with Promise check and rejected', () => {
      di.set('routes', routes);
      di.set('services', services);
      di.set('reject', true);
      const dispatcher = new Dispatcher(di, { url: '/user' }, response);
      const auth = dispatcher.init();
      expect(auth).is.an.instanceof(Promise);
      expect(auth.then).is.an.instanceof(Function);
      expect(auth.catch).is.an.instanceof(Function);
      auth.then({ status: false });
      expect(dispatcher.authData).is.equal(undefined);
    });
    it('initAuth() checking Authorization with Promise check and auth.status == false', () => {
      di.set('routes', routes);
      di.set('services', services);
      di.set('reject', false);
      di.set('falseStatus', '1');
      const dispatcher = new Dispatcher(di, { url: '/user' }, response);
      const auth = dispatcher.init();
      expect(auth).is.an.instanceof(Promise);
      expect(auth.then).is.an.instanceof(Function);
      expect(auth.catch).is.an.instanceof(Function);
      auth.then({ status: false });
      expect(dispatcher.authData).is.equal(undefined);
    });
    it('initAuth() checking Authorization with Promise check and auth == true', () => {
      di.set('routes', routes);
      di.set('services', services);
      const user = { status: true, user: { id: 1 } };
      const dispatcher = new Dispatcher(di, { url: '/user' }, response);
      dispatcher.init();
      const auth = dispatcher.initAuth();
      expect(auth).is.an.instanceof(Promise);
      expect(auth.then).is.an.instanceof(Function);
      auth.then(user);
      expect(auth.catch).is.an.instanceof(Function);
    });
    it('start() starting dispatching and collecting data empty controllers', () => {
      const diLocal = new DI();
      diLocal.set('config', config);
      diLocal.set('controllers', emptyControllers);
      diLocal.set('routes', routes);
      const dispatcher = new Dispatcher(diLocal, { url: '/' }, response);
      const result = () => dispatcher.init();
      expect(result).to.throw('controllers are not initialized');
    });
    it('start() starting dispatching with invalid controller', () => {
      const diLocal = new DI();
      diLocal.set('config', config);
      diLocal.set('controllers', { IndexController: null });
      diLocal.set('routes', routes);
      const dispatcher = new Dispatcher(diLocal, { url: '/' }, response);
      dispatcher.init();
      const result = dispatcher.start();
      expect(result).is.equal(false);
    });
    it('start() starting dispatching with valid controller', () => {
      const diLocal = new DI();
      diLocal.set('config', config);
      diLocal.set('controllers', controllers);
      diLocal.set('routes', routes);
      const dispatcher = new Dispatcher(diLocal, { url: '/' }, response);
      dispatcher.init();
      const result = dispatcher.start();
      expect(result).has.property('params');
    });
    it('dispatch() starting dispatching with valid controller', () => {
      const dispatcher = new Dispatcher(di, { url: '/' }, response);
      dispatcher.init();
      dispatcher.dispatch();
    });
  });
});

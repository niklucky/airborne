import DI from './di';
import Responder from './responder';

import Router from './router';

const ERROR_PREFIX = 'Dispatcher error';

class Dispatcher {

  constructor(di, request, response) {
    if (!(di instanceof Object)) {
      throw new Error('[Fatal] ' + ERROR_PREFIX + ': DI is not an object');
    }
    if (!(request instanceof Object)) {
      throw new Error('[Fatal] ' + ERROR_PREFIX + ': request is not an object');
    }
    if (!(response instanceof Object)) {
      throw new Error('[Fatal] ' + ERROR_PREFIX + ': response is not an object');
    }
    this.di = new DI().merge(di);
    this.debug = this.di.get('config').debug;

    this.di.set('request', request);
    this.di.set('response', response);

    this.responder = new Responder(this.di.get('config'));
    this.responder.setServerResponse(this.di.get('response'));

    this.di.set('responder', this.responder);

    this.router = new Router(
      this.di.get('request'),
      this.di.get('routes'),
      this.di.get('modules')
    );
  }

  init() {
    this.router.init();

    if (this.router.route !== null && this.router.route.auth) {
      return this.initAuth();
    }
    return this.dispatch();
  }

  initAuth() {
    if (this.di.get('services') === undefined) {
      throw new Error('[Fatal] ' + ERROR_PREFIX + ': services that contains Authorization service are not provided');
    }
    const AuthLibrary = this.di.get('services').Authorization;
    if (AuthLibrary === undefined) {
      throw Error('[Fatal] Dispatcher error: Auth library not initialized. You need to provide core service or disable authorization for route');
    }
    const Auth = new AuthLibrary(this.di);
    return Auth.init()
      .then((authData) => {
        if (!authData.status) {
          this.responder.sendError('Not authorized', 401);
        } else {
          this.authData = authData;
          this.di.set('authData', authData);
          this.dispatch();
        }
      })
      .catch((authData) => {
        this.responder.sendError(authData);
      });
  }

  dispatch() {
    const result = this.start();

    if (result) {
      if (typeof result.then === 'function') {
        return result.then((data) => {
          this.send(data);
        })
        .catch((data) => {
          this.responder.sendError(data);
        });
      }
    }
    return this.send(result);
  }

  send(data) {
    return this.responder.send(data);
  }

  start() {
    if (this.debug) {
      // console.log('Dispatcher start: ', this.router);
    }

    const controllers = this.di.get('controllers');

    if (Object.keys(controllers).length === 0) {
      throw new Error('[Fatal]: Dispathcher error: controllers are not initialized');
    }

    if (this.router.module) {
      const Module = this.router.module;
      const module = new Module();

      const Ctrl = module.controllers[this.router.controller];
      if (typeof Ctrl !== 'function') {
        return this.responder.send404();
      }
      const controller = new Ctrl(this.di);

      return controller.validate(this.router.method, this.router.params);
    }

    const Controller = controllers[this.router.controller];
    if ((Controller instanceof Object) === false) {
      this.responder.sendError({ message: 'Route not found', stack: 'Controller is not initialized' }, 404);
      return false;
    }
    const ctrl = new Controller(this.di);
    return ctrl.validate(this.router.method, this.router.params);
  }
}

export default Dispatcher;

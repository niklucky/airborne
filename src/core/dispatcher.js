'use strict';

const Router = require('./router.js');
const Responder = require('./responder.js');
const DI = require('./di.js');

class Dispatcher {

  constructor(di, request, response) {
    this.di = new DI().merge(di);

    this.di.set('request', request);
    this.di.set('response', response);

    this.responder = new Responder(this.di.get('config'));
    this.responder.setServerResponse(this.di.get('response'));

    this.di.set('responder', this.responder);

    this.router = new Router(this.di);

    this.init();
  }

  init() {
    if (this.router.route !== null && this.router.route.auth) {
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
        this.di.set('authData', authData);
        this.dispatch();
      })
      .catch(authData => {
        this.responder.sendError(authData);
      });
  }

  dispatch() {
    var result = this.start();

    if (result) {
      if (typeof result.then === 'function') {
        result.then(data => {
          this.send(data)
        })
          .catch(data => {
            this.responder.sendError(data)
          });
        return true;
      }
    }
    return this.send(result)
  }

  send(data) {
    this.responder.send(data);
  }

  start() {
    const controllers = this.di.get('controllers');

    try {

      if (this.router.module) {
        let module = new this.router.module();

        let Ctrl = module.controllers[this.router.controller];
        if(typeof Ctrl !== 'function'){
          return this.responder.send404();
        }
        let controller = new Ctrl(this.di);

        return controller.validate(this.router.method, this.router.params);
      }
      var ctrl;
      if(typeof controllers[this.router.controller] !== 'function'){
        return this.responder.send404();
      }
      ctrl = new controllers[this.router.controller](this.di);

      return ctrl.validate(this.router.method, this.router.params);
    } catch (e) {
      console.log('Dispatcher error', e);
      this.responder.sendError(e);
    }
  }
}

module.exports = Dispatcher;

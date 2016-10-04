import { expect, assert } from 'chai';
import Router from '../../src/core/router';
const routes = {
  '/': { auth: false }
};
const request = {
  index: {
    url: '/'
  },
  dictionary: {
    url: '/dictionary'
  }
};

describe('Router', () => {
  describe('Invalid params', () => {
    it('All params are undefined', () => {
      const router = () => new Router();
      expect(router).to.throw(Error, /request is not an object/);
    });
    it('Controller is undefined', () => {
      const router = () => new Router(request);
      expect(router).to.throw(Error, /should be at least 1 controller/);
    });
  });
  describe('Valid params', () => {
    it('Index /', () => {
      const router = new Router(request.index, routes, {}, {});
      expect(router).to.have.property('route');
      expect(router).to.have.property('controller');
      assert.equal(router.controller, 'IndexController');
    });
    it('route /dictionary', () => {
      const router = new Router(request.dictionary, routes, {}, {});
      expect(router).to.have.property('route');
      expect(router).to.have.property('controller');
      assert.equal(router.controller, 'DictionaryController');
    });
  });
});

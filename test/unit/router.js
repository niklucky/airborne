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
  describe('Methods', () => {
    it('setUrl - /test', () => {
      const router = new Router(request.index, routes, {}, {});
      router.setUrl('/test');
      assert.equal(router.view, 'json');
      assert.equal(router.url, '/test');
    });
    it('setUrl - /test.json', () => {
      const router = new Router(request.dictionary, routes, {}, {});
      router.setUrl('/test.json');
      assert.equal(router.view, 'json');
      assert.equal(router.url, '/test');
    });
    it('setUrl - /test.xml', () => {
      const router = new Router(request.dictionary, routes, {}, {});
      router.setUrl('/test.xml');
      assert.equal(router.view, 'xml');
      assert.equal(router.url, '/test');
    });
  });
});

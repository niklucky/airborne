import { expect, assert } from 'chai';
import Router from '../../src/core/router';
const routes = {
  '/': { auth: false },
  '/dictionary/:id': {},
  '/test': {}
};
const request = {
  index: {
    url: '/'
  },
  test: {
    url: '/test'
  },
  testJson: {
    url: '/test.json'
  },
  testXML: {
    url: '/test.xml'
  },
  dictionary: {
    url: '/dictionary'
  },
  withQuery: {
    url: '/dictionary/?q=test'
  },
  multipleSegments: {
    url: '/dictionary/test'
  },
  dictionaryWithId: {
    url: '/dictionary/5'
  }
};

describe('Router', () => {
  describe('Invalid params', () => {
    it('All params are undefined', () => {
      const router = () => new Router();
      expect(router).to.throw(Error, /request is not an object/);
    });
  });
  describe('Valid params', () => {
    it('Index /', () => {
      const router = new Router(request.index, routes, {}, {}).init();
      expect(router).to.have.property('route');
      expect(router).to.have.property('controller');
      assert.equal(router.controller, 'IndexController');
    });
    it('route /dictionary', () => {
      const router = new Router(request.dictionary, routes, {}, {}).init();
      expect(router).to.have.property('route');
      expect(router).to.have.property('controller');
      assert.equal(router.controller, 'DictionaryController');
    });
  });
  describe('Methods', () => {
    it('setUrl - /test', () => {
      const router = new Router(request.test, routes, {}, {}).init();
      router.setUrl();
      assert.equal(router.view, 'json');
      assert.equal(router.url, '/test');
    });
    it('setUrl - /test.json', () => {
      const router = new Router(request.testJson, routes, {}, {}).init();
      router.setUrl();
      assert.equal(router.view, 'json');
      assert.equal(router.url, '/test');
    });
    it('setUrl - /test.xml', () => {
      const router = new Router(request.testXML, routes, {}, {});
      router.setUrl();
      assert.equal(router.view, 'xml');
      assert.equal(router.url, '/test');
    });
    it('setPathFromUrl - /dictionary', () => {
      const router = new Router(request.dictionary, routes, {}, {}).init();
      const result = router.setPathFromUrl();
      assert.equal(router.path, '/dictionary');
      expect(result).is.an.instanceOf(Router);
    });
    it('setPathFromUrl - /dictionary/?q=1', () => {
      const router = new Router(request.withQuery, routes, {}, {}).init();
      const result = router.setPathFromUrl();
      assert.equal(router.path, '/dictionary/');
      expect(result).is.an.instanceOf(Router);
    });
    it('setSegmentsFromPath - /dictionary', () => {
      const router = new Router(request.dictionary, routes, {}, {}).init();
      router.setPathFromUrl();
      const result = router.setSegmentsFromPath();
      expect(router.segments).is.an('array');
      assert.equal(router.segments[0], 'dictionary');
      expect(router.tmpSegments).is.an('array');
      assert.equal(router.tmpSegments[0], 'dictionary');
      expect(result).is.an.instanceOf(Router);
    });
    it('setSegmentsFromPath - /dictionary/test', () => {
      const router = new Router(request.multipleSegments, routes, {}, {}).init();
      router.setPathFromUrl();
      const result = router.setSegmentsFromPath();
      expect(router.segments).is.an('array');
      assert.equal(router.segments[0], 'dictionary');
      assert.equal(router.segments[1], 'test');
      expect(router.tmpSegments).is.an('array');
      assert.equal(router.tmpSegments[0], 'dictionary');
      assert.equal(router.tmpSegments[1], 'test');
      expect(result).is.an.instanceOf(Router);
    });
  });
  describe('Parsing url and defining route', () => {
    it('getNamedParams - getting named params from empty url and route', () => {
      const router = new Router(request.test, routes, {}, {});
      const result = router.getNamedParams(['test'], ['test']);
      expect(router.params).is.undefined;
      expect(result).is.an('object');
      expect(result.routeSegments).is.an('array');
      expect(result.urlSegments).is.an('array');
      expect(result.routeSegments[0]).is.equal('test');
      expect(result.urlSegments[0]).is.equal('test');
    });
    it('getNamedParams - getting named params with required named params', () => {
      const router = new Router(request.test, routes, {}, {});
      const result = router.getNamedParams(['test', ':id'], ['test', 5]);
      expect(router.params).is.an('object');
      expect(router.params).has.property('id');
      expect(router.params.id).is.equal(5);
      expect(result).is.an('object');
      expect(result.routeSegments).is.an('array');
      expect(result.urlSegments).is.an('array');
      expect(result.routeSegments[0]).is.equal('test');
      expect(result.urlSegments[0]).is.equal('test');
    });
    it('getNamedParams - getting named params with non-required named params and defined segment', () => {
      const router = new Router(request.test, routes, {}, {});
      const result = router.getNamedParams(['test', '?:id'], ['test', 5]);
      expect(router.params).is.an('object');
      expect(router.params).has.property('id');
      expect(router.params.id).is.equal(5);
      expect(result).is.an('object');
      expect(result.routeSegments).is.an('array');
      expect(result.urlSegments).is.an('array');
      expect(result.routeSegments[0]).is.equal('test');
      expect(result.urlSegments[0]).is.equal('test');
    });
    it('getNamedParams - getting named params with non-required named params and undefined segment', () => {
      const router = new Router(request.test, routes, {}, {});
      const result = router.getNamedParams(['test', '?:id'], ['test']);
      expect(router.params).is.undefined;
      expect(result).is.an('object');
      expect(result.routeSegments[0]).is.equal('test');
      expect(result.routeSegments[1]).is.undefined;
      expect(result.urlSegments[0]).is.equal('test');
    });
    it('setRoute - empty routes', () => {
      const router = new Router(request.multipleSegments, undefined, {}, {}).init();
      router.setPathFromUrl();
      router.setSegmentsFromPath();
      const result = router.setRoute(undefined);
      expect(router.route).is.null;
      expect(result).is.an.instanceOf(Router);
    });
    it('setRoute - index route', () => {
      const router = new Router(request.index, routes, {}, {}).init();
      router.setPathFromUrl();
      router.setSegmentsFromPath();
      const result = router.setRoute(routes);
      expect(router.route).is.an('object');
      expect(router.route).has.property('auth');
      assert(router.controller, 'IndexController');
      assert(router.method, 'load');
      expect(result).is.an.instanceOf(Router);
    });
    it('setRoute - dictionary', () => {
      const router = new Router(request.dictionary, routes, {}, {}).init();
      router.setPathFromUrl();
      router.setSegmentsFromPath();
      const result = router.setRoute(routes);
      expect(router.route).is.null;
      assert(router.controller, 'DictionaryController');
      assert(router.method, 'load');
      expect(result).is.an.instanceOf(Router);
    });
    it('setRoute - dictionary/2', () => {
      const router = new Router(request.dictionaryWithId, routes, {}, {}).init();
      router.setPathFromUrl();
      router.setSegmentsFromPath();
      const result = router.setRoute();
      expect(router.route).is.an('object');
      expect(router).has.property('params');
      assert(router.controller, 'DictionaryController');
      assert(router.method, 'load');
      expect(result).is.an.instanceOf(Router);
    });
  });
});

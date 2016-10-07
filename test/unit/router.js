import { expect, assert } from 'chai';
import Router from '../../src/core/router';

const modulesEmpty = {};
const modules = {
  Chat: () => (true)
}
const routes = {
  '/': { auth: false },
  '/dictionary/:id': {},
  '/test': {},
  '/users': {
    methods: ['GET']
  },
  '/groups': {
    methods: ['GET', 'POST']
  },
  '/chat/messages' : {},
  '/chat/users' : {
    module: 'Chat'
  },
  '/about': {
    controller: 'Company'
  }
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
  users: {
    url: '/users',
    method: 'POST'
  },
  groups: {
    url: '/groups',
    method: 'POST'
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
  },
  request404: {
    url: '/404'
  },
  chat: {
    url: '/chat/messages'
  },
  chatUsers: {
    url: '/chat/users'
  },
  about: {
    url: '/about'
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
      const router = new Router(request.index, routes, modulesEmpty).init();
      expect(router).to.have.property('route');
      expect(router).to.have.property('controller');
      assert.equal(router.controller, 'IndexController');
    });
    it('route /dictionary', () => {
      const router = new Router(request.dictionary, routes, modulesEmpty).init();
      expect(router).to.have.property('route');
      expect(router).to.have.property('controller');
      assert.equal(router.controller, 'DictionaryController');
    });
  });
  describe('Methods', () => {
    it('setUrl - /test', () => {
      const router = new Router(request.test, routes, modulesEmpty).init();
      router.setUrl();
      assert.equal(router.view, 'json');
      assert.equal(router.url, '/test');
    });
    it('setUrl - /test.json', () => {
      const router = new Router(request.testJson, routes, modulesEmpty).init();
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
      const router = new Router(request.dictionary, routes, modulesEmpty).init();
      const result = router.setPathFromUrl();
      assert.equal(router.path, '/dictionary');
      expect(result).is.an.instanceOf(Router);
    });
    it('setPathFromUrl - /dictionary/?q=1', () => {
      const router = new Router(request.withQuery, routes, modulesEmpty).init();
      const result = router.setPathFromUrl();
      assert.equal(router.path, '/dictionary/');
      expect(result).is.an.instanceOf(Router);
    });
    it('setSegmentsFromPath - /dictionary', () => {
      const router = new Router(request.dictionary, routes, modulesEmpty).init();
      router.setPathFromUrl();
      const result = router.setSegmentsFromPath();
      expect(router.segments).is.an('array');
      assert.equal(router.segments[0], 'dictionary');
      expect(router.tmpSegments).is.an('array');
      assert.equal(router.tmpSegments[0], 'dictionary');
      expect(result).is.an.instanceOf(Router);
    });
    it('setSegmentsFromPath - /dictionary/test', () => {
      const router = new Router(request.multipleSegments, routes, modulesEmpty).init();
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
      const router = new Router(request.index, routes, modulesEmpty).init();
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
      const router = new Router(request.dictionary, routes, modulesEmpty).init();
      router.setPathFromUrl();
      router.setSegmentsFromPath();
      const result = router.setRoute(routes);
      expect(router.route).is.null;
      assert(router.controller, 'DictionaryController');
      assert(router.method, 'load');
      expect(result).is.an.instanceOf(Router);
    });
    it('setRoute - dictionary/2', () => {
      const router = new Router(request.dictionaryWithId, routes, modulesEmpty).init();
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
  describe('Properties setters', () => {
    it('isMethodAllowed - empty route', () => {
      const router = new Router(request.request404, routes, modulesEmpty).init();
      const result = router.isMethodAllowed();
      expect(router.route).is.null;
      expect(result).to.be.true;
    });
    it('isMethodAllowed - route found, allowed request methods are undefined', () => {
      const router = new Router(request.test, routes, modulesEmpty).init();
      const result = router.isMethodAllowed();
      expect(router.route).is.an('object');
      expect(result).to.be.true;
    });
    it('isMethodAllowed - route found, allowed request methods is POST, passed GET', () => {
      const router = new Router(request.users, routes, modulesEmpty).init();
      const result = router.isMethodAllowed();
      expect(router.route).is.an('object');
      expect(result).to.be.false;
    });
    it('isMethodAllowed - route found, allowed request methods is POST, passed POST', () => {
      const router = new Router(request.groups, routes, modulesEmpty).init();
      const result = router.isMethodAllowed();
      expect(router.route).is.an('object');
      expect(result).to.be.true;
    });
    it('setModule - segments length === 1', () => {
      const router = new Router(request.groups, routes, modulesEmpty).init();
      const result = router.setModule();
      expect(result).is.an.instanceOf(Router);
      expect(router.module).to.be.null;
    });
    it('setModule - segments length === 2 but route module is undefined', () => {
      const router = new Router(request.chat, routes, modules).init();
      const result = router.setModule();
      expect(router.module).is.an.instanceOf(Function);
      expect(router.controller).is.equal('MessagesController');
      expect(router.method).is.equal('load');
    });
    it('setModule - segments length === 2 and route module is defined', () => {
      const router = new Router(request.chatUsers, routes, modules).init();
      const result = router.setModule();
      expect(router.module).is.an.instanceOf(Function);
      expect(router.controller).is.equal('UsersController');
      expect(router.method).is.equal('load');
    });

    it('setController - route controller is undefined, segments length === 0', () => {
      const router = new Router(request.index, routes, modules).init();
      const result = router.setController();
      expect(result).is.an.instanceOf(Router)
      expect(router.controller).is.equal('IndexController');
      expect(router.method).is.equal('load');
    });
    it('setController - route controller is defined, segments length === 0', () => {
      const router = new Router(request.about, routes, modules).init();
      const result = router.setController();
      expect(result).is.an.instanceOf(Router)
      expect(router.controller).is.equal('CompanyController');
      expect(router.method).is.equal('load');
    });
    it('setController - route controller is undefined, segments length === 1', () => {
      const router = new Router(request.test, routes, modules).init();
      const result = router.setController();
      expect(result).is.an.instanceOf(Router)
      expect(router.controller).is.equal('TestController');
      expect(router.method).is.equal('load');
    });
  });
});

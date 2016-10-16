import { expect } from 'chai';
import BaseController from '../../../src/lib/base.controller';
import BaseService from '../../../src/lib/base.service';
import DI from '../../../src/core/di';
import Validator from '../../../src/core/validator';
// import mocks from '../../mocks';

const emptyDi = new DI();
const di = new DI();
const params = { id: 1, name: 'Test' };
const payload = { b: 2 };
const query = { a: 1 };
const request = { query: query };

const rules = {
  load: {
    a: { type: 'number' }
  }
};

di.set('request', request);

describe('BaseController', () => {
  describe('Constructor', () => {
    it('constructor — empty di', () => {
      const controller = () => new BaseController();
      expect(controller).to.throw('you need to provide valid DI');
    });
    it('constructor — di without request', () => {
      const controller = () => new BaseController(emptyDi);
      expect(controller).to.throw('you need to provide valid request in DI');
    });
    it('constructor — valid config', () => {
      const controller = new BaseController(di);
      expect(controller.di).to.be.instanceof(DI);
      expect(controller.service).to.be.instanceof(BaseService);
      expect(controller.rules).to.be.an('object');
    });
  });
  describe('Validation', () => {
    it('validate() — invalid method and params', () => {
      const controller = new BaseController(di);
      const result = () => controller.validate();
      expect(result).to.throw('Controller method is not specified');
    });
    it('validate() — valid method and empty params', () => {
      const controller = new BaseController(di);
      const result = controller.validate('load');
      expect(result).is.an('object');
      expect(result).has.property('a');
      expect(result.a).is.equal(1);
    });
    it('validate() — valid method and empty params and non-empty body ', () => {
      di.set('request', { query: { a: 1 }, body: payload });
      const controller = new BaseController(di);
      const result = controller.validate('load');
      expect(result).is.an.instanceof(Object);
    });
    it('validate() — valid method and non-empty params and non-empty body ', () => {
      di.set('request', { query: { a: 1 }, body: payload });
      const controller = new BaseController(di);
      const result = controller.validate('load', params);
      expect(result).is.an.instanceof(Object);
    });
    it('validate() — valid method and non-empty params and non-empty body ', () => {
      di.set('validator', Validator);
      di.set('request', { query: { a: 1 }, body: payload });
      const controller = new BaseController(di);
      controller.rules = rules;
      const result = controller.validate('load', params);
      expect(result).is.an.instanceof(Object);
    });
    it('validate() — not valid params regarding to rules ', () => {
      di.set('validator', Validator);
      di.set('request', { query: { a: 'Test' }, body: payload });
      di.set('responder', { sendError: () => (true) });
      const controller = new BaseController(di);
      controller.rules = rules;
      const result = controller.validate('load', params);
      console.log('result', result);
      expect(result).is.equal(true);
    });
  });
  describe('Methods', () => {
    it('load()', () => {
      const controller = new BaseController(di);
      const result = controller.load(params);
      expect(result).to.be.equal(params);
    });
    it('get()', () => {
      const controller = new BaseController(di);
      const result = controller.get(params);
      expect(result).to.be.equal(params);
    });
    it('create()', () => {
      const controller = new BaseController(di);
      const result = controller.create(params, payload);
      expect(result).to.be.an('object');
      expect(result).has.property('b');
    });
    it('update()', () => {
      const controller = new BaseController(di);
      const result = controller.update(params, payload);
      expect(result).to.be.an('object');
      expect(result).has.property('id');
      expect(result).has.property('name');
    });
    it('search()', () => {
      const controller = new BaseController(di);
      const result = controller.search(params);
      expect(result).to.be.an('object');
      expect(result).has.property('id');
      expect(result).has.property('name');
    });
    it('status()', () => {
      const controller = new BaseController(di);
      const result = controller.status(params);
      expect(result).to.be.an('object');
      expect(result).has.property('id');
      expect(result).has.property('name');
    });
    it('del()', () => {
      const controller = new BaseController(di);
      const result = controller.del(params);
      expect(result).to.be.an('object');
      expect(result).has.property('id');
      expect(result).has.property('name');
    });
  });
});

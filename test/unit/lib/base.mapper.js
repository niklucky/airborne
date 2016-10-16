import { expect } from 'chai';
import BaseMapper from '../../../src/lib/base.mapper';
import BaseModel from '../../../src/lib/base.model';
import DI from '../../../src/core/di';

const di = new DI();
const params = { id: 1, name: 'Test' };
const payload = { b: 2 };
const collection = [
  { id: 1, name: 'Test' },
  { id: 2, name: 'Test 2' }
];

describe('BaseMapper', () => {
  describe('Constructor', () => {
    it('constructor — empty di', () => {
      const mapper = () => new BaseMapper();
      expect(mapper).to.throw('you need to provide valid DI');
    });
    it('constructor — valid params', () => {
      const mapper = new BaseMapper(di);
      expect(mapper.Model).to.be.instanceof(Function);
      expect(mapper.di).to.be.instanceof(DI);
    });
  });
  describe('Builders', () => {
    it('buildCollection()', () => {
      const mapper = new BaseMapper(di);
      const result = mapper.buildCollection(collection);
      expect(result).to.be.instanceof(Array);
      expect(result.length).to.be.equal(2);
      expect(result[0]).to.be.instanceof(BaseModel);
    });
  });
  describe('Methods', () => {
    it('load()', () => {
      const mapper = new BaseMapper(di);
      const result = mapper.load(params);
      expect(result).to.be.equal(params);
    });
    it('get()', () => {
      const mapper = new BaseMapper(di);
      const result = mapper.get(params);
      expect(result).to.be.equal(params);
    });
    it('create()', () => {
      const mapper = new BaseMapper(di);
      const result = mapper.create(params, payload);
      expect(result).to.be.an('object');
      expect(result).has.property('b');
    });
    it('update()', () => {
      const mapper = new BaseMapper(di);
      const result = mapper.update(params, payload);
      expect(result).to.be.an('object');
      expect(result).has.property('id');
      expect(result).has.property('name');
    });
    it('search()', () => {
      const mapper = new BaseMapper(di);
      const result = mapper.search(params);
      expect(result).to.be.an('object');
      expect(result).has.property('id');
      expect(result).has.property('name');
    });
    it('status()', () => {
      const mapper = new BaseMapper(di);
      const result = mapper.status(params);
      expect(result).to.be.an('object');
      expect(result).has.property('id');
      expect(result).has.property('name');
    });
    it('del()', () => {
      const mapper = new BaseMapper(di);
      const result = mapper.del(params);
      expect(result).to.be.an('object');
      expect(result).has.property('id');
      expect(result).has.property('name');
    });
  });
});

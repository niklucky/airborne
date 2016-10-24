import { expect } from 'chai';
import RedisMapper from '../../../src/lib/redis.mapper';
import DI from '../../../src/core/di';

const di = new DI();
const params = { id: 1, name: 'Test' };
const payload = { b: 2 };

const rows = [params];
const fields = [];

const selectDb = {
  hgetall: (q, callback) => {
    callback(null, rows, fields);
  },
  set: (q, callback) => {
    callback(null, rows, fields);
  }
};
const selectDbFail = {
  query: (q, callback) => {
    callback(Error('error'), null, null);
  }
};

class TestModel {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
  }
}
class TestModelGet {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.date = data.date;
  }
  get() {
    return {
      id: this.id,
      name: this.name,
      date: this.date
    };
  }
}
describe('RedisMapper', () => {
  describe('Constructor', () => {
    it('constructor — empty di', () => {
      const mapper = () => new RedisMapper();
      expect(mapper).to.throw('you need to provide valid DI');
    });
    it('constructor — valid params', () => {
      const mapper = new RedisMapper(di);
      expect(mapper.Model).to.be.instanceof(Function);
      expect(mapper.di).to.be.instanceof(DI);
      expect(mapper.db).is.equal(null);
      expect(mapper.expired).is.equal(0);
    });
  });
  describe('Methods', () => {
    it('get() — empty params', () => {
      const mapper = new RedisMapper(di);
      const result = () => mapper.get();
      expect(result).to.throw('you have to provide params for get()');
    });
    it('get() — valid params', () => {
      const mapper = new RedisMapper(di);
      mapper.dbTable = 'Test';
      mapper.db = selectDb;
      const result = mapper.get(params);
      expect(result).to.be.instanceof(Promise);
      result.then((data) => {
        expect(data).to.be.instanceof(Object);
      });
    });
    it('get() — valid params and error', () => {
      const mapper = new RedisMapper(di);
      mapper.dbTable = 'Test';
      mapper.db = selectDbFail;
      const result = mapper.get(params);
      expect(result).to.be.instanceof(Promise);
      result.catch((error) => {
        expect(error).to.be.instanceof(Error);
      });
    });
  });
});

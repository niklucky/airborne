import { expect } from 'chai';
import MySQLMapper from '../../../src/lib/mysql.mapper';
import DI from '../../../src/core/di';

const di = new DI();
const params = { id: 1, name: 'Test' };
const payload = { b: 2 };
const collection = [
  { id: 1, name: 'Test' },
  { id: 2, name: 'Test 2' }
];

const rows = [params];
const fields = [];

const selectDb = {
  query: (q, callback) => {
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
describe('MySQLMapper', () => {
  describe('Constructor', () => {
    it('constructor — empty di', () => {
      const mapper = () => new MySQLMapper();
      expect(mapper).to.throw('you need to provide valid DI');
    });
    it('constructor — valid params', () => {
      const mapper = new MySQLMapper(di);
      expect(mapper.Model).to.be.instanceof(Function);
      expect(mapper.di).to.be.instanceof(DI);
      expect(mapper.db).is.equal(null);
      expect(mapper.dbTable).is.equal(null);
    });
  });
  describe('Methods', () => {
    it('get() — empty params', () => {
      const mapper = new MySQLMapper(di);
      const result = () => mapper.get();
      expect(result).to.throw('you have to provide params for get()');
    });
    it('get() — valid params', () => {
      const mapper = new MySQLMapper(di);
      mapper.dbTable = 'Test';
      mapper.db = selectDb;
      const result = mapper.get(params);
      expect(result).to.be.instanceof(Promise);
      result.then((data) => {
        expect(data).to.be.instanceof(Object);
      });
    });
    it('get() — valid params and error', () => {
      const mapper = new MySQLMapper(di);
      mapper.dbTable = 'Test';
      mapper.db = selectDbFail;
      const result = mapper.get(params);
      expect(result).to.be.instanceof(Promise);
      result.catch((error) => {
        expect(error).to.be.instanceof(Error);
      });
    });

    it('create() — empty params', () => {
      const mapper = new MySQLMapper(di);
      const result = () => mapper.create();
      expect(result).to.throw('you have to provide data for create()');
    });
    it('create() — valid params with Model (no .get() method)', () => {
      const mapper = new MySQLMapper(di);
      mapper.dbTable = 'Test';
      mapper.db = selectDb;
      mapper.Model = TestModel;
      const result = mapper.create({}, params);
      expect(result).to.be.instanceof(Promise);
      result.then((data) => {
        expect(data).to.be.instanceof(Object);
      });
    });
    it('create() — valid params with Model (with .get() method)', () => {
      const mapper = new MySQLMapper(di);
      mapper.dbTable = 'Test';
      mapper.db = selectDb;
      mapper.Model = TestModelGet;
      const result = mapper.create({}, params);
      expect(result).to.be.instanceof(Promise);
      result.then((data) => {
        expect(data).to.be.instanceof(Object);
      });
    });
    it('create() — valid params with invalid Model', () => {
      const mapper = new MySQLMapper(di);
      mapper.dbTable = 'Test';
      mapper.db = selectDb;
      mapper.Model = {};
      const result = mapper.create({}, params);
      expect(result).to.be.instanceof(Promise);
      result.catch((error) => {
        expect(error).to.be.instanceof(Error);
      });
    });
    it('create() — valid params and error', () => {
      const mapper = new MySQLMapper(di);
      mapper.dbTable = 'Test';
      mapper.db = selectDbFail;
      const result = mapper.create({}, params);
      expect(result).to.be.instanceof(Promise);
      result.catch((error) => {
        expect(error).to.be.instanceof(Error);
      });
    });

    it('update() — empty params', () => {
      const mapper = new MySQLMapper(di);
      const result = () => mapper.update();
      expect(result).to.throw('you have to provide params for update(). You cannot update whole table.');
    });
    it('update() — valid params and empty payload', () => {
      const mapper = new MySQLMapper(di);
      const result = () => mapper.update(params);
      expect(result).to.throw('you have to provide payload for update(). Nothing to update.');
    });
    it('update() — valid params with Model (no .get() method)', () => {
      const mapper = new MySQLMapper(di);
      mapper.dbTable = 'Test';
      mapper.db = selectDb;
      mapper.Model = TestModel;
      const result = mapper.update(params, payload);
      expect(result).to.be.instanceof(Promise);
      result.then((data) => {
        expect(data).to.be.instanceof(Object);
      });
    });
    it('update() — valid params with Model (with .get() method)', () => {
      const mapper = new MySQLMapper(di);
      mapper.dbTable = 'Test';
      mapper.db = selectDb;
      mapper.Model = TestModelGet;
      const result = mapper.update({}, params);
      expect(result).to.be.instanceof(Promise);
      result.then((data) => {
        expect(data).to.be.instanceof(Object);
      });
    });
    it('update() — valid params with invalid Model', () => {
      const mapper = new MySQLMapper(di);
      mapper.dbTable = 'Test';
      mapper.db = selectDb;
      mapper.Model = {};
      const result = mapper.update({}, params);
      expect(result).to.be.instanceof(Promise);
      result.catch((error) => {
        expect(error).to.be.instanceof(Error);
      });
    });
    it('update() — valid params and error', () => {
      const mapper = new MySQLMapper(di);
      mapper.dbTable = 'Test';
      mapper.db = selectDbFail;
      const result = mapper.update({}, params);
      expect(result).to.be.instanceof(Promise);
      result.catch((error) => {
        expect(error).to.be.instanceof(Error);
      });
    });

    it('del() — empty params', () => {
      const mapper = new MySQLMapper(di);
      const result = () => mapper.del();
      expect(result).to.throw('you have to provide params for del(). You cannot delete the whole table.');
    });
    it('del() — valid params', () => {
      const mapper = new MySQLMapper(di);
      mapper.dbTable = 'Test';
      mapper.db = selectDb;
      const result = mapper.del(params);
      expect(result).to.be.instanceof(Promise);
      result.then((data) => {
        expect(data).to.be.instanceof(Object);
      });
    });
    it('del() — valid params and error', () => {
      const mapper = new MySQLMapper(di);
      mapper.dbTable = 'Test';
      mapper.db = selectDbFail;
      const result = mapper.del(params);
      expect(result).to.be.instanceof(Promise);
      result.catch((error) => {
        expect(error).to.be.instanceof(Error);
      });
    });
    it('del() — valid params and error in try ... catch', () => {
      const mapper = new MySQLMapper(di);
      mapper.dbTable = 'Test';
      mapper.db = selectDbFail;
      mapper.db.query = null;
      const result = mapper.del(params);
      expect(result).to.be.instanceof(Promise);
      result.catch((error) => {
        expect(error).to.be.instanceof(Error);
      });
    });
  });
});

import DbAdapter from '../../../src/core/db.adapter';
import { expect } from 'chai';

const mySQLConfig = {
  host: 'localhost',
  port: 3008,
  debug: false,
  db: {
    mysql: {
      host: '127.0.0.1',
      port: 3306,
      driver: 'mysql',
      password: '12345',
      database: 'Airborne_test'
    }
  }
};

const mongoConfig = {
  host: 'localhost',
  port: 3008,
  debug: false,
  db: {
    mongodb: {
      host: '127.0.0.1',
      port: 3306,
      driver: 'mongodb',
      password: '12345',
      database: 'Airborne_test'
    }
  }
};

const redisConfig = {
  host: 'localhost',
  port: 3008,
  debug: false,
  db: {
    redis: {
      host: '127.0.0.1',
      port: 3306,
      driver: 'mysql',
      password: '12345',
      database: 'Airborne_test'
    }
  }
};

describe('DbAdapter', () => {
  describe('Constructor', () => {
    it('empty DbConfig', () => {
      const adapter = () => new DbAdapter();
      expect(adapter).to.throw(Error, /DbConfig is not an object/);
    });
    it('mySQL config', () => {
      const adapter = new DbAdapter(mySQLConfig);
      expect(adapter.initMySQL).to.be.called;
    });
    it('Redis config', () => {
      const adapter = new DbAdapter(redisConfig);
      expect(adapter.initRedis).to.be.called;
    });
    it('Mongo config', () => {
      const adapter = new DbAdapter(mongoConfig);
      expect(adapter.initMongoDb).to.be.called;
    });
  });
});

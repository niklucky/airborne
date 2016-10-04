/* globals Promise */


const BaseMapper = require('./base.mapper');
const MySQLQueryBuilder = require('mysql-qb');

class MySQLMapper extends BaseMapper {
  constructor(di) {
    super(di);
    this.db = null;
    this.dbTable = null;
    this.queryBuilder = new MySQLQueryBuilder();
  }

  get(params) {
    return new Promise((resolve) => {
      this.load(params).then((collection) => {
        resolve(collection[0]);
      });
    });
  }

  load(params) {
    return new Promise((resolve, reject) => {
      try {
        const query = this.queryBuilder
          .select('*')
          .from(this.dbTable)
          .where(params)
          .build();
        return this.db.query(query, (error, rows, fields) => {
          if (error) {
            reject(error, fields);
          }
          resolve(this.buildCollection(rows));
        });
      } catch (e) {
        return reject(e);
      }
    });
  }
  create(params) {
    return new Promise((resolve, reject) => {
      try {
        const model = new this.Model(params);
        const data = (model.get) ? model.get() : model;
        for (const i in data) {
          if (typeof data[i] === 'string') {
            data[i] = data[i].replace(/'/g, "\\'"); // eslint-disable-line
          }
        }
        const query = this.queryBuilder.insert(this.dbTable, data).build();
        return this.db.query(query, (error, result) => {
          if (error) {
            return reject(error);
          }
          data.id = result.insertId;
          for (const i in data) {
            if (typeof data[i] === 'string') {
              data[i] = data[i].replace(/\'/g, "'"); // eslint-disable-line
            }
          }
          return resolve(data);
        });
      } catch (e) {
        return reject(e);
      }
    });
  }

  update(params, payload) {
    return new Promise((resolve, reject) => {
      try {
        const model = new this.Model(payload);
        const data = (model.get) ? model.get() : payload;
        for (const i in data) {
          if (data[i] === undefined) {
            delete data[i];
          }
        }
        const query = this.queryBuilder.update(this.dbTable, data).where(params).build();
        return this.db.query(query, (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        });
      } catch (e) {
        return reject(e);
      }
    });
  }

  del(params) {
    return new Promise((resolve, reject) => {
      try {
        const query = this.queryBuilder.delete(this.dbTable).where(params).build();
        return this.db.query(query, (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        });
      } catch (e) {
        return reject(e);
      }
    });
  }
}

module.exports = MySQLMapper;

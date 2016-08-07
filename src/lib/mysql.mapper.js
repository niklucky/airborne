/* globals Promise */
'use strict';
const BaseMapper = require('./base.mapper');
const MySQLQueryBuilder = require('mysql-qb');

class MySQLMapper extends BaseMapper {
  constructor(di) {
    super(di);
    this.db = null;
    this.dbTable = null;
    this.queryBuilder = new MySQLQueryBuilder();
  }

  get(params){
    return new Promise((resolve) => {
      this.load(params).then(collection => {
        resolve(collection[0]);
      });
    });
  }

  load(params) {
    return new Promise((resolve, reject) => {
      try {
        let query = this.queryBuilder
          .select('*')
          .from(this.dbTable)
          .where(params)
          .build();
        this.db.query(query, (error, rows, fields) => {
          if (error) {
            return reject(error, fields);
          }
          resolve(this.buildCollection(rows));
        });
      } catch (e) {
        reject(e);
      }
    });
  }
  create(params){
    return new Promise((resolve, reject) => {
      try {
        const model = new this.Model(params);
        const data = (model.get) ? model.get() : model ;
        for( var i in data ){
          if(typeof data[i] === 'string'){
            data[i] = data[i].replace(/'/g, "\\'");
          }
        }
        let query = this.queryBuilder.insert(this.dbTable, data).build();
        this.db.query(query, (error, result) => {
          if(error){
            return reject(error);
          }
          data.id = result.insertId;
          for( var i in data ){
            if(typeof data[i] === 'string'){
              data[i] = data[i].replace(/\'/g, "'");
            }
          }
          resolve(data);
        });
      }catch(e){
        reject(e);
      }
    });
  }
}

module.exports = MySQLMapper;

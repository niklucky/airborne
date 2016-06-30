"use strict";
const BaseMapper = require('./base.mapper');
const BaseModel = require('./base.model');

class RedisMapper extends BaseMapper {
  constructor(di) {
    super(di);
    this.db = di.db;
    this.Model = BaseModel;
    this.expired = 0;
    this.prefix = '';
  }

  create(params) {
    var object = new this.Model(params).get();
    var key = this.generateKey(object);

    if (typeof object === 'object') {
      return this._setter('hmset', key, object, this.expired);
    }
    return this._setter('set', key, object, this.expired);
  }

  get(params){
    let object = new this.Model(params).get();

    if(typeof object === 'object'){
      return this._getter('hgetall', object.key);
    }
    return this._getter('get', object);
  }

  load(params){
    return this.get(params);
  }

  update(key, data){
    var object = new this.Model(data).get();
    if (typeof object === 'object') {
      return this._setter('hmset', key, object, this.expired);
    }
    return this._setter('set', key, object, this.expired);
  }
  remove(key){
    if (typeof key === 'object') {
      key = key.key;
    }
    return this._getter('del', key);
  }
  generateKey(model) {
    const crypto = require('crypto');
    const uuid = new Date();
    const secret = 'secret';
    let key = (model.id) ? model.id : model.toString() + uuid.toISOString();
    return crypto.createHmac('sha256', secret)
      .update(key)
      .digest('hex');
  }

  _setter(command, key, value, expired){
    let redisKey = this.prefix + ':' + key;
    return new Promise((resolve, reject) => {
      this.db[command](redisKey, value, (error, replies) => {
        if(replies == 'OK') {
          return resolve(key);
        }
        return reject({ error: error, replies: replies });
      });
      if (expired > 0) {
        this.db.expire(redisKey, expired);
      }
    });
  }
  _getter(command, key, expired){
    let redisKey = this.prefix + ':' + key;
    return new Promise((resolve, reject) => {
      //console.log("Command: ", command, redisKey);
      this.db[command](redisKey, (error, replies) => {
        if(error) {
          return reject({ error: error, replies: replies });
        }
        return resolve(key);
      });
      if (expired > 0) {
        this.db.expire(redisKey, expired);
      }
    });
  }
}

module.exports = RedisMapper;

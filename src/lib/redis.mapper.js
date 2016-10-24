/* globals Promise */
const BaseMapper = require('./base.mapper');
const BaseModel = require('./base.model');

class RedisMapper extends BaseMapper {
  constructor(di) {
    super(di);
    this.db = null;
    this.Model = BaseModel;
    this.expired = 0;
    this.prefix = '';
  }

  create(requestParams, payload) {
    const params = payload;
    const object = new this.Model(params).get();
    if (params.key === undefined) {
      params.key = this._generateKey(object);
    }

    if (typeof object === 'object') {
      return this._setter('hmset', params.key, object, this.expired);
    }
    return this._setter('set', params.key, object, this.expired);
  }

  get(params) {
    if (params instanceof Object === false) {
      throw new Error('[Fatal] RedisMapper error: you have to provide params for get()');
    }
    const object = new this.Model(params).get();

    if (typeof object === 'object') {
      return this._getter('hgetall', object.key);
    }
    return this._getter('get', object);
  }

  load(params) {
    return this.get(params);
  }

  update(key, data) {
    const object = new this.Model(data).get();
    if (typeof object === 'object') {
      return this._setter('hmset', this._getKey(key), object, this.expired);
    }
    return this._setter('set', this._getKey(key), object, this.expired);
  }
  expire(key, expire) {
    return this._setter('expire', this._getKey(key), expire);
  }

  del(key) {
    return this._getter('del', this._getKey(key));
  }

  _getKey(key) { // eslint-disable-line class-methods-use-this
    if (typeof key === 'object') {
      return key.key;
    }
    return key;
  }
  _generateKey(model) { // eslint-disable-line class-methods-use-this
    const crypto = require('crypto');

    const uuid = new Date();
    const secret = 'secret';
    const key = (model.id) ? model.id : model.toString() + uuid.toISOString();
    return crypto.createHmac('sha256', secret)
      .update(key)
      .digest('hex');
  }

  _setter(command, key, value, expired) {
    const redisKey = `${this.prefix}:${key}`;
    return new Promise((resolve, reject) => {
      this.db[command](redisKey, value, (error, replies) => {
        if (replies === 'OK') {
          return resolve(key);
        }
        return reject({ error, replies });
      });
      if (expired > 0) {
        this.db.expire(redisKey, expired);
      }
    });
  }
  _getter(command, key, expired) {
    const redisKey = `${this.prefix}:${key}`;
    return new Promise((resolve, reject) => {
      // console.log("Command: ", command, redisKey);
      this.db[command](redisKey, (error, replies) => {
        if (error) {
          return reject({ error, replies });
        }
        const data = replies;
        if (typeof replies === 'object' && replies !== null) {
          data.key = key;
        }
        return resolve(data);
      });
      if (expired > 0) {
        this.db.expire(redisKey, expired);
      }
    });
  }
}

module.exports = RedisMapper;

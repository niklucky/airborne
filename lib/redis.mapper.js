import BaseMapper from './base.mapper';
import BaseModel from './base.model';

class RedisMapper extends BaseMapper {
  constructor(di) {
    super(di);
    this.db = {};
    this.Model = BaseModel;
    this.expired = 0;
    this.prefix = 'redis';
  }

  create(params) {
    var object = new this.Model(params).get();
    var key = this.generateKey(object);

    if (typeof object === 'object') {
      return this.createHSET(key, object, this.expired);
    }
    return {};
  }

  generateKey(model) {
    const crypto = require('crypto');
    const secret = 'secret';
    let key = (model.id) ? model.id : model.toString();
    return crypto.createHmac('sha256', secret)
      .update(key)
      .digest('hex');
  }

  createHSET(key, object, expire) {
    let redisKey = this.prefix + ':' + key;
    return new Promise((resolve, reject) => {
      this.db.multi()
        .hmset(redisKey, object)
        .expire(redisKey, expire)
        .hgetall(redisKey)
        .exec((error, replies) => {
          if (error) {
            reject(error);
            return true;
          }
          replies[2].token = key;
          resolve(replies[2]);
        });
    });
  }
}

export default RedisMapper;

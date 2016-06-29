'use strict';

const BaseController = require('./lib/base.controller');
const BaseService = require('./lib/base.service');
const BaseMapper = require('./lib/base.mapper');
const BaseModel = require('./lib/base.model');

const HATEOASDecorator = require('./lib/hateoas.decorator');

const HTTPMapper = require('./lib/http.mapper');
const MySQLMapper = require('./lib/mysql.mapper');
const MySQLQueryBuilder = require('./lib/mysql.query.builder');
const RedisMapper = require('./lib/redis.mapper');

module.exports = {
  BaseController,
  BaseService,
  BaseMapper,
  BaseModel,
  HATEOASDecorator,
  HTTPMapper,
  MySQLMapper,
  MySQLQueryBuilder,
  RedisMapper
};
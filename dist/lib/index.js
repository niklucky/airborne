'use strict';

var BaseController = require('./base.controller');
var BaseService = require('./base.service');
var BaseMapper = require('./base.mapper');
var BaseModel = require('./base.model');

var HATEOASDecorator = require('./hateoas.decorator');

var HTTPMapper = require('./http.mapper');
var MySQLMapper = require('./mysql.mapper');
var MySQLQueryBuilder = require('mysql-qb');
var RedisMapper = require('./redis.mapper');

var Validator = require('./validator');

module.exports = {
  BaseController: BaseController,
  BaseService: BaseService,
  BaseMapper: BaseMapper,
  BaseModel: BaseModel,
  HATEOASDecorator: HATEOASDecorator,
  HTTPMapper: HTTPMapper,
  MySQLMapper: MySQLMapper,
  MySQLQueryBuilder: MySQLQueryBuilder,
  RedisMapper: RedisMapper,
  Validator: Validator
};
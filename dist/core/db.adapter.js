'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DbAdapter = function () {
  function DbAdapter(dbConfig) {
    _classCallCheck(this, DbAdapter);

    this.dbConfig = dbConfig;
    this.connections = {};
    this.init();
  }

  _createClass(DbAdapter, [{
    key: 'init',
    value: function init() {
      for (var dbConnectionName in this.dbConfig) {
        if (this.dbConfig.hasOwnProperty(dbConnectionName)) {
          var dbCredits = this.dbConfig[dbConnectionName];

          if (dbCredits.driver === 'redis') {
            this.initRedis(dbConnectionName, dbCredits);
          }
          if (dbCredits.driver === 'mongodb') {
            this.initMongoDb(dbConnectionName, dbCredits);
          }
          if (dbCredits.driver === 'mysql') {
            this.initMySQL(dbConnectionName, dbCredits);
          }
        }
      }
    }
  }, {
    key: 'initRedis',
    value: function initRedis(name, connection) {
      var redis = require('redis');
      this.connections[name] = redis.createClient(connection);
    }
  }, {
    key: 'initMongoDb',
    value: function initMongoDb(name, connection) {
      var mongoose = require('mongoose');
      var userPassword = '';

      if (connection.user) {
        userPassword = connection.user + ':' + connection.pwd + '@';
      }

      var connectionString = 'mongodb://' + userPassword + connection.host + '/' + connection.database;
      this.connections[name] = mongoose.connect(connectionString);
    }
  }, {
    key: 'initMySQL',
    value: function initMySQL(name, connection) {
      var _this = this;

      var mysql = require('mysql');

      if (!connection.user) {
        connection.user = 'root';
      }
      if (!connection.host) {
        connection.host = 'localhost';
      }
      if (!connection.port) {
        connection.port = 3306;
      }

      var conn = mysql.createConnection({
        host: connection.host,
        port: connection.port,
        user: connection.user,
        password: connection.password,
        database: connection.database
      });
      conn.connect();
      conn.on('error', function (err) {
        console.error('Connection down. Reconnecting...', err);
        setTimeout(function () {
          _this.initMySQL(name, connection);
        }, 1000);
      });
      conn.on('connect', function () {
        console.info('Connected');
      });

      this.connections[name] = conn;
    }
  }]);

  return DbAdapter;
}();

module.exports = DbAdapter;
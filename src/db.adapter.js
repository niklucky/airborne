class DbAdapter {
  constructor(dbConfig) {
    this.dbConfig = dbConfig;
    this.connections = {};
    this.init();
  }

  init() {
    for (let dbConnectionName in this.dbConfig) {
      if (this.dbConfig.hasOwnProperty(dbConnectionName)) {
        let dbCredits = this.dbConfig[dbConnectionName];

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
  initRedis(name, connection) {
    var redis = require('redis');
    this.connections[name] = redis.createClient(connection);
  }

  initMongoDb(name, connection) {
    var mongoose = require('mongoose');
    var userPassword = '';

    if (connection.user) {
      userPassword = connection.user + ':' + connection.pwd + '@';
    }

    let connectionString = 'mongodb://' + userPassword + connection.host + '/' + connection.database;
    this.connections[name] = mongoose.connect(connectionString);
  }

  initMySQL(name, connection) {
    var mysql = require("mysql");

    if (!connection.user) {
      connection.user = 'root';
    }
    if (!connection.host) {
      connection.host = 'localhost';
    }
    if (!connection.port) {
      connection.port = 3306;
    }

    let conn = mysql.createConnection({
      host: connection.host,
      port: connection.port,
      user: connection.user,
      password: connection.password,
      database: connection.database
    });
    conn.connect( err => {
      console.log("MySQL connected");
    });
    conn.on('error', err => {
      console.log("Connection down. Reconnecting...", err);
      setTimeout(() => {
        this.initMySQL(name, connection);
      }, 1000);
    });
    this.connections[name] = conn;
  }
}

module.exports = DbAdapter;

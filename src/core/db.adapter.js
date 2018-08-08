class DbAdapter {
  constructor(dbConfig) {
    this.dbConfig = dbConfig;
    this.connections = {};
    this.init();
    this.isPingActivated = false;
  }

  init() {
    const configArray = Object.keys(this.dbConfig);
    for (let i = 0; i < configArray.length; i += 1) {
      const dbConnectionName = configArray[i];
      const dbCredits = this.dbConfig[dbConnectionName];

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
  initRedis(name, connection) {
    const redis = require('redis'); // eslint-disable-line global-require

    this.connections[name] = redis.createClient(connection);
  }

  initMongoDb(name, connection) {
    const mongoose = require('mongodb'); // eslint-disable-line global-require

    let userPassword = '';

    if (connection.user) {
      userPassword = `${connection.user}:${connection.pwd}@`;
    }

    const connectionString = `mongodb://${userPassword}${connection.host}/${connection.database}`;
    this.connections[name] = mongoose.connect(connectionString);
  }

  initMySQL(name, connectionConfig) {
    const mysql = require('mysql'); // eslint-disable-line global-require

    const connection = connectionConfig;

    if (!connection.user) {
      connection.user = 'root';
    }
    if (!connection.host) {
      connection.host = 'localhost';
    }
    if (!connection.port) {
      connection.port = 3306;
    }
    if (connection.charset === undefined) {
      connection.charset = 'utf8';
    }
    connection.dateStrings = (connection.dateStrings !== undefined)
      ? connection.dateStrings
      : false;

    const conn = mysql.createConnection(connection);
    conn.connect();
    conn.on('error', (err) => {
      console.log('Connection down. Reconnecting...', err);
      setTimeout(() => {
        conn.destroy();
        this.initMySQL(name, connection);
      }, 1000);
    });
    conn.on('connect', () => {
      if (!this.isPingActivated) {
        this.ping(name);
      }
      console.log('Connected');
    });
    this.connections[name] = conn;
  }
  ping(name) {
    this.isPingActivated = true;
    this.connections[name].query('SELECT 1', (err) => {
      if (err) {
        console.log('ping err', err);
      }
      console.log('ping');
    });
    setTimeout(() => {
      this.ping(name);
    }, 5000);
  }
}

module.exports = DbAdapter;

const config = {
  host: '127.0.0.1',
  port: 3008,
  db: {
    mysql: {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '12345',
      database: 'Airborne_test',
      driver: 'mysql',
      charset: 'utf8mb4',
      multipleStatements: true
    }
  }
};

module.exports = config;

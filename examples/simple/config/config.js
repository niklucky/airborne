module.exports = {
  protocol: 'https',
  apiHost: 'example.com',
  host: '127.0.0.1',
  port: 30022,
  debug: true,
  db: {
    mysql: {
      host: 'localhost',
      port: 3306,
      driver: 'mysql',
      password: '12345',
      database: 'airborne_test'
    }
  },
  sources: {
    dictionary: 'dictionary'
  }
};

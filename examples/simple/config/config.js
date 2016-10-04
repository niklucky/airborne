module.exports = {
  protocol: 'https',
  apiHost: 'example.com',
  host: '127.0.0.1',
  port: 3008,
  debug: true,
  db: {
    mysql: {
      host: '192.168.99.100',
      port: 3306,
      driver: 'mysql',
      password: '12345',
      database: 'AirborneTest'
    }
  },
  sources: {
    dictionary: 'dictionary'
  }
};

module.exports = {
  protocol: 'https',
  apiHost: 'api.us1.aerial.email',
  host: '127.0.0.1',
  port: 3008,
  debug: true,
  authorization: {
    host: 'localhost',
    port: 3001
  },
  serverKey: '03e5d14c28b052844302f7a09f0b8afb2b8eb173f9e0275f2e5222fe0836e121',
  db: {
    // redis: {
    //   host: '192.168.99.100',
    //   port: 6379,
    //   driver: 'redis'
    // }
    mysql: {
      host: '192.168.99.100',
      port: 3306,
      driver: 'mysql',
      password: '12345',
      database: 'Phoenix'
    }
  },
  mysql: {
    TABLE_TEST: 'dictionary'
  },
  http: {
    TOKEN_BASIC: {
      host: '127.0.0.1',
      port: 3001,
      path: '/token/basic'
    }
  }
};

module.exports = {
  protocol: 'https',
  apiHost: 'example.com',
  host: '127.0.0.1',
  port: 3008,
  debug: true,
  db: {
    mysql: {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '12345',
      database: 'CSKA_Food',
      driver: 'mysql',
      charset: 'utf8mb4',
      dateStrings: true
    }
  },
  sources: {
    categories: 'food_categories'
  },
  auth: {
    host: 'localhost',
    port: 3042
  },
};

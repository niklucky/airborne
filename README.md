# Airborne API framework

## Config
You can provide your own config that will replace default

```
module.exports = {
  path: './',
  host: 'localhost', // API host to run
  port: 3000, // API port
  debug: true,

  // Database section
  // Available mappers: MySQL (MariaDB) / Redis / MongoDB
  db :{

    mysql: { // Name of the connection
      // Connection details in Databases section
    }
  }
}
```

## Databases
### MySQL
To enable MySQL support you need to provide in config connection information:

```
db: {
  ...
  mysql: { // Name of the connection
    host: '127.0.0.1',  // by default
    port: 3306,         // by default
    username: 'root',   // by default
    password: 'myPassword1', // by default - using password: NO
    database: 'MyDatabase' // no defaults
  }
}
```

### Redis

```
db: {
  ...
  myRedis: { // Name of the connection
    host: '127.0.0.1',        // by default
    port: 6379,               // by default
    username: 'root',         // by default no user
    password: 'myPassword1'   // by default - using password: NO
  }
}
```

### MongoDB
```
db: {
  ...
  myMongo: { // Name of the connection
    host: '127.0.0.1',        // by default
    port: 27017,              // by default
    username: 'root',         // by default no user
    password: 'myPassword1'   // by default - using password: NO
  }
}
```

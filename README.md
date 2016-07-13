# Airborne API framework
This framework built for educational purpose. I'm migrating to ES6 and have decided to write my own RESTful API framework.

It is not covered by Unit tests yet but WIP.

## How it works
It uses DAO architecture and DI for its carcass.

Using Express server routing it get all request and processes to Dispatcher.
Dispatcher parses url into segments and apllies call to Controller's method.

Example:
```
GET /messages // MessagesController.load()
```
```
GET /messages/1 // MessagesController.get(id)
```
```
POST /messages // MessagesController.create(payload)
```
Also you can divide controllers by Modules.
Engine will parse your url and process like this:
```
GET /todo/tasks // Todo/TasksController.load()
```

### REQUEST params
They will arrive in method in params argument
```
GET /messages/1/?limit=100 // MessagesController.get(id, params)
```
## Controllers
Engine will search for controllers in controllers folder or you can create modules. In that case you have to place in module folder.

### App controllers
```
/app
  controllers
    IndexController.js
```
### By module
```
/app
  modules
    Todo
      controllers
        TasksController.js
```

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

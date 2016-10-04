# Airborne API
[![Build Status](https://travis-ci.org/niklucky/airborne.svg?branch=master)](https://travis-ci.org/niklucky/airborne)
[![npm version](https://img.shields.io/npm/v/airborne.svg?style=flat-square)](https://www.npmjs.com/package/airborne)
[![Codecov](https://img.shields.io/codecov/c/github/niklucky/airborne.svg?maxAge=2592000?style=flat-square)](https://codecov.io/gh/niklucky/airborne)

> API framework that implements DAO (Data Access Object) model.

## Why do I need it?
Actually you don't. Really. I build this framework strictly in educational purpose and now I'm trying to use it on my projects.
It's updated almost every day. Young and unstable. It's even not 1.x!
Every day I write tests and add new features.
After testing a lot of frameworks on NodeJS for my needs (all of them are using MV) I decided to write my own.

I advise you to use some of the mature frameworks (HAPI, Meteor etc).

> If you decided to poke this stuff you can drop me a line

## NodeJS support

Framework is written on ES6 and with help of babel compiled to ES5.
So it supports node >= 4.1.2.


## Contents
* [Quick start](./docs/Quick-start.md) (soon)
* [Usage examples](./docs/Usage.md) (soon)
* [Architecture](https://github.com/niklucky/airborne/blob/master/docs/Architecture.md) (soon)
* [Routing](https://github.com/niklucky/airborne/blob/master/docs/Routing.md)
* [Controllers & validation](./docs/Architecture.md) (soon)
* [Services](./docs/Services.md) (soon)
* [Mappers & Models (schemas)](./docs/Mappers.md) (soon)
* [Views (xml & json)](./docs/Views.md) (soon)
* [Working with Databases (MySQL, Redis, MongoDD)](./docs/Databases.md) (soon)
* [Working with HTTP](./docs/HTTP.md) (soon)

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
More about [Controllers](./docs/Controllers.md)

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

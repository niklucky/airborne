const UsersController = require('../controllers/dictionary.controller');

const routes = {
  '/users/': {
    get: {
      handler: UsersController,
      method: 'load'
    },
    post: {
      handler: UsersController,
      method: 'create'
    }
  },
  // '/users': {
  //   get: {
  //     handler: UsersController,
  //     method: 'load'
  //   },
  //   post: {
  //     handler: UsersController,
  //     method: 'create'
  //   },
  // },
  // '*': {
  //   handler: UsersController,
  //   method: 'create'
  // }
};

module.exports = routes;

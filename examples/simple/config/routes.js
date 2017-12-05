const UsersController = require('../controllers/dictionary.controller');

const routes = {
  '/users/': {
    get: {
      handler: UsersController,
      method: 'load',
      auth: true
    },
    post: {
      handler: UsersController,
      method: 'create'
    }
  },
  '/index/:id': {
    get: {
      handler: UsersController,
      method: 'load'
    }
  }
};

module.exports = routes;

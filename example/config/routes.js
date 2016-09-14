module.exports = {
  '/': {
    allowedMethods: ['GET']
  },
  '/auth': {
    auth: false,
    module: 'Auth'
  },
  '/auth/forgot-password/:id': {
    method: 'forgotPassword'
  },
  '/auth/login': {
    method: 'login'
  },
  '/mailman/messages': {
    auth: true
  }
};

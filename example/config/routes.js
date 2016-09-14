module.exports = {
  '/': {
    allowedMethods: ['GET']
  },
  '/auth': {
    auth: false,
    module: 'Auth'
  },
  '/auth/forgot-password': {
    method: 'forgotPassword'
  },
  '/auth/login': {
    method: 'login'
  },
  '/mailman/messages': {
    auth: true
  }
};

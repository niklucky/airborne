module.exports = {
  '/': {
    auth: true,
    allowedMethods: ['GET']
  },
  '/auth/test/:id': {
    auth: false
  },
  '/mailman/messages': {
    auth: true
  }
};

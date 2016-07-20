module.exports = {
  '/': {
    auth: true,
    allowedMethods: ['GET']
  },
  '/auth/basic-token': {
    auth: false
  },
  '/mailman/messages': {
    auth: true
  }
};

module.exports = function note(Model) {
  Model.prototype.remote2 = function remote(cb) {
    cb(null, { message: 'remote 2 ok' });
  };

  Model.remoteMethod('remote2', {
    isStatic: false,
    description: 'remote2',
    accessType: 'READ',
    accepts: [
    ],
    http: {
      verb: 'GET',
      path: '/remote2'
    },
    returns: {
      type: 'object',
      root: true
    }
  });
};


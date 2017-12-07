// import { HTTPMapper } from 'airborne-base';
// const HTTPMapper = require('airborne-base').HTTPMapper;

// class AuthMapper extends HTTPMapper {
//   constructor(di) {
//     super(di);
//     const { host, port } = di.get('config').auth;
//     this.host = host;
//     this.port = port;
//   }
//   load(params) {
//     this.path = '/access-token';
//     return super.get(params);
//   }
//   buildCollection(data) { // eslint-disable-line
//     return data.data.user;
//   }
// }

// module.exports = AuthMapper;
const HTTPMapper = require('airborne-base').HTTPMapper;
const request = require('superagent');

class AuthMapper extends HTTPMapper {
  constructor(di) {
    super(di);
    const { host, port } = di.get('config').auth;
    this.host = host;
    this.port = port;
  }
  load(params) {
    this.path = '/access-token';
    return request
      .get(`${this.host}:${this.port}${this.path}`)
      .query(params)
      .then(data => this.buildCollection(data));
  }
  buildCollection(data) { //eslint-disable-line
    return data.body.data.user;
  }
}

module.exports = AuthMapper;

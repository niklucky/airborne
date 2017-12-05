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
    console.log('===========================');
    console.log('AuthMapper', params);
    // if (params.token )
    this.path = '/access-token';
    return request
      .get(`${this.host}:${this.port}${this.path}`)
      .query(params)
      .then(data => this.buildCollection(data))
      // .catch((err) => {
      //   console.log('AuthMapper error', err.response.body);
      //   return err;
      // });
  }
  buildCollection(data) { //eslint-disable-line
    console.log('AuthMapper', data.body.data.user);
    return data.body.data.user;
  }
}

// export default AuthMapper;
module.exports = AuthMapper;

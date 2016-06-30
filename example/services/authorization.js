const https = require('http');

class Authorization {
  constructor (di) {
    this.di = di;
  }

  init () {
    let token = this.isTokenProvided();

    return new Promise((resolve, reject) => {
      https.get('http://192.168.99.100:443/authorize/token/?token=' + token, (res) => {
        // console.log('statusCode: ', res.statusCode);
        // console.log('headers: ', res.headers);
        res.on('data', (d) => {
          try {
            resolve(JSON.parse(d.toString()).data);
          } catch (e) {
            reject(Error('Auth server response error'));
          }
        });
      }).on('error', (e) => {
        reject(Error('Auth server error', e));
      });
    });
  }

  isTokenProvided () {
    if (!this.di.get('request').query.token) {
      throw Error('Token is not provided');
    }
    return this.di.get('request').query.token;
  }
}

module.exports = Authorization;

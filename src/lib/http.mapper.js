/* globals Promise */
const HTTP = require('http');
const QueryString = require('querystring');

const BaseMapper = require('./base.mapper');
const BaseModel = require('./base.model');

class HTTPMapper extends BaseMapper {
  constructor(di) {
    super(di);
    this.host = '127.0.0.1';
    this.port = 80;
    this.path = '';
    this.headers = [];
    this.provider = HTTP;
    this.Model = BaseModel;
  }
  get(params) {
    return this.request('GET', params);
  }
  load(params) {
    return this.request('GET', params);
  }

  create(params, postData) {
    return this.request('POST', params, postData);
  }

  update(params, putData) {
    return this.request('PUT', params, putData);
  }

  del(params) {
    return this.request('DELETE', params);
  }

  status(params) {
    return this.request('HEAD', params);
  }

  request(method, params, postData) {
    const data = QueryString.stringify(postData);
    const options = {
      hostname: this.host,
      port: this.port,
      path: this.path + '?' + QueryString.stringify(params),
      method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data)
      },
    };
    return new Promise((resolve, reject) => {
      const request = this.provider.request(options, (response) => {
        // console.log(`STATUS: ${response.statusCode}`);
        // console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          try {
            let result = chunk;
            if (response.headers['content-type'].indexOf('json') !== -1) {
              result = JSON.parse(chunk);
            }
            if (response.statusCode > 199 && response.statusCode < 301) {
              resolve(new this.Model(result));
            } else {
              reject({ message: 'Remote server error', stack: result });
            }
          } catch (e) {
            reject(e);
          }
        });
        // response.on('end', () => {
        //   console.log('No more data in response.')
        // });
      });
      request.on('error', (error) => {
        reject(Error(error));
      });

      if (postData) {
        request.write(data);
      }
      request.end();
      return request;
    });
  }
}

module.exports = HTTPMapper;

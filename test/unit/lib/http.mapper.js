import { expect } from 'chai';

import HttpMapper from '../../../src/lib/http.mapper';
import DI from '../../../src/core/di';

const response = {
  on: (event, callback) => {
    callback(JSON.stringify({ id: 1 }));
    // console.log('event, callback', event, callback);
  },
  setEncoding: (encoding) => {
    // console.log('encoding', encoding);
  },
  statusCode: 200,
  headers: {
    'content-type': 'application/json'
  }
};
const responseXML = {
  on: (event, callback) => {
    callback('<response>1</response>');
    // console.log('event, callback', event, callback);
  },
  setEncoding: (encoding) => {
    // console.log('encoding', encoding);
  },
  statusCode: 200,
  headers: {
    'content-type': 'application/xml'
  }
};
const responseFail = {
  on: (event, callback) => {
    callback(event);
    // console.log('event, callback', event, callback);
  },
  setEncoding: (encoding) => {
    // console.log('encoding', encoding);
  },
  statusCode: 500
};

const HTTP = {
  request: (options, callback) => {
    // console.log('options', options, callback);
    callback(response);
  }
};
const HTTPFail = {
  request: (options, callback) => {
    // console.log('options', options, callback);
    callback(responseFail);
  }
};
const HTTPXML = {
  request: (options, callback) => {
    // console.log('options', options, callback);
    callback(responseXML);
  }
};

const di = new DI();
const params = { id: 1, name: 'Test' };
const payload = { b: 2 };

describe('HttpMapper', () => {
  describe('Constructor', () => {
    it('constructor — empty di', () => {
      const mapper = () => new HttpMapper();
      expect(mapper).to.throw('you need to provide valid DI');
    });
    it('constructor — valid params', () => {
      const mapper = new HttpMapper(di);
      expect(mapper.Model).to.be.instanceof(Function);
      expect(mapper.di).to.be.instanceof(DI);
      expect(mapper.host).is.equal('127.0.0.1');
      expect(mapper.headers).is.an.instanceof(Object);
    });
  });
  describe('Methods', () => {
    it('get()', () => {
      const mapper = new HttpMapper(di);
      const result = mapper.load(params);
      expect(result).to.be.instanceof(Promise);
    });
    it('load()', () => {
      const mapper = new HttpMapper(di);
      const result = mapper.get(params);
      expect(result).to.be.instanceof(Promise);
    });
    it('create()', () => {
      const mapper = new HttpMapper(di);
      const result = mapper.create(params, payload);
      expect(result).to.be.instanceof(Promise);
    });
    it('update()', () => {
      const mapper = new HttpMapper(di);
      const result = mapper.update(params, payload);
      expect(result).to.be.instanceof(Promise);
    });
    it('status()', () => {
      const mapper = new HttpMapper(di);
      const result = mapper.status(params);
      expect(result).to.be.instanceof(Promise);
    });
    it('del()', () => {
      const mapper = new HttpMapper(di);
      const result = mapper.del(params);
      expect(result).to.be.instanceof(Promise);
    });
    it('request() with disabled server', () => {
      const mapper = new HttpMapper(di);
      mapper.provider = HTTP;

      const result = mapper.request('GET', params);

      result.catch((error) => {
        expect(error).to.be.instanceof(Error);
      });
    });
    it('request() with mocked server', () => {
      const mapper = new HttpMapper(di);
      mapper.provider = HTTP;

      const result = mapper.request('GET', params);

      result
        .then((data) => {
          expect(data).to.be.instanceof(Object);
        })
        .catch((error) => {
          // console.log('error', error);
          expect(error).to.be.instanceof(Error);
        });
    });
    it('request() with mocked server and response XML', () => {
      const mapper = new HttpMapper(di);
      mapper.provider = HTTPXML;

      const result = mapper.request('GET', params);

      result
        .then((data) => {
          expect(data).to.be.instanceof(Object);
        })
        .catch((error) => {
          // console.log('error', error);
          expect(error).to.be.instanceof(Error);
        });
    });
    it('request() with mocked fail server', () => {
      const mapper = new HttpMapper(di);
      mapper.provider = HTTPFail;
      const result = mapper.request('GET', params);

      result
        .then((data) => {
          expect(data).to.be.instanceof(Object);
        })
        .catch((error) => {
          // console.log('error', error);
          expect(error).to.be.instanceof(Error);  
        });
    });
    it('request() with mocked fail server with proper response', () => {
      const mapper = new HttpMapper(di);
      response.statusCode = 500;
      mapper.provider = HTTP;
      const result = mapper.request('GET', params);

      result
        .then((data) => {
          expect(data).to.be.instanceof(Object);
        })
        .catch((error) => {
          console.log('error', error);
          expect(error).to.be.instanceof(Error);
        });
    });
  });
});

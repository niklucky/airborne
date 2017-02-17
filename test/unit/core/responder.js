/* eslint-disable */
import { expect } from 'chai';
import Responder from '../../../src/core/responder';
import mocks from '../../mocks';

const { config, response } = mocks.responder;

describe('Responder', () => {
  describe('Constructor', () => {
    it('constructor — empty config', () => {
      const responder = () => new Responder();
      expect(responder).to.throw('config is not an object');
    });
    it('constructor — valid config', () => {
      const responder = new Responder(config);
      expect(responder.config).to.be.an('object');
      expect(responder.data).is.equal(null);
      expect(responder.response).to.be.an('object');
      expect(responder.statusCode).is.equal(200);
      expect(responder.error).is.equal(null);
    });
  });
  describe('Processing', () => {
    it('setData()', () => {
      const responder = new Responder(config);
      const result = responder.setData({ id: 1});
      expect(result).is.an.instanceof(Responder);
      expect(responder.data).is.an('object');
      expect(responder.data.id).is.equal(1);
    });
    it('getData() — empty data', () => {
      const responder = new Responder(config);
      const result = responder.getData();
      expect(responder.statusCode).is.equal(200);
      expect(result).is.an.instanceof(Object);
      expect(result).has.property('version');
      expect(result).has.property('root');
      expect(result).has.property('data');
      expect(result.data).is.equal(null);
    });
    it('getData() — non empty data', () => {
      const responder = new Responder(config);
      responder.setData({ id: 1 });
      const result = responder.getData();
      expect(result).to.be.an('object');
      expect(responder.statusCode).is.equal(200);
      expect(result).is.an.instanceof(Object);
      expect(result).has.property('version');
      expect(result).has.property('root');
      expect(result).has.property('data');
      expect(result).has.property('error');
      expect(result.data.id).is.equal(1);
    });
    it('setServerResponse() — not valid response object', () => {
      const responder = new Responder(config);
      const error = () => responder.setServerResponse()
      expect(error).to.throw('esponse is not an object');
    });
    it('setServerResponse() — response object without methods', () => {
      const responder = new Responder(config);
      const error = () => responder.setServerResponse({ status: null, send: null })
      expect(error).to.throw('response.status() and response.send() are not functions. server response object is invalid');
    });
    it('setServerResponse() — proper response', () => {
      const responder = new Responder(config);
      responder.setServerResponse(response);
      expect(responder.serverResponse).is.an('object');
      expect(responder.serverResponse).has.property('status');
      expect(responder.serverResponse).has.property('send');
      expect(responder.serverResponse.status).is.an('function');
      expect(responder.serverResponse.send).is.an('function');
    });
    it('send() — sending data with invalid server response', () => {
      const responder = new Responder(config);
      const error = () => responder.send()
      expect(error).to.throw('response is not an object');
    });
    it('send() — sending data with invalid server response', () => {
      const responder = new Responder(config);
      responder.setServerResponse(response);
      responder.send({});
      expect(responder.data).is.an('object');
    });
    it('send404() — sending 404 error response', () => {
      const responder = new Responder(config);
      responder.setServerResponse(response);
      responder.send404();
      expect(responder.error).is.an('object');
      expect(responder).has.property('error');
      expect(responder.statusCode).is.equal(404);
    });
    it('sendError() — sending error without code', () => {
      const responder = new Responder(config);
      responder.setServerResponse(response);
      responder.sendError({ });
      expect(responder).is.an('object');
      expect(responder).has.property('error');
      expect(responder.statusCode).is.equal(500);
    });
    it('sendError() — sending error with code', () => {
      const responder = new Responder(config);
      responder.setServerResponse(response);
      responder.sendError({ }, 401);
      expect(responder).has.property('error');
      expect(responder.error).is.an('object');
      expect(responder.statusCode).is.equal(401);
    });
    it('sendError() — sending error with message as string', () => {
      const responder = new Responder(config);
      responder.setServerResponse(response);
      responder.sendError('Error!', 400);
      expect(responder).has.property('error');
      expect(responder.error).is.an('object');
      expect(responder.error).has.property('message');
      expect(responder.error.message).is.equal('Error!');
      expect(responder.statusCode).is.equal(400);
    });
    it('sendError() — sending error with message as object', () => {
      const responder = new Responder(config);
      responder.setServerResponse(response);
      responder.sendError({ message: 'Error!' }, 400);
      expect(responder).has.property('error');
      expect(responder.error).is.an('object');
      expect(responder.error).has.property('message');
      expect(responder.error.message).is.equal('Error!');
      expect(responder.statusCode).is.equal(400);
    });
    it('sendError() — sending error with message as object: id', () => {
      const responder = new Responder(config);
      responder.setServerResponse(response);
      responder.sendError({ message: 'Error!', id: 101, code: 102 }, 400);
      expect(responder).has.property('error');
      expect(responder.error).is.an('object');
      expect(responder.error).has.property('message');
      expect(responder.error.message).is.equal('Error!');
      expect(responder.error).has.property('id');
      expect(responder.error).has.property('code');
      expect(responder.statusCode).is.equal(400);
    });
    it('sendError() — sending error with message and stackTrace for debug mode', () => {
      const responder = new Responder({ debug: true });
      expect(responder.config.debug).is.equal(true);
      responder.setServerResponse(response);
      responder.sendError({ message: 'Error!', stack: 'Error stacktrace' }, 400);
      expect(responder).has.property('error');
      expect(responder.error).is.an('object');
      expect(responder.error).has.property('message');
      expect(responder.error.message).is.equal('Error!');
      expect(responder.error).has.property('stack');
      expect(responder.error.stack).is.equal('Error stacktrace');
      expect(responder.statusCode).is.equal(400);
    });
  });
});
import Airborne from '../../src/index';
import { expect, assert } from 'chai';
import chaiHttp from 'chai-http';

const chai = require('chai');

const config = require('../../examples/simple/config/config.js');

const app = new Airborne(config);

// const request = require('request');

chai.use(chaiHttp);
describe('Users without Auth', () => {
  it('should return users array', (done) => {
    chai.request('http://localhost:3008')
      .get('/users')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.an('object');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('array');
        expect(res.body.error).to.equal(null);
        expect(res.body.data).to.have.length.above(1);
        done();
      });
  });
  it('should return concrete user object', (done) => {
    chai.request('http://localhost:3008')
      .get('/users/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.an('object');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.userId).to.equal(1);
        expect(res.body.error).to.equal(null);
        done();
      });
  });
  it('should return Route not found for PATCH /user', (done) => {
    chai.request('http://localhost:3008')
    .patch('/users')
    .end((err, res) => {
      expect(res).to.have.status(404);
      expect(res).to.be.an('object');
      expect(res.body).to.have.property('data');
      expect(res.body).to.have.property('error');
      expect(res.body.data).to.equal(null);
      expect(res.body.error).to.be.an('object');
      expect(res.body.error.message).to.equal('Route not found');
      done();
    });
  });
  it('should return Route not found for GET /use', (done) => {
    chai.request('http://localhost:3008')
    .patch('/use')
    .end((err, res) => {
      expect(res).to.have.status(404);
      expect(res).to.be.an('object');
      expect(res.body).to.have.property('data');
      expect(res.body).to.have.property('error');
      expect(res.body.data).to.equal(null);
      expect(res.body.error).to.be.an('object');
      expect(res.body.error.message).to.equal('Route not found');
      done();
    });
  });
});
describe('Orders with Auth', () => {
  it('should return orders array', (done) => {
    chai.request('http://localhost:3008')
      .get('/orders')
      .set('Authorization', 'fd89cf6c-7eaa-46d9-89dc-3f7acf5b2103')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.an('object');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('array');
        expect(res.body.error).to.equal(null);
        done();
      });
  });
  it('should return concrete order object', (done) => {
    chai.request('http://localhost:3008')
      .get('/orders/2')
      .set('Authorization', 'fd89cf6c-7eaa-46d9-89dc-3f7acf5b2103')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.an('object');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('object');
        expect(res.body.error).to.equal(null);
        done();
      });
  });
  it('should return Not autorized error', (done) => {
    chai.request('http://localhost:3008')
      .get('/orders/2')
      .set('Authorization', 'fd89cf6c')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res).to.be.an('object');
        expect(res.body).to.have.property('data');
        expect(res.body).to.have.property('error');
        expect(res.body.error.message).to.equal('Not authorized');
        expect(res.body.data).to.equal(null);
        done();
      });
  });
  it('should return Token is not provided error', (done) => {
    chai.request('http://localhost:3008')
      .get('/orders/2')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res).to.be.an('object');
        expect(res.body).to.have.property('data');
        expect(res.body).to.have.property('error');
        expect(res.body.error.message).to.equal('Token is not provided');
        expect(res.body.data).to.equal(null);
        done();
      });
  });
  it('should return Error: handler method required', (done) => {
    chai.request('http://localhost:3008')
      .get('/nohandler/')
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res).to.be.an('object');
        expect(res.body).to.have.property('data');
        expect(res.body).to.have.property('error');
        expect(res.body.error.message).to.equal(
          '[Fatal] routes config: handler method required'
        );
        expect(res.body.data).to.equal(null);
        done();
      });
  });
  it('POST with Auth testing', (done) => {
    chai.request('http://localhost:3008')
      .post('/orders/')
      .field('orderId', 26)
      .field('userId', 1)
      .set('Authorization', 'fd89cf6c-7eaa-46d9-89dc-3f7acf5b2103')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.an('object');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.orderId).to.equal(26);
        expect(res.body.error).to.equal(null);
        done();
      });
  });
  it('POST with Auth should return Not Authorized', (done) => {
    chai.request('http://localhost:3008')
      .post('/orders/')
      .field('orderId', 26)
      .field('userId', 1)
      .set('Authorization', 'fd89cf6c-7e2103')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res).to.be.an('object');
        expect(res.body).to.have.property('data');
        expect(res.body).to.have.property('error');
        expect(res.body.error.message).to.equal('Not authorized');
        expect(res.body.data).to.equal(null);
        done();
      });
  });
  it('POST with Auth should return Token is not provided', (done) => {
    chai.request('http://localhost:3008')
      .post('/orders/')
      .field('orderId', 26)
      .field('userId', 1)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res).to.be.an('object');
        expect(res.body).to.have.property('data');
        expect(res.body).to.have.property('error');
        expect(res.body.error.message).to.equal('Token is not provided');
        expect(res.body.data).to.equal(null);
        done();
      });
  });
});

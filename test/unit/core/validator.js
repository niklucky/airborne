/* eslint-disable */
import { expect } from 'chai';
import Validator from '../../../src/core/validator';
import mocks from '../../mocks';

const { rules, data } = mocks.validator;

const file = {
  path: '/tmp/111',
  name: '1.jpg',
  size: 2000,
  type: 'image/jpeg'
};
const extraRules = {
  type: 'file',
  fileTypes: ['jpg'],
  required: true
};

describe('Validator', () => {
  describe('Constructor', () => {
    it('constructor — empty rules', () => {
      const validator = () => new Validator();
      expect(validator).to.throw('Validator rules are invalid');
    });
    it('constructor — rules defined, options undefined', () => {
      const validator = new Validator(rules.load);
      expect(validator.rules).is.an('object');
      expect(validator.rules.id).is.an('object');
      expect(validator.errors).to.be.null;
      expect(validator.result).to.be.true;
    });
    it('setRules — rules are valid', () => {
      const validator = new Validator(rules.load);
      const result = validator.setRules(rules.load);
      expect(validator.rules).is.an('object');
      expect(validator.rules.id).is.an('object');
      expect(result).is.an.instanceOf(Validator);
    });
  });
  describe('Validation', () => {
    it('validate with empty data object', () => {
      const validator = new Validator(rules.load);
      const result = validator.validate({});
      expect(result).is.an('object');
      expect(result.validated).to.be.null;
      expect(result.result).to.be.false;
    });
    it('validate all rules in params', () => {
      const validator = new Validator(rules.load);
      const result = validator.validate(data[0]);
      expect(result).is.an('object');
      expect(result.validated).is.an('object');
      expect(result.validated.params).is.an('object');
      expect(result.result).to.be.true;
      expect(result.validated.params.id).is.equal(1);
      expect(result.validated.params.name).is.equal('Test');
      expect(result.validated.params.isActive).to.be.true;
    });
    it('validate all rules in params and payload', () => {
      const validator = new Validator(rules.load);
      const result = validator.validate(data[1]);
      expect(result).is.an('object');
      expect(result.validated).is.an('object');
      expect(result.validated.params).is.an('object');
      expect(result.validated.payload).is.an('object');
      expect(result.result).to.be.true;
      expect(result.validated.params.id).is.equal(1);
      expect(result.validated.params.name).is.equal('Test');
      expect(result.validated.params.price).is.equal(10.2);
      expect(result.validated.params.isActive).to.be.true;

      expect(result.validated.payload.data).is.an('object');
      expect(result.validated.payload.options).is.an('array');
    });
    it('validateNumber is not a number', () => {
      const validator = new Validator(rules.load);
      const result = validator.validateNumber('key', null);
      expect(result).to.be.false;
    });
    it('validateNumber is not a number (string)', () => {
      const validator = new Validator(rules.load);
      const result = validator.validateNumber('key', 'abc');
      expect(result).to.be.false;
    });
    it('validateNumber is a number', () => {
      const validator = new Validator(rules.load);
      const result = validator.validateNumber('key', 123);
      expect(result).is.equal(123);
    });
    it('validateNumber is a number (from string)', () => {
      const validator = new Validator(rules.load);
      const result = validator.validateNumber('key', '123');
      expect(result).is.equal(123);
    });
    it('validateFloat is not a number (null)', () => {
      const validator = new Validator(rules.load);
      const result = validator.validateFloat('key', null);
      expect(result).to.be.false;
    });
    it('validateFloat is not a number (string)', () => {
      const validator = new Validator(rules.load);
      const result = validator.validateFloat('key', 'abc');
      expect(result).to.be.false;
    });
    it('validateFloat is a number', () => {
      const validator = new Validator(rules.load);
      const result = validator.validateFloat('key', 123.456);
      expect(result).is.equal(123.456);
    });    
    it('validateFloat is a number (from string)', () => {
      const validator = new Validator(rules.load);
      const result = validator.validateFloat('key', '123.456');
      expect(result).is.equal(123.456);
    });
    it('validateBoolean is not a boolean (null)', () => {
      const validator = new Validator(rules.load);
      const result = validator.validateBoolean('key', null);
      expect(result).to.be.false;
    });
    it('validateBoolean is not a boolean (string)', () => {
      const validator = new Validator(rules.load);
      const result = validator.validateBoolean('key', 'abc');
      expect(result).to.be.false;
    });
    it('validateBoolean is a boolean', () => {
      const validator = new Validator(rules.load);
      const result = validator.validateBoolean('key', true);
      expect(result).is.equal(true);
    });    
    it('validateBoolean is a boolean (from string)', () => {
      const validator = new Validator(rules.load);
      const result = validator.validateBoolean('key', 'true');
      expect(result).is.equal(true);
    });
    it('validateBoolean is a boolean (from number == 1)', () => {
      const validator = new Validator(rules.load);
      const result = validator.validateBoolean('key', 1);
      expect(result).is.equal(true);
    });
    it('validateBoolean is a boolean (from number != 1)', () => {
      const validator = new Validator(rules.load);
      const result = validator.validateBoolean('key', 22);
      expect(result).is.equal(false);
      expect(validator.errors).is.equal(null);
    });
    it('validateString is not a string (null)', () => {
      const validator = new Validator(rules.load);
      const result = validator.validateString('key', null);
      expect(result).to.be.false;
    });
    it('validateString is a string (string)', () => {
      const validator = new Validator(rules.load);
      const result = validator.validateString('key', 'abc');
      expect(result).is.equal('abc');
    });
    it('validateArray is a not an array (null)', () => {
      const validator = new Validator(rules.load);
      const result = validator.validateArray('key', null);
      expect(result).is.equal(false);
    });
    it('validateArray is a not an array (string)', () => {
      const validator = new Validator(rules.load);
      const result = validator.validateArray('key', '[1,2]');
      expect(result).is.equal(false);
    });
    it('validateArray is a not an array (number)', () => {
      const validator = new Validator(rules.load);
      const result = validator.validateArray('key', 1);
      expect(result).is.equal(false);
    });
    it('validateArray is an array', () => {
      const arr = [0, 1];
      const validator = new Validator(rules.load);
      const result = validator.validateArray('key', arr);
      expect(result).is.equal(arr);
    });
    it('validateArray is an object', () => {
      const arr = { id: 1, name: "Test" };
      const validator = new Validator(rules.load);
      const result = validator.validateArray('key', arr);
      expect(result).is.equal(false);
    });
    it('validateObject is a not an object (null)', () => {
      const validator = new Validator(rules.load);
      const result = validator.validateObject('key', null);
      expect(result).is.equal(false);
    });
    it('validateObject is a not an object (string)', () => {
      const validator = new Validator(rules.load);
      const result = validator.validateObject('key', '[1,2]');
      expect(result).is.equal(false);
    });
    it('validateObject is a not an object (number)', () => {
      const validator = new Validator(rules.load);
      const result = validator.validateObject('key', 1);
      expect(result).is.equal(false);
    });
    it('validateObject is an object', () => {
      const arr = [0, 1];
      const validator = new Validator(rules.load);
      const result = validator.validateObject('key', arr);
      expect(result).is.equal(arr);
    });
    it('validateObject is an object', () => {
      const arr = { id: 1, name: "Test" };
      const validator = new Validator(rules.load);
      const result = validator.validateObject('key', arr);
      expect(result).is.equal(arr);
    });
    it('validateFile — empty object', () => {
      const validator = new Validator(rules.load);
      const result = validator.validateFile('file', null);
      expect(result).is.equal(false);
    });
    it('validateFile — valid object with no extra rules', () => {
      const validator = new Validator(rules.load);
      const result = validator.validateFile('file', file);
      expect(result).is.equal(file);
    });
    it('validateFile — valid object with extra rules (no size)', () => {
      const validator = new Validator(rules.load);
      const result = validator.validateFile('file', file, extraRules);
      expect(result).is.equal(file);
    });
    it('validateFile — valid object with extra rules', () => {
      const validator = new Validator(rules.load);
      extraRules.size = 2;
      const result = validator.validateFile('file', file, extraRules);
      expect(result).is.equal(file);
    });
  });
  describe('Set result & error', () => {
    it('setResult(false) with this.result === false', () => {
      const validator = new Validator(rules.load);
      validator.result = false;
      const result = validator.setResult(false);
      expect(result).to.be.false;
    });
    it('setResult(true) with this.result === false', () => {
      const validator = new Validator(rules.load);
      validator.result = false;
      const result = validator.setResult(true);
      expect(result).to.be.false;
    });
    it('setResult(true) with this.result === true', () => {
      const validator = new Validator(rules.load);
      validator.result = true;
      const result = validator.setResult(true);
      expect(result).to.be.true;
    });
    it('setResult(false) with this.result === true', () => {
      const validator = new Validator(rules.load);
      validator.result = true;
      const result = validator.setResult(false);
      expect(result).to.be.false;
    });

    it('setError(key, value, type) with this.errors === null', () => {
      const validator = new Validator(rules.load);
      validator.setError('key', 1, 'string');
      expect(validator.errors).is.an('object');
      expect(validator.errors['key']).is.equal('key value (1) is not string');
    });
    it('setError(key, value, type) with this.errors !== null', () => {
      const validator = new Validator(rules.load);
      validator.setError('key', 1, 'string');
      validator.setError('key2', 2, 'string');
      expect(validator.errors).is.an('object');
      expect(validator.errors['key']).is.equal('key value (1) is not string');
    });
  });  
});
/* eslint-enable */

import { expect, assert } from 'chai';
import Validator from '../../src/core/validator';
import mocks from '../mocks.js';
const { rules, data } = mocks.validator;

describe('Validator', () => {
  describe('Constructor', () => {
    it('constructor — empty params', () => {
      const validator = new Validator();
      expect(validator.rules).to.be.undefined;
      expect(validator.errors).to.be.null;
      expect(validator.result).to.be.true;
    });
    it('constructor — rules defined, options undefined', () => {
      const validator = new Validator(rules.load);
      expect(validator.rules).is.an('object');
      expect(validator.rules.id).is.an('object');
      expect(validator.errors).to.be.null;
      expect(validator.result).to.be.true;
    });
    it('setRules — rules are invalid', () => {
      const validator = new Validator();
      expect(validator.setRules).to.throw(Error, /Validator rules are invalid/);
    });
    it('setRules — rules are valid', () => {
      const validator = new Validator();
      const result = validator.setRules(rules.load);
      expect(validator.rules).is.an('object');
      expect(validator.rules.id).is.an('object');
      expect(result).is.an.instanceOf(Validator);
    });
  });
  describe('Validation', () => {
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
  });
});

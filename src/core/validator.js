const sanitizer = require('sanitizer');
// import capitalize from 'lodash/capitalize';

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
const AVAILABLE_RULES = ['number', 'float', 'string', 'boolean', 'array', 'object'];

class Validator {
  constructor(rules) {
    this.rules = rules;
    this.errors = null;
    this.result = true;
  }
  setRules(rules) {
    if (typeof rules !== 'object') {
      throw new Error('Fatal: Validator rules are invalid. You either correct rules in controller or disable validation in Engine init');
    }
    this.rules = rules;
    return this;
  }

  validate(data) {
    this.data = data;
    if (data.params === undefined) {
      this.data.params = {};
    }

    if (data.payload === undefined) {
      this.data.payload = {};
    }

    this.validated = {
      params: {},
      payload: {},
    };
    for (const key of Object.keys(this.rules)) {
      const rule = this.rules[key];
      if (this.data.params[key] === undefined && this.data.payload[key] === undefined) {
        if (rule.required) {
          this.setResult(false);
          this.setError(key, undefined, 'defined');
        }
        continue; // eslint-disable-line no-continue
      }
      let mode = 'params';

      if (this.data.payload[key] !== undefined) {
        mode = 'payload';
      }

      const method = 'validate' + rule.type.capitalize();
      if (AVAILABLE_RULES.indexOf(rule.type) !== -1 && typeof this[method] === 'function') {
        this.validated[mode][key] = this[method](key, this.data[mode][key]);
      }
    }
    return {
      result: this.result,
      validated: (this.result) ? this.validated : null,
      errors: this.errors,
    };
  }

  validateNumber(key, inputValue) {
    const value = parseInt(inputValue, 10);

    if (typeof value === 'number') {
      this.setResult(true);
      return value;
    }
    this.setError(key, value, 'number');
    return this.setResult(false);
  }

  validateFloat(key, inputValue) {
    const value = parseFloat(inputValue, 10);

    if (typeof value === 'number') {
      this.setResult(true);
      return value;
    }
    this.setError(key, value, 'number');
    return this.setResult(false);
  }

  validateBoolean(key, inputValue) {
    let value = inputValue;
    if (typeof value === 'number') {
      value = (value === 1) ? true : false;
    }
    if (typeof value === 'boolean') {
      this.setResult(true);
      return value;
    }
    this.setError(key, value, 'boolean');
    return this.setResult(false);
  }

  validateString(key, inputValue) {
    let value = inputValue;
    if (typeof value === 'string') {
      value = sanitizer.sanitize(value);
      this.setResult(true);
      return value;
    }
    this.setError(key, value, 'string');
    return this.setResult(false);
  }

  validateArray(key, value) {
    if (Array.isArray(value)) {
      this.setResult(true);
      return value;
    }
    this.setError(key, value, 'array');
    return this.setResult(false);
  }

  validateObject(key, value) {
    if (typeof value === 'object') {
      this.setResult(true);
      return value;
    }
    this.setError(key, value, 'object');
    return this.setResult(false);
  }

  setResult(result) {
    if (this.result === false && result === true) {
      return false;
    }
    this.result = result;
    return result;
  }

  setError(key, value, type) {
    if (this.errors === null) {
      this.errors = {};
    }
    this.errors[key] = `${key} value (${value}) is not ${type}`;
  }
}

export default Validator;

const sanitizer = require('sanitizer');

class Validator {
  constructor(rules, options) {
    this.rules = rules;
    this.options = options;
    this.errors = null;
    this.result = true;
  }
  setRules(rules) {
    this.rules = rules;
    return this;
  }

  setOptions(options) {
    this.options = options;
    return this;
  }

  validate(data) {
    this.data = data;
    this.validated = {
      params: {},
      payload: {},
    };
    for (const key of Object.keys(this.rules)) {
      const rule = this.rules[key];

      if (this.data.params[key] === undefined && this.data.payload[key] === undefined) {
        if (rule.required) {
          this.setResult(false);
          this.setError(key, undefined, 'presented');
        }
        continue; // eslint-disable-line no-continue
      }
      let mode = 'params';

      if (this.data.payload[key] !== undefined) {
        mode = 'payload';
      }

      if (rule.type === 'number') {
        this.validated[mode][key] = this.validateNumber(key, this.data[mode][key]);
      }
      if (rule.type === 'string') {
        this.validated[mode][key] = this.validateString(key, this.data[mode][key]);
      }
      if (rule.type === 'array') {
        this.validated[mode][key] = this.validateArray(key, this.data[mode][key]);
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
    if (typeof value === 'object') {
      this.setResult(true);
      return value;
    }
    this.setError(key, value, 'array');
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

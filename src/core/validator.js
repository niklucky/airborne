import sanitizer from 'sanitizer';
import capitalize from 'lodash/capitalize';

const AVAILABLE_RULES = ['number', 'float', 'string', 'boolean', 'array', 'object', 'file'];
const FILE_TYPES = {
  jpg: ['image/jpeg', 'image/jpg'],
  gif: ['image/gif'],
  png: ['image/png']
};

class Validator {
  constructor(rules) {
    this.setRules(rules);
    this.errors = null;
    this.result = true;
  }
  setRules(rules) {
    if (rules instanceof Object === false) {
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

      const method = 'validate' + capitalize(rule.type);
      /* istanbul ignore else */
      if (AVAILABLE_RULES.indexOf(rule.type) !== -1 && typeof this[method] === 'function') {
        this.validated[mode][key] = this[method](key, this.data[mode][key], rule);
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

    if (typeof value === 'number' && !isNaN(value)) {
      this.setResult(true);
      return value;
    }
    this.setError(key, value, 'number');
    return this.setResult(false);
  }

  validateFloat(key, inputValue) {
    const value = parseFloat(inputValue, 10);

    if (typeof value === 'number' && !isNaN(value)) {
      this.setResult(true);
      return value;
    }
    this.setError(key, value, 'number');
    return this.setResult(false);
  }

  validateBoolean(key, inputValue) {
    let value = inputValue;
    if (typeof value === 'number') {
      value = (value === 1);
    }
    if (typeof value === 'string') {
      value = (value === 'true');
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
    if (value instanceof Object) {
      this.setResult(true);
      return value;
    }
    this.setError(key, value, 'object');
    return this.setResult(false);
  }
  validateFile(key, inputValue, rule) {
    /* istanbul ignore else */
    if (inputValue instanceof Object === true) {
      /* istanbul ignore else */
      if (
        inputValue.name !== undefined &&
        inputValue.path !== undefined &&
        inputValue.size !== undefined
      ) {
        let typeValid = true;
        let sizeValid = true;

        if (rule !== undefined) {
          const size = inputValue.size / 1000000;
          const ruleSize = (rule.size) ? rule.size : 2;
          sizeValid = (size <= ruleSize);

          /* istanbul ignore else */
          if (rule.fileTypes !== undefined) {
            let types = [];
            for (const type of rule.fileTypes) {
              /* istanbul ignore else */
              if (FILE_TYPES[type] !== undefined) {
                types = [...types, ...FILE_TYPES[type]];
              }
            }
            typeValid = (types.indexOf(inputValue.type) !== -1);
          }
        }
        /* istanbul ignore else */
        if (sizeValid && typeValid) {
          this.setResult(true);
          return inputValue;
        }
      }
    }
    this.setError(key, inputValue, 'file object');
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

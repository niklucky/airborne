'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var sanitizer = require('sanitizer');

var Validator = function () {
  function Validator(rules, options) {
    _classCallCheck(this, Validator);

    this.rules = rules;
    this.options = options;
    this.errors = null;
    this.result = true;
  }

  _createClass(Validator, [{
    key: 'setRules',
    value: function setRules(rules) {
      this.rules = rules;
      return this;
    }
  }, {
    key: 'setOptions',
    value: function setOptions(options) {
      this.options = options;
      return this;
    }
  }, {
    key: 'validate',
    value: function validate(data) {
      this.data = data;
      this.validated = {
        params: {},
        payload: {}
      };
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(this.rules)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var i = _step.value;

          var key = Object.keys(this.rules)[i];
          var rule = this.rules[key];

          if (this.data.params[key] === undefined && this.data.payload[key] === undefined) {
            if (rule.required) {
              this.setResult(false);
              this.setError(key, undefined, 'presented');
            }
            continue; // eslint-disable-line no-continue
          }
          var mode = 'params';

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
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return {
        result: this.result,
        validated: this.result ? this.validated : null,
        errors: this.errors
      };
    }
  }, {
    key: 'validateNumber',
    value: function validateNumber(key, inputValue) {
      var value = parseInt(inputValue, 10);

      if (typeof value === 'number') {
        this.setResult(true);
        return value;
      }
      this.setError(key, value, 'number');
      return this.setResult(false);
    }
  }, {
    key: 'validateString',
    value: function validateString(key, inputValue) {
      var value = inputValue;
      if (typeof value === 'string') {
        value = sanitizer.sanitize(value);
        this.setResult(true);
        return value;
      }
      this.setError(key, value, 'string');
      return this.setResult(false);
    }
  }, {
    key: 'validateArray',
    value: function validateArray(key, value) {
      if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
        this.setResult(true);
        return value;
      }
      this.setError(key, value, 'array');
      return this.setResult(false);
    }
  }, {
    key: 'setResult',
    value: function setResult(result) {
      if (this.result === false && result === true) {
        return false;
      }
      this.result = result;
      return result;
    }
  }, {
    key: 'setError',
    value: function setError(key, value, type) {
      if (this.errors === null) {
        this.errors = {};
      }
      this.errors[key] = key + ' value (' + value + ') is not ' + type;
    }
  }]);

  return Validator;
}();

module.exports = Validator;
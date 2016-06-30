class Validator {
  constructor(rules, options) {
    this.rules = rules;
    this.options = options;
    this.errors = null;
    this.result = true;
  }
  setRules(rules){
    this.rules = rules;
    return this;
  }

  setOptions(options){
    this.options = options;
    return this;
  }

  validate(data){
    this.data = data;
    this.validated = {};
    for( var key in this.rules){
      if(this.rules.hasOwnProperty(key)){
        let rule = this.rules[key];

        if(this.data[key] == undefined){
          if(rule.required){
            this.setResult(false);
            this.setError(key, undefined, 'presented');
          }
          continue;
        }

        if(rule.type == 'number'){
          if( this.validateNumber(key, this.data[key]) ){
            this.validated[key] = this.data[key];
          }
        }
        if(rule.type == 'string'){
          if( this.validateString(key, this.data[key]) ){
            this.validated[key] = this.data[key];
          }
        }
        if(rule.type == 'array'){
          if (this.validateArray(key, this.data[key]) ){
            this.validated[key] = this.data[key];
          }
        }
      }
    }
    return {
      result: this.result,
      validated: (this.result) ? this.validated : null,
      errors: this.errors
    }
  }

  validateNumber(key, value){
    if(this.options.convertStringToNumber){
      this.data[key] = value = parseInt(value);
    }

    if (typeof value === 'number'){
      return this.setResult(true);
    }
    this.setResult(false);
    this.setError(key, value, 'number');

  }

  validateString(key, value){
    if (typeof value === 'string'){
      return this.setResult(true);
    }
    this.setResult(false);
    this.setError(key, value, 'string');
  }
  validateArray(key, value){
    if (typeof value === 'object'){
      return this.setResult(true);
    }
    this.setResult(false);
    this.setError(key, value, 'array');
  }

  setResult(result){
    if(this.result === false && result === true) {
      return false;
    }
    this.result = result;
    return result;
  }

  setError(key, value, type){
    if(this.errors === null){
      this.errors = {};
    }
    this.errors[key] = key + ' value (' + value + ') is not ' + type;
  }
}

module.exports = Validator;

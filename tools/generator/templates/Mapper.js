const {%MAPPER_EXTENDS%} = require('airborne');
const %MODEL% = require('%MODEL_PATH%');

class %MAPPER%Mapper extends %MAPPER_EXTENDS% {
  constructor(di) {
    super(di);
    this.dbTable = di.get('config').repository.%MODEL_REPOSITORY%;
    this.db = this.di.get('db').connections.%MODEL_CONNECTION%;
    this.Model = %MODEL%;
  }
}

module.exports = %MAPPER%Mapper;

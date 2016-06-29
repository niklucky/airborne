import BaseModel from './base.model';

class BaseMapper {

  constructor(di) {
    this.di = di;
    this.Model = BaseModel;
  }
  build(object) {
    return new this.Model(object);
  }
}

export default BaseMapper;

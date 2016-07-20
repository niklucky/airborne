class DI {
  constructor () {
    this.di = {};
  }

  merge(di){
    
  }

  set (diName, diValue) {
    this.di[diName] = diValue;
    return this;
  }

  get (diName) {
    return this.di[diName];
  }
}

module.exports = DI;

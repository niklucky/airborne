class DI {
  constructor () {
    this.di = {};
  }

  merge(DI){
    for( let name in DI.di){
      this.set(name, DI.di[name]);
    }
    return this;
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

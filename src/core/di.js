class DI {
  constructor() {
    this.di = {};
  }

  merge(di) {
    this.di = Object.assign({}, this.di, di.di);
    return this;
  }

  set(diName, diValue) {
    this.di[diName] = diValue;
    return this;
  }

  get(diName) {
    return this.di[diName];
  }
}

export default DI;

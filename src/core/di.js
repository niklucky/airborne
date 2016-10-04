class DI {
  constructor() {
    this.di = {};
  }

  merge(di) {
    for (const key of Object.keys(di.di)) {
      const name = Object.keys(di.di)[key];
      this.set(name, di.di[name]);
    }
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

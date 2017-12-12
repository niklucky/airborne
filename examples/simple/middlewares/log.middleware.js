class LogMiddleware {
  constructor(di) {
    this.di = di;
  }
  Init() {
    try {
      const url = this.di.get('request').originalUrl;
      const method = this.di.get('request').method;
      const currDate = new Date().toISOString();
      console.log(`[LOG] Request for ${method}: ${url} made at ${currDate}`);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

module.exports = LogMiddleware;

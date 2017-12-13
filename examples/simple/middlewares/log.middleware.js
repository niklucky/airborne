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
    } catch (err) {
      console.log(err);
      throw new Error(`Error in LogMiddleware: ${err}`);
    }
  }
}

module.exports = LogMiddleware;

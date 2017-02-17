class Responder {
  constructor(config) {
    if (typeof config !== 'object') {
      throw new Error('[Fatal] Responder error: config is not an object');
    }
    this.config = config;
    this.statusCode = 200;
    this.data = null;
    this.error = null;
    this.response = {};
    this.serverResponse = null;
    this.isResponseSent = false;
  }

  setServerResponse(response) {
    this.serverResponse = response;
    this.checkServerResponse();
    return this;
  }

  checkServerResponse() {
    if (!(this.serverResponse instanceof Object)) {
      throw new Error('[Fatal] Reponder error: response is not an object');
    }
    if (typeof this.serverResponse.status !== 'function' || typeof this.serverResponse.send !== 'function') {
      throw new Error('[Fatal] Reponder error: response.status() and response.send() are not functions. server response object is invalid');
    }
  }

  setData(data) {
    this.data = data;
    return this;
  }

  sendError(errorData, statusCode = 500) {
    this.statusCode = statusCode;
    let error = {};

    if (typeof errorData === 'string') {
      error.message = errorData;
    } else {
      error = errorData;
      if (this.config.debug === false) {
        delete error.stackTrace;
      }
    }
    this.error = error;
    this.send(null);
  }

  send404() {
    this.sendError({ message: 'Route not found' }, 404);
  }

  send(data) {
    if (this.isResponseSent === false) {
      this.checkServerResponse();
      this.setData(data);
      this.serverResponse.status(this.statusCode);
      this.serverResponse.send(
        this.getData()
      );
      this.isResponseSent = true;
    }
  }
  getData() {
    return this.decorator(this.data, this.error);
  }
  decorator(data, error) {
    return {
      version: this.config.apiVersion,
      root: `${this.config.protocol}://${this.config.apiHost}`,
      data,
      error
    };
  }
}

export default Responder;

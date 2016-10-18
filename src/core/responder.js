class Responder {
  constructor(config) {
    if (typeof config !== 'object') {
      throw new Error('[Fatal] Responder error: config is not an object');
    }
    this.config = config;
    this.statusCode = 200;
    this.data = null;
    this.errorId = 0;
    this.errorMessage = null;
    this.response = {};
    this.i = 0;
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

  get() {
    const contentLength = (this.data) ? JSON.stringify(this.data).length : 0;
    const body = (this.data) ? this.data : '';
    return {
      statusCode: this.statusCode,
      contentLength,
      body,
    };
  }

  sendError(error, statusCode = 500) {
    this.statusCode = statusCode;
    const message = (typeof error === 'string') ? { error } : { error: error.message };
    if (this.config.debug === true) {
      message.stackTrace = error.stack;
    }
    this.send(message);
  }

  send404() {
    this.sendError({ message: 'Route not found' }, 404);
  }

  send(data) {
    if (this.isResponseSent === false) {
      this.checkServerResponse();
      this.setData(data);
      this.serverResponse.status(this.get().statusCode);
      this.serverResponse.send(
        this.get().body
      );
      this.isResponseSent = true;
    }
  }
}

export default Responder;

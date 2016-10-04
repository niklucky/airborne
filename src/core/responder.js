class Responder {
  constructor(config) {
    this.config = config;
    this.statusCode = 200;
    this.data = {};
    this.errorId = 0;
    this.errorMessage = null;
    this.response = {};
    this.i = 0;
  }

  setData(data) {
    this.data = data;
    return this;
  }

  get() {
    const contentLength = (this.data) ? JSON.stringify(this.data).length : 0;
    const links = (this.data) ? this.data._links : null;
    return {
      statusCode: this.statusCode,
      links: this.prepareHeaderLinks(links),
      contentLength,
      body: this.data,
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
    this.setData(data);
    this.serverResponse.status(this.get().statusCode);
    this.serverResponse.send(
      this.get().body
    );
  }

  setServerResponse(response) {
    this.serverResponse = response;
  }

  prepareHeaderLinks(links) {
    if (!links) {
      return '';
    }
    this.headerLinks = [];
    for (const link of links) {
      this.headerLinks.push(
        `<${link.schema}>; rel="${link.rel}"`
      );
    }
    return this.headerLinks.join(',');
  }
}

export default Responder;

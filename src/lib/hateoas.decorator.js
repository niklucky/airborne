

class HATEOASDecorator {

  constructor() {
    this.settings = {};
  }

  setSettings(settings) {
    this.settings = settings;
    return this;
  }

  decorate(data, settings) {
    this.setSettings(settings);
    if (data.collection) {
      return this.decorateCollection(data);
    }
    return data;
  }

  decorateCollection(inputData) {
    const data = inputData;
    for (const i of data.collection) {
      data.collection[i]._links = this.getItemLinks(data.collection[i]);
    }
    data._links = this.getCollectionLinks();
    return data;
  }

  getCollectionLinks() {
    const links = [];
    for (const i of this.settings.collection) {
      const item = this.settings.collection[i];
      links.push({
        rel: i,
        method: item.method,
        url: (item.url || this.getUrl()),
        // schema:
      });
    }
    return links;
  }

  getUrl() {
    return this.settings._host + this.settings._url;
  }

  getItemLinks(item) {
    const links = [];
    for (const i of this.settings.item) {
      const linkItem = this.settings.item[i];
      links.push({
        rel: i,
        method: linkItem.method,
        url: `${linkItem.url || this.getUrl()}/${item.id}`,
        // schema:
      });
    }

    return links;
  }
}

module.exports = new HATEOASDecorator();

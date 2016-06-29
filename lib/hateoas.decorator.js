"use strict";
class HATEOASDecorator {

  constructor() {
    this.settings = {};
  }

  setSettings(settings){
    this.settings = settings;
    return this;
  }

  decorate(data, settings){
    this.setSettings(settings);
    if(data.collection){
      return this.decorateCollection(data);
    }
    return data;
  }

  decorateCollection(data){

    for( var i in data.collection){
      data.collection[i]._links = this.getItemLinks(data.collection[i]);
    }
    data._links = this.getCollectionLinks();
    return data;
  }

  getCollectionLinks(){
    var links = [];
    for( var i in this.settings.collection){
      let item = this.settings.collection[i];
      links.push({
        rel: i,
        method: item.method,
        url: (item.url || this.getUrl() )
        //schema:
      });
    }
    return links;
  }

  getUrl(){
    return this.settings._host + this.settings._url;
  }

  getItemLinks(item){
    var links = [];
    for( var i in this.settings.item){
      let linkItem = this.settings.item[i];
      links.push({
        rel: i,
        method: linkItem.method,
        url: (linkItem.url || this.getUrl() ) + '/' + item.id
        //schema:
      });
    }

    return links;
  }
}

module.exports = new HATEOASDecorator();

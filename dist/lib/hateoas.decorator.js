'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HATEOASDecorator = function () {
  function HATEOASDecorator() {
    _classCallCheck(this, HATEOASDecorator);

    this.settings = {};
  }

  _createClass(HATEOASDecorator, [{
    key: 'setSettings',
    value: function setSettings(settings) {
      this.settings = settings;
      return this;
    }
  }, {
    key: 'decorate',
    value: function decorate(data, settings) {
      this.setSettings(settings);
      if (data.collection) {
        return this.decorateCollection(data);
      }
      return data;
    }
  }, {
    key: 'decorateCollection',
    value: function decorateCollection(data) {

      for (var i in data.collection) {
        data.collection[i]._links = this.getItemLinks(data.collection[i]);
      }
      data._links = this.getCollectionLinks();
      return data;
    }
  }, {
    key: 'getCollectionLinks',
    value: function getCollectionLinks() {
      var links = [];
      for (var i in this.settings.collection) {
        var item = this.settings.collection[i];
        links.push({
          rel: i,
          method: item.method,
          url: item.url || this.getUrl()
          //schema:
        });
      }
      return links;
    }
  }, {
    key: 'getUrl',
    value: function getUrl() {
      return this.settings._host + this.settings._url;
    }
  }, {
    key: 'getItemLinks',
    value: function getItemLinks(item) {
      var links = [];
      for (var i in this.settings.item) {
        var linkItem = this.settings.item[i];
        links.push({
          rel: i,
          method: linkItem.method,
          url: (linkItem.url || this.getUrl()) + '/' + item.id
          //schema:
        });
      }

      return links;
    }
  }]);

  return HATEOASDecorator;
}();

module.exports = new HATEOASDecorator();
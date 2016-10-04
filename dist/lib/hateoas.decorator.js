"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HATEOASDecorator = function () {
  function HATEOASDecorator() {
    _classCallCheck(this, HATEOASDecorator);

    this.settings = {};
  }

  _createClass(HATEOASDecorator, [{
    key: "setSettings",
    value: function setSettings(settings) {
      this.settings = settings;
      return this;
    }
  }, {
    key: "decorate",
    value: function decorate(data, settings) {
      this.setSettings(settings);
      if (data.collection) {
        return this.decorateCollection(data);
      }
      return data;
    }
  }, {
    key: "decorateCollection",
    value: function decorateCollection(inputData) {
      var data = inputData;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = data.collection[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var i = _step.value;

          data.collection[i]._links = this.getItemLinks(data.collection[i]);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      data._links = this.getCollectionLinks();
      return data;
    }
  }, {
    key: "getCollectionLinks",
    value: function getCollectionLinks() {
      var links = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.settings.collection[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var i = _step2.value;

          var item = this.settings.collection[i];
          links.push({
            rel: i,
            method: item.method,
            url: item.url || this.getUrl()
          });
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return links;
    }
  }, {
    key: "getUrl",
    value: function getUrl() {
      return this.settings._host + this.settings._url;
    }
  }, {
    key: "getItemLinks",
    value: function getItemLinks(item) {
      var links = [];
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.settings.item[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var i = _step3.value;

          var linkItem = this.settings.item[i];
          links.push({
            rel: i,
            method: linkItem.method,
            url: (linkItem.url || this.getUrl()) + "/" + item.id
          });
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return links;
    }
  }]);

  return HATEOASDecorator;
}();

module.exports = new HATEOASDecorator();
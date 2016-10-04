"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DI = function () {
  function DI() {
    _classCallCheck(this, DI);

    this.di = {};
  }

  _createClass(DI, [{
    key: "merge",
    value: function merge(di) {
      this.di = Object.assign({}, this.di, di.di);
      return this;
    }
  }, {
    key: "set",
    value: function set(diName, diValue) {
      this.di[diName] = diValue;
      return this;
    }
  }, {
    key: "get",
    value: function get(diName) {
      return this.di[diName];
    }
  }]);

  return DI;
}();

exports.default = DI;
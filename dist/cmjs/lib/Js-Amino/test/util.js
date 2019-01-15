'use strict';

var toHex = function toHex(buffer) {
  var s = '';
  buffer.forEach(function (b) {
    b = b.toString(16);
    if (b.length == 1) {
      b = '0' + b;
    }
    s += b;
  });
  return s;
};

module.exports = {
  toHex: toHex
};
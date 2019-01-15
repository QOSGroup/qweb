'use strict';

var varint = require('varint');
var svarint = require('signed-varint');
var Int53 = require('int53');
var nano = require('nanoseconds');

var _require = require('safe-buffer'),
    Buffer = _require.Buffer;

var Utils = require("./utils");

var _require2 = require('./types'),
    Types = _require2.Types,
    WireType = _require2.WireType,
    WireMap = _require2.WireMap;

var encodeSignedVarint = function encodeSignedVarint(input) {
    var buf = svarint.encode(input);
    return buf;
};

var encodeUVarint = function encodeUVarint(input) {
    var buf = varint.encode(input);
    return buf;
};
//encode sign functions
var encodeInt8 = function encodeInt8(input) {
    return encodeSignedVarint(input);
};

var encodeInt16 = function encodeInt16(input) {
    return encodeSignedVarint(input); //todo: add Int16Array ?
};

var encodeInt32 = function encodeInt32(input) {
    var buffer = new ArrayBuffer(4); //4 byte
    var view = new DataView(buffer);
    view.setUint32(0, input, true); // little endiant
    return Array.from(new Uint8Array(buffer));
};

//todo: using TypeArray for compatibility with React and Web
var encodeInt64 = function encodeInt64(input) {
    var buff = Buffer(8);
    Int53.writeInt64LE(input, buff, 0);
    return Array.from(new Int32Array(buff));
};

var encodeSlice = function encodeSlice(input) {
    var encodedData = input.slice();

    return encodeUVarint(input.length).concat(encodedData);
};

var encodeString = function encodeString(input) {
    return encodeSlice(Array.from(Buffer.from(input)));
};

var encodeUint8 = function encodeUint8(input) {
    return encodeUVarint(input); //todo: add Uint8Array
};

var encodeBoolean = function encodeBoolean(input) {
    if (input) return encodeUint8(1);
    return encodeUint8(0);
};

var encodeTime = function encodeTime(time) {
    var data = [];
    var s = time.getTime() / 1000; //get the second

    if (s != 0) {
        if (s < Utils.MinSecond && s >= Utils.MaxSecond) {
            throw new RangeError('Second have to be >= ' + Utils.MinSecond + ', and <: ' + Utils.MaxSecond);
        }
        var encodeField = encodeFieldNumberAndType(1, WireMap[Types.Time]);
        data = encodeField.concat(encodeUVarint(s));
    }

    /*let ns = nano([0, s*1000000]);    
    ns = 0
    if (ns != 0) {
        if (ns < 0 && ns > Utils.MaxNano) {
            throw new RangeError(`NanoSecond have to be >= 0, and <=: ${Utils.MaxNano}`)
        }
        let encodeField = encodeFieldNumberAndType(2, WireMap[Types.Time])
        data = data.concat(encodeField.concat(encodeUVarint(ns)))
    }
    */
    return data;
};

var encodeFieldNumberAndType = function encodeFieldNumberAndType(num, type) {
    //reference:https://developers.google.com/protocol-buffers/docs/encoding
    var encodedVal = num << 3 | type;
    return varint.encode(encodedVal);
};

module.exports = {
    encodeSignedVarint: encodeSignedVarint,
    encodeFieldNumberAndType: encodeFieldNumberAndType,
    encodeString: encodeString,
    encodeInt8: encodeInt8,
    encodeInt16: encodeInt16,
    encodeInt32: encodeInt32,
    encodeInt64: encodeInt64,
    encodeSlice: encodeSlice,
    encodeBoolean: encodeBoolean,
    encodeUVarint: encodeUVarint,
    encodeTime: encodeTime
};

if (require.main == module) {
    var time = new Date('01 Dec 2018 00:12:00 GMT');

    var result = encodeTime(time);
    console.log(result);
}
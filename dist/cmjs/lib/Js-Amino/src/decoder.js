'use strict';

var uVarint = require('varint');
var sVarint = require('signed-varint');
var Utils = require('./utils');

var _require = require('./types'),
    Types = _require.Types,
    WireType = _require.WireType,
    WireMap = _require.WireMap;

var _require2 = require('safe-buffer'),
    Buffer = _require2.Buffer;

var decodeSignedVarint = function decodeSignedVarint(input) {
    if (!input) throw new TypeError("Can not decodeSignedVarint invalid input");
    if (!input.length) throw new TypeError("Can not decodeSignedVarint invalid input length");
    var buf = sVarint.decode(input);

    return {
        data: buf,
        byteLength: sVarint.decode.bytes
    };
};

var decodeUVarint = function decodeUVarint(input) {
    if (!input || !Array.isArray(input)) throw new TypeError("Can not decodeSignedVarint invalid input");
    if (!input.length) throw new TypeError("Can not decodeSignedVarint invalid input length");
    var buf = uVarint.decode(input);

    return {
        data: buf,
        byteLength: uVarint.decode.bytes
    };
};

var decodeInt8 = function decodeInt8(input) {
    var result = decodeSignedVarint(input);
    if (result.data > Number.MaxInt8) throw new TypeError("EOF decoding int8");
    var int8Buffer = Int8Array.from([result.data]);

    return {
        data: int8Buffer[0],
        byteLength: result.byteLength
    };
};

var decodeInt16 = function decodeInt16(input) {
    var result = decodeSignedVarint(input);
    if (result.data > Number.MaxInt16) throw new TypeError("EOF decoding int8");
    var int16Buffer = new Int16Array.from([result]);

    return {
        data: int16Buffer[0],
        byteLength: result.byteLength
    };
};

var decodeString = function decodeString(input) {
    /* let {data,byteLength} = decodeUVarint(input)
    let strLength = data
    if(input.length < strLength) throw new RangeError(`insufficient bytes decoding string of length ${strLength}`)
    
    let str = input.slice(byteLength,strLength+1); */
    var decodedSlice = decodeSlice(input);
    var str = Buffer.from(decodedSlice.data).toString('utf8');

    return {
        data: str,
        byteLength: decodedSlice.byteLength
    };
};

var decodeSlice = function decodeSlice(input) {
    var _decodeUVarint = decodeUVarint(input),
        data = _decodeUVarint.data,
        byteLength = _decodeUVarint.byteLength;

    var length = data;
    if (input.length < length) throw new RangeError('insufficient bytes decoding string of length ' + strLength);

    var slicedData = input.slice(byteLength, length + 1);

    return {
        data: slicedData,
        byteLength: byteLength + length
    };
};

var decodeFieldNumberAndType = function decodeFieldNumberAndType(bz) {
    var decodedData = decodeUVarint(bz);
    var wiretypeNumber = decodedData.data & 0x07;
    var type = WireMap.keysOf(wiretypeNumber);
    var idx = decodedData.data >> 3;

    return {
        type: type,
        byteLength: decodedData.byteLength,
        idx: idx
    };
};

module.exports = {
    decodeInt8: decodeInt8,
    decodeInt16: decodeInt16,
    decodeString: decodeString,
    decodeFieldNumberAndType: decodeFieldNumberAndType,
    decodeSlice: decodeSlice
};

if (require.main === module) {
    var typeArr = new Int8Array([150, 160, 10]);
    console.log(typeArr);
}
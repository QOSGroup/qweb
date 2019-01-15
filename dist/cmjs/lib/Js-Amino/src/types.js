'use strict';

var _WireMap;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Types = {
    Int64: Symbol('Int64'),
    Int32: Symbol('Int32'),
    Int16: Symbol('Int16'),
    Int8: Symbol('Int8'),
    String: Symbol('String'),
    Struct: Symbol('Struct'),
    Time: Symbol('Time'),
    ByteSlice: Symbol('ByteSlice'),
    ArrayStruct: Symbol('ArrayStruct'),
    ArrayInterface: Symbol('ArrayInterface'),
    Interface: Symbol('Interface')

    //reference : https://developers.google.com/protocol-buffers/docs/encoding
};var WireType = {
    Varint: 0, //int32, int64, uint32, uint64, sint32, sint64, bool, enum
    Type8Byte: 1, //fixed64, sfixed64, double
    ByteLength: 2, //string, bytes, embedded messages, packed repeated fields
    Type4Byte: 5 //fixed32, sfixed32, float
};

var WireMap = (_WireMap = {}, _defineProperty(_WireMap, Types.Int64, WireType.Varint), _defineProperty(_WireMap, Types.Int32, WireType.Type4Byte), _defineProperty(_WireMap, Types.Int16, WireType.Varint), _defineProperty(_WireMap, Types.Int8, WireType.Varint), _defineProperty(_WireMap, Types.Time, WireType.Varint), _defineProperty(_WireMap, Types.String, WireType.ByteLength), _defineProperty(_WireMap, Types.Struct, WireType.ByteLength), _defineProperty(_WireMap, Types.ByteSlice, WireType.ByteLength), _defineProperty(_WireMap, Types.ArrayStruct, WireType.ByteLength), _defineProperty(_WireMap, Types.ArrayInterface, WireType.ByteLength), _defineProperty(_WireMap, Types.Interface, WireType.ByteLength), _WireMap);

WireType.keysOf = function (number) {
    var resultKey = null;
    Reflect.ownKeys(WireType).forEach(function (key) {
        if (WireType[key] == number) {
            resultKey = key;
            return;
        }
    });
    return resultKey;
};

WireMap.keysOf = function (wireType) {
    var resultKey = null;
    Reflect.ownKeys(WireMap).forEach(function (key) {
        if (WireMap[key] == wireType) {
            resultKey = key;
            return;
        }
    });
    return resultKey;
};

module.exports = {
    Types: Types,
    WireType: WireType,
    WireMap: WireMap
};
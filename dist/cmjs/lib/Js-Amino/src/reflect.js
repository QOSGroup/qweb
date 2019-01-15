'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _require = require('./types'),
    Types = _require.Types,
    WireType = _require.WireType;

var Factory = require('./typeFactory');

var typeOf = function typeOf(instance) {
    if (typeof instance === "undefined") {
        throw new Error("Undefined Type");
    }
    if (instance in Types) return Types[instane];

    if ((typeof instance === 'undefined' ? 'undefined' : _typeof(instance)) == 'object') {
        if (instance.constructor.name == 'AminoType') return instance.typeName();
        return instance.constructor.name;
    }

    return typeof instance === 'undefined' ? 'undefined' : _typeof(instance);
};

var ownKeys = function ownKeys(instance) {
    if (!Factory.isExisted(typeOf(instance))) return []; //throw new TypeError("instance must be amino type") //remember to check it again
    return Reflect.ownKeys(instance).filter(function (key) {
        var val = instance.lookup(key);
        return val != null || val != undefined;
    });
};

var typeToTyp3 = function typeToTyp3(type, opts) {
    switch (type) {
        case Types.Interface:
            return WireType.ByteLength;
        case Types.ArrayInterface:
        case Types.ArrayStruct:
            return WireType.ByteLength;
        case Types.String:
            return WireType.ByteLength;
        case Types.Struct:
            // case Types.Map:
            return WireType.ByteLength;
        case Types.Int64:
            if (opts.binFixed64) {
                return WireType.Type8Byte;
            } else {
                return WireType.Varint;
            }
        case Types.Int32:
            if (opts.binFixed32) {
                return WireType.Type4Byte;
            } else {
                return WireType.Varint;
            }
        case Types.Int8:
        case Types.Int16:
            return WireType.Varint;
        // case Types.Float64:
        //      return WireType.Type8Byte
        // case Types.Float32:
        //      return WireType.Type4Byte
        default:
            throw new Error('"unsupported field type ' + type);
    }
};

module.exports = {
    typeOf: typeOf,
    ownKeys: ownKeys,
    typeToTyp3: typeToTyp3
};
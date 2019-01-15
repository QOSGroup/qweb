"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RegisteredType = require("./registeredType").RegisteredType;
var Reflection = require("./reflect");
var BinaryEncoder = require("./binaryEncoder");
var BinaryDecoder = require("./binaryDecoder");
var JsonEncoder = require("./jsonEncoder");
var JsonDecoder = require("./jsonDecoder");
var Encoder = require("./encoder");
var TypeFactory = require("./typeFactory");
var Utils = require("./utils");

var _require = require('./types'),
    Types = _require.Types,
    WireType = _require.WireType;

var instance = null;

var privObj = {
    typeMap: null
};

var FieldOtions = function FieldOtions() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, FieldOtions);

    this.jsonName = opts.jsonName || "";
    this.jsonOmitEmpty = opts.jsonOmitEmpty || "";
    this.binFixed64 = opts.binFixed64 || false; // (Binary) Encode as fixed64
    this.binFixed32 = opts.binFixed32 || false; // (Binary) Encode as fixed32
    this.unsafe = opts.unsafe || false; // e.g. if this field is a float.
    this.writeEmpty = opts.writeEmpty || false; // write empty structs and lists (default false except for pointers)
    this.emptyElements = opts.emptyElements || false; // Slice and Array elements are never nil, decode 0x00 as empty struct.
};

var Codec = function () {
    function Codec() {
        _classCallCheck(this, Codec);

        if (!instance) {
            instance = this; //singleton-design pattern
        }
        privObj.typeMap = new Map();
        return instance;
    }

    _createClass(Codec, [{
        key: "lookup",
        value: function lookup(typeName) {
            return this.typeMap.get(typeName);
        }
    }, {
        key: "set",
        value: function set(typeName, registeredType) {
            privObj.typeMap.set(typeName, registeredType);
        }
    }, {
        key: "registerConcrete",
        value: function registerConcrete(instance, name, opt) {
            var typeName = Reflection.typeOf(instance);
            if (this.lookup(typeName)) {
                throw new Error(typeName + " was registered");
            }
            var type = new RegisteredType(name, typeName);
            type.registered = true;
            instance.info = type;
            this.set(typeName, type);
        }
    }, {
        key: "marshalJson",
        value: function marshalJson(obj) {
            if (!obj) return null;
            var typeInfo = this.lookup(Reflection.typeOf(obj));
            var value = JsonEncoder.encodeJson(obj, obj.type);
            // if this object was not registered with prefix
            var serializedObj = value;
            // if this object was registered with prefix
            if (typeInfo && typeInfo.name) {
                serializedObj = {
                    type: typeInfo.name,
                    value: value
                };
            }
            return JSON.stringify(serializedObj);
        }
    }, {
        key: "unMarshalJson",
        value: function unMarshalJson(json, instance) {
            var deserializedObj = JSON.parse(json);
            var typeName = Reflection.typeOf(instance);
            if (!this.lookup(typeName)) {
                throw new Error("No " + typeName + " was registered");
            }
            var value = deserializedObj;
            var typeInfo = this.lookup(Reflection.typeOf(instance));
            if (typeInfo && typeInfo.name) {
                if (deserializedObj.type !== typeInfo.name) {
                    throw new Error("Type not match. expected: " + typeInfo.name + ", but: " + deserializedObj.type);
                }
                value = deserializedObj.value;
            }
            JsonDecoder.decodeJson(value, instance);
        }
    }, {
        key: "marshalBinary",
        value: function marshalBinary(obj) {
            var fieldOpts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new FieldOtions();

            if (!obj) return null;
            // let typeInfo = this.lookup(Reflection.typeOf(obj))        
            // if (!typeInfo) return null;
            var encodedData = BinaryEncoder.encodeBinary(obj, obj.type, fieldOpts);
            if (obj.info) {
                //if this object was registered with prefix
                if (obj.info.registered) {
                    encodedData = obj.info.prefix.concat(encodedData);
                }
            }

            var lenBz = Encoder.encodeUVarint(encodedData.length);

            return lenBz.concat(encodedData);
        }
    }, {
        key: "unMarshalBinary",
        value: function unMarshalBinary(bz, instance) {
            if (bz.length == 0) throw new RangeError("UnmarshalBinary cannot decode empty bytes");
            if (!instance) throw new TypeError("UnmarshalBinary cannot decode to Null instance");
            var typeName = Reflection.typeOf(instance);
            var typeInfo = this.lookup(typeName);
            if (!typeInfo) throw new TypeError("No " + typeName + " was registered");
            var length = bz[0];
            var realbz = bz.slice(1);
            if (length != realbz.length) throw new RangeError("Wrong length");
            if (!Utils.isEqual(realbz.slice(0, 4), typeInfo.prefix)) {
                throw new TypeError("prefix not match");
            }
            realbz = bz.slice(5);
            BinaryDecoder.decodeBinary(realbz, instance);
        }
    }, {
        key: "typeMap",
        get: function get() {
            return privObj.typeMap;
        }
    }]);

    return Codec;
}();

module.exports = {
    Codec: Codec,
    FieldOtions: FieldOtions
};
'use strict';

var _this = this;

var Reflection = require("./reflect");

var _require = require('./types'),
    Types = _require.Types;

var _require2 = require('safe-buffer'),
    Buffer = _require2.Buffer;

var decodeJson = function decodeJson(value, instance) {
    Reflection.ownKeys(instance).forEach(function (key, idx) {
        var type = instance.lookup(key); //only valid with BaseTypeAmino.todo: checking        
        var data = decodeJsonField(value[key], idx, type, instance[key]);
        instance[key] = data;
    });
};

var decodeJsonField = function decodeJsonField(value, idx, type, instance) {
    switch (type) {
        // fall-through
        case Types.Int8:
        case Types.Int16:
        case Types.Int32:
            return parseInt(value);
        case Types.Int64:
            return parseInt(value);
        case Types.String:
            return value;
        case Types.Struct:
            {
                return decodeJsonStruct(value, instance);
            }
        case Types.ByteSlice:
            {
                return decodeJsonSlice(value);
            }
        case Types.ArrayInterface:
            {
                return decodeJsonArray(value, instance, Types.ArrayInterface);
            }
        case Types.ArrayStruct:
            {
                return decodeJsonArray(value, instance, Types.ArrayStruct);
            }
        case Types.Interface:
            {
                return decodeJsonInterface(value, instance);
            }
        default:
            {
                throw new Error("There is no data type to decode:", type);
            }
    }
};

var decodeJsonStruct = function decodeJsonStruct(value, instance) {
    Reflection.ownKeys(instance).forEach(function (key, idx) {
        var type = instance.lookup(key); //only valid with BaseTypeAmino.todo: checking          
        var data = decodeJsonField(value, idx, type, instance[key]);
        instance[key] = data;
    });
    return instance;
};

var decodeJsonSlice = function decodeJsonSlice(value) {
    return Array.from(Buffer.from(value, 'base64'));
};

var decodeJsonInterface = function decodeJsonInterface(value, instance) {
    var typeName = Reflection.typeOf(instance);
    if (!_this.lookup(typeName)) {
        throw new Error('No ' + typeName + ' was registered');
    }
    var typeInfo = _this.lookup(Reflection.typeOf(instance));
    if (typeInfo && typeInfo.name) {
        if (value.type !== typeInfo.name) {
            throw new Error('Type not match. expected: ' + typeInfo.name + ', but: ' + value.type);
        }
    }

    return decodeJson(value.value, instance.type); //dirty-hack
};

var decodeJsonArray = function decodeJsonArray(value, instance, arrayType) {
    var result = [];
    var withPrefix = arrayType === Types.ArrayInterface ? true : false;

    for (var i = 0; i < value.length; i++) {
        var type = Types.Struct;
        if (withPrefix) {
            type = Types.Interface;
        }
        var data = decodeJson(value[i], type);
        if (data) {
            result = result.concat(data);
        }
    }

    return result;
};

module.exports = {
    decodeJson: decodeJson
};
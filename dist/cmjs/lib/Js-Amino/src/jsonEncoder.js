'use strict';

var Reflection = require("./reflect");

var _require = require('./types'),
    Types = _require.Types;

var _require2 = require('safe-buffer'),
    Buffer = _require2.Buffer;

var encodeJson = function encodeJson(instance, type) {

    var tmpInstance = instance;

    //retrieve the single property of the Registered AminoType
    if (type != Types.Struct && type != Types.Interface && type != Types.Array) {
        //only get the first property with type != Struct        
        var keys = Reflection.ownKeys(instance);
        if (keys.length > 0) {
            //type of AminoType class with single property
            keys.forEach(function (key) {
                var aminoType = instance.lookup(key);
                if (type != aminoType) throw new TypeError("Amino type does not match");
                tmpInstance = instance[key];
                return;
            });
        }
    }

    switch (type) {
        // fall-through
        case Types.Int8:
        case Types.Int16:
        case Types.Int32:
            {
                return tmpInstance;
            }
        case Types.Int64:
            {
                // https://github.com/tendermint/go-amino/blob/v0.14.1/json-encode.go#L99
                // TODO: In go-amino, (u)int64 is encoded by string, because some languages like JS can't handle (u)int64
                // So, It seemed that it is necessary to decode (u)int64 to library like bignumber.js?
                return tmpInstance.toString();
            }
        case Types.String:
            {
                return tmpInstance;
            }

        case Types.Struct:
            {
                return encodeJsonStruct(tmpInstance);
            }
        case Types.ByteSlice:
            {
                return encodeJsonSlice(tmpInstance);
            }

        case Types.ArrayStruct:
            {
                return encodeJsonArray(tmpInstance, Types.ArrayStruct);
            }
        case Types.ArrayInterface:
            {
                return encodeJsonArray(tmpInstance, Types.ArrayInterface);
            }
        case Types.Interface:
            {
                return encodeJsonInterface(tmpInstance);
            }
        default:
            {
                console.log("There is no data type to encode:", type);
                break;
            }
    }
};

var encodeJsonInterface = function encodeJsonInterface(instance) {
    var value = encodeJson(instance, instance.type); //dirty-hack
    var type = instance.info.name;
    return { type: type, value: value };
};

var encodeJsonStruct = function encodeJsonStruct(instance) {
    var result = {};
    Reflection.ownKeys(instance).forEach(function (key) {
        var type = instance.lookup(key); //only valid with BaseTypeAmino.todo: checking 
        var value = encodeJsonField(instance[key], type);
        result[key] = value;
    });

    return result;
};

var encodeJsonField = function encodeJsonField(typeInstance, type) {
    var value = null;
    if (type == Types.Array) {
        value = encodeJsonArray(typeInstance);
    } else {
        value = encodeJson(typeInstance, type);
    }

    return value;
};

var encodeJsonArray = function encodeJsonArray(instance, arrayType) {
    var result = [];
    var withPrefix = arrayType === Types.ArrayInterface ? true : false;

    for (var i = 0; i < instance.length; ++i) {
        var item = instance[i];

        var type = item.type;
        if (withPrefix) {
            type = Types.Interface;
        }
        var data = encodeJson(item, type);
        if (data) {
            result = result.concat(data);
        }
    }

    return result;
};

var encodeJsonSlice = function encodeJsonSlice(tmpInstance) {
    // In go-amino, bytes are encoded by base64 when json-encoding
    return Buffer.from(tmpInstance).toString('base64');
};

module.exports = {
    encodeJson: encodeJson
};
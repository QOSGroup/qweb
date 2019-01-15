"use strict";

var Reflection = require("./reflect");
var Encoder = require("./encoder");

var _require = require('./types'),
    Types = _require.Types;

var encodeBinary = function encodeBinary(instance, type, opts) {
    var isBare = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;


    var tmpInstance = instance;

    //retrieve the single property of the Registered AminoType
    if (type != Types.Struct && type != Types.Interface && type != Types.ArrayStruct && type != Types.Interface) {
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

    var data = null;
    switch (type) {

        case Types.Int8:
            {
                data = Encoder.encodeSignedVarint(tmpInstance);
                break;
            }

        case Types.Int16:
            {
                data = Encoder.encodeSignedVarint(tmpInstance);
                break;
            }

        case Types.Int32:
            {
                if (opts.binFixed32) {
                    data = Encoder.encodeInt32(tmpInstance);
                } else {
                    data = Encoder.encodeUVarint(tmpInstance);
                }

                break;
            }

        case Types.Int64:
            {
                if (opts.binFixed64) {
                    data = Encoder.encodeInt64(tmpInstance);
                } else {
                    data = Encoder.encodeUVarint(tmpInstance);
                }
                break;
            }
        /* case Types.Time:
             {
                 data = encodeTime(tmpInstance, isBare) //Encoder.encodeTime(tmpInstance)
                 break;
             }*/
        case Types.Boolean:
            {
                data = Encoder.encodeBoolean(tmpInstance);
                break;
            }
        case Types.String:
            {
                var encodedString = Encoder.encodeString(tmpInstance);
                data = encodedString;
                break;
            }

        case Types.Struct:
            {
                data = encodeBinaryStruct(tmpInstance, opts, isBare);
                break;
            }
        case Types.ByteSlice:
            {
                data = Encoder.encodeSlice(tmpInstance);
                break;
            }

        case Types.ArrayStruct:
            {
                data = encodeBinaryArray(tmpInstance, Types.ArrayStruct, opts, isBare);
                break;
            }

        case Types.ArrayInterface:
            {
                data = encodeBinaryArray(tmpInstance, Types.ArrayInterface, opts, isBare);
                break;
            }

        case Types.Interface:
            {
                var _data = encodeBinaryInterface(tmpInstance, opts, isBare);
                return _data; //dirty hack
            }
        default:
            {
                console.log("There is no data type to encode:", type);
                break;
            }
    }

    return data;
};

var encodeBinaryInterface = function encodeBinaryInterface(instance, opts, isBare) {
    var data = encodeBinary(instance, instance.type, opts, true); //dirty-hack
    data = instance.info.prefix.concat(data);
    if (!isBare) {
        data = Encoder.encodeUVarint(data.length).concat(data);
    }
    return data;
};

var encodeBinaryStruct = function encodeBinaryStruct(instance, opts) {
    var isBare = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var result = [];
    Reflection.ownKeys(instance).forEach(function (key, idx) {
        var type = instance.lookup(key); //only valid with BaseTypeAmino.todo: checking 
        var encodeData = null;
        encodeData = encodeBinaryField(instance[key], idx, type, opts);
        if (encodeData) {
            result = result.concat(encodeData);
        }
    });
    if (!isBare) {
        result = Encoder.encodeUVarint(result.length).concat(result);
    }

    return result;
};

var encodeBinaryField = function encodeBinaryField(typeInstance, idx, type, opts) {
    var encodeData = null;
    if (type == Types.ArrayStruct || type == Types.ArrayInterface) {
        encodeData = encodeBinaryArray(typeInstance, type, opts, true, idx);
    } else if (type == Types.Time) {
        encodeData = encodeTime(typeInstance, idx, false);
    } else {
        encodeData = encodeBinary(typeInstance, type, opts, false);
        var encodeField = Encoder.encodeFieldNumberAndType(idx + 1, Reflection.typeToTyp3(type, opts));
        encodeData = encodeField.concat(encodeData);
    }

    return encodeData;
};

var encodeBinaryArray = function encodeBinaryArray(instance, arrayType, opts) {
    var isBare = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    var idx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

    var result = [];

    for (var i = 0; i < instance.length; ++i) {
        var item = instance[i];

        var encodeField = Encoder.encodeFieldNumberAndType(idx + 1, Reflection.typeToTyp3(Types.ArrayStruct, opts));
        var itemType = arrayType == Types.ArrayInterface ? Types.Interface : Types.Struct;
        var data = encodeBinary(item, itemType, opts, false);
        if (data) {
            data = encodeField.concat(data);
            result = result.concat(data);
        }
    }
    if (!isBare) {
        result = Encoder.encodeUVarint(result.length).concat(result);
    }

    return result;
};

var encodeTime = function encodeTime(time, idx, isBare) {
    var result = [];
    var encodeData = null;
    encodeData = Encoder.encodeTime(time);
    result = result.concat(encodeData);

    if (!isBare) {
        result = Encoder.encodeUVarint(result.length).concat(result);
    }
    var encodeField = Encoder.encodeFieldNumberAndType(idx + 1, Reflection.typeToTyp3(Types.Struct, opts)); //notice: use Types.Struct -> Time is a special of Struct
    result = encodeField.concat(result);
    return result;
};

module.exports = {
    encodeBinary: encodeBinary
};
"use strict";

var Reflection = require("./reflect");
var Decoder = require("./decoder");

var _require = require('./types'),
    Types = _require.Types,
    WireType = _require.WireType,
    WireMap = _require.WireMap;

var decodeBinary = function decodeBinary(bz, instance) {
    var isBare = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;


    Reflection.ownKeys(instance).forEach(function (key, idx) {

        var type = instance.lookup(key); //only valid with BaseTypeAmino.todo: checking         

        var _decodeBinaryField = decodeBinaryField(bz, idx, type, instance[key]),
            data = _decodeBinaryField.data,
            newBz = _decodeBinaryField.newBz;

        instance[key] = data;
        bz = newBz;
    });
    if (!isBare) {
        // console.log("data=",instance)
        return {
            data: instance,
            newBz: bz
        };
    } else return;
};

var decodeBinaryField = function decodeBinaryField(bz, idx, type, instance) {
    var decodedFieldtype = Decoder.decodeFieldNumberAndType(bz);
    //if (type.toString() != decodedFieldtype.type.toString()) throw new TypeError("Type does not match in decoding")
    if (WireMap[type] != WireMap[decodedFieldtype.type]) throw new TypeError("Type does not match in decoding");

    if (idx + 1 != decodedFieldtype.idx) throw new RangeError("Index of Field is not match while decoding");
    bz = bz.slice(decodedFieldtype.byteLength);
    var decodedData = null;
    switch (type) {

        case Types.Int64:
            {
                //todo
                break;
            }
        case Types.String:
            {
                decodedData = Decoder.decodeString(bz);
                break;
            }
        case Types.Int8:
            {
                decodedData = Decoder.decodeInt8(bz);

                break;
            }
        case Types.Struct:
            {
                var firstField = Decoder.decodeSlice(bz);
                bz = bz.slice(1);
                decodedData = decodeBinary(bz, instance, false);
                break;
            }
        default:
            {
                console.log("There is no data type to decode");
                break;
            }
    }
    if (decodedData) {
        bz = bz.slice(decodedData.byteLength);
    }
    return {
        data: decodedData.data,
        newBz: bz
    };
};

module.exports = {
    decodeBinary: decodeBinary
};
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//let privTypeMap = undefined
var _require = require('./types'),
    Types = _require.Types;

var Reflection = require("./reflect");

var privTypeMap = Symbol("privateTypeMap");

var aminoTypes = new Array();

var isExisted = function isExisted(name) {
    return aminoTypes.includes(name);
};

var BaseAminoType = function () {
    function BaseAminoType() {
        _classCallCheck(this, BaseAminoType);

        this[privTypeMap] = new Map();
    }

    _createClass(BaseAminoType, [{
        key: "set",
        value: function set(name, type) {
            if (this[privTypeMap].has(name)) throw new RangeError("property '" + name + "' existed");
            this[privTypeMap].set(name, type);
        }
    }, {
        key: "lookup",
        value: function lookup(name) {
            return this[privTypeMap].get(name);
        }
    }]);

    return BaseAminoType;
}();

var create = function create(className, properties) {
    var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Types.Struct;


    if (!properties) {
        throw new Error("Type List can not be empty");
    }
    if (!properties.length) {
        throw new Error("Need to provide TypeList");
    }

    /*AminoType*/

    var AminoType = function (_BaseAminoType) {
        _inherits(AminoType, _BaseAminoType);

        function AminoType() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            _classCallCheck(this, AminoType);

            var _this = _possibleConstructorReturn(this, (AminoType.__proto__ || Object.getPrototypeOf(AminoType)).call(this));

            var idx = 0;
            properties.forEach(function (prop) {
                Reflect.ownKeys(prop).forEach(function (key) {

                    if (key == 'name') {
                        _this.idx = idx;
                        _this[prop[key]] = args[idx++];
                    } else if (key == 'type') {
                        _this.set(prop['name'], prop['type']);
                        if (prop['type'] == Types.Struct) {
                            //set up the default value for Type.Struct field
                            if (_this[prop['name']]) {
                                var defaultAminotye = Object.assign({}, _this[prop['name']]);
                                Object.setPrototypeOf(defaultAminotye, AminoType.prototype);
                                AminoType.defaultMap.set(prop['name'], defaultAminotye);
                            }
                        }
                    }
                });
            });
            if (args.length == 0) {
                _this[privTypeMap].forEach(function (value, key, map) {
                    if (value == Types.Struct) {
                        _this[key] = AminoType.defaultMap.get(key);
                    }
                });
            }

            return _this;
        }

        _createClass(AminoType, [{
            key: "typeName",
            value: function typeName() {
                return className;
            }
        }, {
            key: "JsObject",
            value: function JsObject() {
                var _this2 = this;

                var obj = {};
                Reflect.ownKeys(this).forEach(function (key) {
                    if ((typeof key === "undefined" ? "undefined" : _typeof(key)) != 'symbol' && _this2.lookup(key) != Types.Struct) {
                        if (_this2[key]) {
                            obj[key] = _this2[key];
                        }
                    } else if (_this2.lookup(key) == Types.Struct) {
                        obj[key] = _this2[key].JsObject();
                    }
                });
                return obj;
            }
        }, {
            key: "info",
            get: function get() {
                return AminoType.info;
            },
            set: function set(_info) {
                AminoType.info = _info;
            }

            /*  get index() {
                 return this.idx
             }
              set index(_idx) {
                 console.log('set index=',_idx)
                 this.idx = _idx
             } */

        }, {
            key: "type",
            get: function get() {
                return AminoType.type;
            }
        }]);

        return AminoType;
    }(BaseAminoType);

    aminoTypes.push(className);
    AminoType.defaultMap = new Map(); //static map for default value-dirty hack
    AminoType.info = null; //static registered type info
    AminoType.type = type; //describe the type(Struct,Array) for encode/decode

    return AminoType;
};

module.exports = {
    create: create,
    isExisted: isExisted
};

if (require.main === module) {
    var A = create('TestAmino', [{
        name: "a",
        type: Types.Int32
    }, {
        name: "b",
        type: Types.Int64
    }]);

    var B = create('B', [{
        name: "a",
        type: Types.Int32
    }, {
        name: "b",
        type: Types.Int16
    }]);

    var aObj = new A(100, 200);
    var obj = new B(100, 200);

    console.log(Reflection.typeOf(obj));
}
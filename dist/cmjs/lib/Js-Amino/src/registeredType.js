"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = require('./utils');

var PrefixBytesLen = 4;
var DisambBytesLen = 3;
var DisfixBytesLen = PrefixBytesLen + DisambBytesLen;
var DelimiterValue = 0x00;

var privObject = Symbol("privateObj");

var RegisteredType = function () {
    function RegisteredType(name, rtype) {
        _classCallCheck(this, RegisteredType);

        this.name = name;

        this[privObject] = this.calculateDisambAndPrefix();
        this[privObject].reflectType = rtype;
        this[privObject].isRegistered = false;
    }

    _createClass(RegisteredType, [{
        key: "calculateDisambAndPrefix",


        /**
        * save Disamb and prefix.
        * refer the calculation: https://github.com/tendermint/go-amino  
        * @param {None}      * 
        * @return {Object} : 2 properties :disAmb and prefix
        */

        value: function calculateDisambAndPrefix() {
            var nameHash = Utils.getHash256(this.name);
            nameHash = this.dropLeadingZeroByte(nameHash);
            var disamb = nameHash.slice(0, DisambBytesLen);
            nameHash = this.dropLeadingZeroByte(nameHash.slice(3));
            var prefix = nameHash.slice(0, PrefixBytesLen);

            return { disamb: disamb, prefix: prefix };
        }

        /**
         * remove the first item in hash until there is no DelimiterValue at 1st element .
         * refer the calculation: https://github.com/tendermint/go-amino  
         * @param {array}      * hash input
         * @return {array} : array that contains no DelimiterValue at 1st position
         */

    }, {
        key: "dropLeadingZeroByte",
        value: function dropLeadingZeroByte(hash) {
            while (hash[0] == DelimiterValue) {
                hash = hash.slice(1);
            }
            return hash;
        }
    }, {
        key: "prefix",
        get: function get() {
            return this[privObject].prefix;
        }
    }, {
        key: "disfix",
        get: function get() {
            return this.disamb.concat(this.prefix);
        }
    }, {
        key: "disamb",
        get: function get() {
            return this[privObject].disamb;
        }
    }, {
        key: "reflectType",
        get: function get() {
            return this[privObject].rtype;
        }
    }, {
        key: "registered",
        get: function get() {
            return this[privObject].isRegistered;
        },
        set: function set(status) {
            this[privObject].isRegistered = status;
        }
    }]);

    return RegisteredType;
}();

module.exports = {
    RegisteredType: RegisteredType
};
if (require.main === module) {
    var type = new RegisteredType("shareledger/AuthTx");
    console.log("disAmb=", type.disamb);
    console.log("prefix=", type.prefix);
    console.log("disfix=", type.disfix);
}
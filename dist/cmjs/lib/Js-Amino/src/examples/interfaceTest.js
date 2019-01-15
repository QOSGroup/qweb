'use strict';

var _require = require('../index'),
    Codec = _require.Codec,
    TypeFactory = _require.TypeFactory,
    Utils = _require.Utils,
    Types = _require.Types,
    WireTypes = _require.WireTypes;

//let codec1 = new Codec();

var Tx = TypeFactory.create('Tx', [{
    name: "msg",
    type: Types.Interface
}]);

var MsgSend = TypeFactory.create('MsgSend', [{
    name: "nonce",
    type: Types.Int8
}]);

//interface 2 with byte-slice array
var Tx2 = TypeFactory.create('Tx2', [{
    name: "pubKey",
    type: Types.Interface
}]);

var PubSecp256k1 = TypeFactory.create('PubSecp256k1', [{
    name: "bytes",
    type: Types.ByteSlice
}], Types.ByteSlice);

var codec = new Codec();
codec.registerConcrete(new Tx(), "shareledger/bank/Tx", {});
codec.registerConcrete(new MsgSend(), "shareledger/bank/MsgSend", {});

codec.registerConcrete(new Tx2(), "shareledger/bank/Tx2", {});
codec.registerConcrete(new PubSecp256k1(), "shareledger/PubSecp256k1", {});

var msgSend = new MsgSend(3);
var tx = new Tx(msgSend);

var binary = codec.marshalBinary(tx);

var pubKey = new PubSecp256k1([1, 2, 3]);
var tx2 = new Tx2(pubKey);
var binary2 = codec.marshalBinary(tx2);

console.log(binary.toString());
console.log(binary2.toString());

//console.log(bObj)
'use strict';

var _require = require('../index'),
    Codec = _require.Codec,
    FieldOtions = _require.FieldOtions,
    TypeFactory = _require.TypeFactory,
    Utils = _require.Utils,
    Types = _require.Types,
    WireTypes = _require.WireTypes;

var toHex = function toHex(buffer) {
  var s = '';
  buffer.forEach(function (b) {
    b = b.toString(16);
    if (b.length == 1) {
      b = '0' + b;
    }
    s += b;
  });
  return s;
};

var fromHex = function fromHex(str) {
  var buffer = [];
  for (var i = 0; i < str.length; i += 2) {
    var hex = str.slice(i, i + 2);
    buffer.push(parseInt(hex, 16));
  }
  return buffer;
};

var codec = new Codec();

/*
type StdTx struct {
Msgs       []sdk.Msg      `json:"msg"`
Fee        StdFee         `json:"fee"`
Signatures []StdSignature `json:"signatures"`
Memo       string         `json:"memo"`
}
cdc.RegisterConcrete(StdTx{}, "auth/StdTx", nil)
*/

var StdTx = TypeFactory.create('StdTx', [{
  name: 'msg',
  type: Types.ArrayInterface
}, /*,
   {
   name: 'fee',
   type: Types.Struct,
   },*/
{
  name: 'signatures',
  type: Types.ArrayStruct
}, {
  name: 'memo',
  type: Types.String
}]);

var MsgSend = TypeFactory.create('MsgSend', [{
  name: "nonce",
  type: Types.Int8
}]);

var PubKeySecp256k1 = TypeFactory.create('PubKeySecp256k1', [{
  name: 's',
  type: Types.ByteSlice
}], Types.ByteSlice);

var Signature = TypeFactory.create('signature', [{
  name: 'pub_key',
  type: Types.Interface
}, {
  name: 'signature',
  type: Types.ByteSlice
}, {
  name: 'account_number',
  type: Types.Int8
}, {
  name: 'sequence',
  type: Types.Int64
}]);

var Coin = TypeFactory.create('coin', [{
  name: 'denom',
  type: Types.String
}, {
  name: 'amount',
  type: Types.Int8
}]);

var Fee = TypeFactory.create('fee', [{
  name: 'amount',
  type: Types.ArrayStruct
}, {
  name: 'gas',
  type: Types.Int8
}]);

var Output = TypeFactory.create('output', [{
  name: 'address',
  type: Types.ByteSlice
}, {
  name: 'coins',
  type: Types.ArrayStruct
}]);

var IssueMsg = TypeFactory.create('cosmos-sdk/Issue', [{
  name: 'banker',
  type: Types.ByteSlice
}, {
  name: 'outputs',
  type: Types.ArrayStruct
}]);

codec.registerConcrete(new StdTx(), 'auth/StdTx', {});
codec.registerConcrete(new MsgSend(), 'bank/MsgSend', {});
codec.registerConcrete(new IssueMsg(), 'cosmos-sdk/Issue', {}); //c06abad6
codec.registerConcrete(new PubKeySecp256k1(), 'tendermint/PubKeySecp256k1', {}); //eb5ae987
var issueMsg = new IssueMsg([0], [new Output([0], [new Coin('test', 10000)])]);
var sendMsg = new MsgSend(1);
var fee = new Fee(new Coin('test', 0), 200000);
var sig = new Signature(new PubKeySecp256k1(fromHex('02745e346835ef675e880413ed29303e9e41cff37079525868ae986ee613b3f542')), [1, 2, 3], 0, 0);

var stdTx = new StdTx([sendMsg], /*fee,*/[sig], 'test');
var binary = codec.marshalBinary(stdTx);
console.log(toHex(binary));
var json = codec.marshalJson(stdTx);
console.log(json);

var stdTx2 = new StdTx();
codec.unMarshalJson(json, stdTx2);
console.log(stdTx2);
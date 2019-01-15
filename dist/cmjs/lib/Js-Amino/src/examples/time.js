'use strict';

var _require = require('../index'),
    Codec = _require.Codec,
    TypeFactory = _require.TypeFactory,
    Utils = _require.Utils,
    Types = _require.Types,
    WireTypes = _require.WireTypes;

var TimeStruct = TypeFactory.create('TimeStruct', [{
  name: 'time',
  type: Types.Time
}, {
  name: 'str2',
  type: Types.String
}, {
  name: 'int',
  type: Types.Int64
}]);

var codec = new Codec();
codec.registerConcrete(new TimeStruct(), 'test/TimeStruct');

var timeStruct = new TimeStruct(new Date('2006-01-02 20:04:05 +0000 UTC'), "Hello World", 500); //01 Dec 2018 00:00:00 UTC

var binary = codec.marshalBinary(timeStruct);
console.log(binary.toString());
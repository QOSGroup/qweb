'use strict';

var _require = require('../src/index'),
    Codec = _require.Codec,
    TypeFactory = _require.TypeFactory,
    Types = _require.Types;

var _require2 = require('./util'),
    toHex = _require2.toHex;

var assert = require('assert');

var codec = new Codec();
var SimpleStruct = TypeFactory.create('SimpleStruct', [{
  name: 'int8',
  type: Types.Int8
}, {
  name: 'int16',
  type: Types.Int16
}, {
  name: 'int32',
  type: Types.Int32
}, {
  name: 'int64',
  type: Types.Int64
}, {
  name: 'str',
  type: Types.String
}]);
var SimpleStruct2 = TypeFactory.create('SimpleStruct2', [{
  name: 'str',
  type: Types.String
}]);
codec.registerConcrete(new SimpleStruct(), 'SimpleStruct');
codec.registerConcrete(new SimpleStruct2(), 'SimpleStruct2');

describe('Test encode simple struct', function () {
  /*
    cdc.RegisterConcrete(SimpleStruct{}, "SimpleStruct", nil)
    SimpleStruct{
      Int8:  123,
      Int16: 12345,
      Int32: 1234567,
      Int64: 123456789,
      Str:   "teststring유니코드",
    } 2c4a89c4bc08f60110f2c0011887ad4b20959aef3a2a1674657374737472696e67ec9ca0eb8b88ecbd94eb939c
  */
  it('result of simple struct should match', function () {
    var simpleStruct = new SimpleStruct(123, 12345, 1234567, 123456789, 'teststring유니코드');
    assert.equal(toHex(codec.marshalBinary(simpleStruct)), '2c4a89c4bc08f60110f2c0011887ad4b20959aef3a2a1674657374737472696e67ec9ca0eb8b88ecbd94eb939c');
  });
});

describe('Test encode array interface', function () {
  var StructArray = TypeFactory.create('StructArray', [{
    name: 'array',
    type: Types.ArrayInterface
  }], Types.ArrayInterface);

  /*
    []Struct{
      SimpleStruct{
        Int8:  123,
        Int16: 12345,
        Int32: 1234567,
        Int64: 123456789,
        Str:   "teststring유니코드",
      },
      SimpleStruct2{
        Str:   "test",
      }
    } 3a0a2c4a89c4bc08f60110f2c0011887ad4b20959aef3a2a1674657374737472696e67ec9ca0eb8b88ecbd94eb939c0a0ad7618abe0a0474657374
  */
  it('result of array interface should match', function () {
    var structArray = new StructArray([new SimpleStruct(123, 12345, 1234567, 123456789, 'teststring유니코드'), new SimpleStruct2('test')]);
    assert.equal(toHex(codec.marshalBinary(structArray)), '3a0a2c4a89c4bc08f60110f2c0011887ad4b20959aef3a2a1674657374737472696e67ec9ca0eb8b88ecbd94eb939c0a0ad7618abe0a0474657374');
  });
});
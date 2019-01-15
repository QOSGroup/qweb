'use strict';

var _require = require('../src/index'),
    Codec = _require.Codec,
    TypeFactory = _require.TypeFactory,
    Types = _require.Types,
    FieldOtions = _require.FieldOtions;

var _require2 = require('./util'),
    toHex = _require2.toHex;

var assert = require('assert');

describe('Test encode primitive type int', function () {
  var codec = new Codec();
  var Int8 = TypeFactory.create('Int8', [{
    name: 'int8',
    type: Types.Int8
  }], Types.Int8);

  var Int16 = TypeFactory.create('Int16', [{
    name: 'int16',
    type: Types.Int16
  }], Types.Int16);

  var Int32 = TypeFactory.create('Int32', [{
    name: 'int32',
    type: Types.Int32
  }], Types.Int32);

  var Int64 = TypeFactory.create('Int64', [{
    name: 'int64',
    type: Types.Int64
  }], Types.Int64);

  /*
    Encode int8(123) 02f601
    Encode int16(12345) 03f2c001
    Encode int32(1234567) 0387ad4b
    Encode int64(123456789) 04959aef3a
  */
  it('result of int8 should match', function () {
    var int8 = new Int8(123);
    assert.equal(toHex(codec.marshalBinary(int8)), '02f601');
  });

  it('result of int16 should match', function () {
    var int16 = new Int16(12345);
    assert.equal(toHex(codec.marshalBinary(int16)), '03f2c001');
  });

  it('result of int32 should match', function () {
    var int32 = new Int32(1234567);
    assert.equal(toHex(codec.marshalBinary(int32)), '0387ad4b');
  });

  it('result of int64 should match', function () {
    var int64 = new Int64(123456789);
    assert.equal(toHex(codec.marshalBinary(int64)), '04959aef3a');
  });

  /*
    FixedInt{
      Int32(fixed32): 1234567,
      Int64(fixed64):123456789,
    } 0e0d87d612001115cd5b0700000000
  */
  it('result of fixed int32 and int64 should match', function () {
    var FixedInt = TypeFactory.create('FixedInt', [{
      name: 'int32',
      type: Types.Int32
    }, {
      name: 'int64',
      type: Types.Int64
    }]);
    var fixedInt = new FixedInt(1234567, 123456789);
    assert.equal(toHex(codec.marshalBinary(fixedInt, new FieldOtions({ binFixed64: true, binFixed32: true }))), '0e0d87d612001115cd5b0700000000');
  });
});

describe('Test encode primitive type string', function () {
  var codec = new Codec();
  var Str = TypeFactory.create('Str', [{
    name: 'str',
    type: Types.String
  }], Types.String);

  /*
    Encode string(teststring유니코드) 171674657374737472696e67ec9ca0eb8b88ecbd94eb939c
  */
  it('result of string should match', function () {
    var str = new Str('teststring유니코드');
    assert.equal(toHex(codec.marshalBinary(str)), '171674657374737472696e67ec9ca0eb8b88ecbd94eb939c');
  });
});
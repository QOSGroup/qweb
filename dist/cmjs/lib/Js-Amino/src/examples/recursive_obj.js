'use strict';

var _require = require('../index'),
    Codec = _require.Codec,
    TypeFactory = _require.TypeFactory,
    Utils = _require.Utils,
    Types = _require.Types,
    WireTypes = _require.WireTypes;

var codec1 = new Codec();

var SubA = TypeFactory.create('SubA', [{
    name: "a",
    type: Types.String
}, {
    name: "b",
    type: Types.Int8
}, {
    name: "sub2",
    type: Types.Struct
}]);

var SubA2 = TypeFactory.create('SubA2', [{
    name: "a",
    type: Types.String
}, {
    name: "b",
    type: Types.Int8
}]);

var SimpleStruct = TypeFactory.create('SimpleStruct', [{
    name: "a",
    type: Types.Int8
}, {
    name: "b",
    type: Types.ArrayStruct
}, {
    name: "c",
    type: Types.Int8
}, {
    name: "d",
    type: Types.String
}, {
    name: "e",
    type: Types.Struct
}]);

var SubStruct = TypeFactory.create('SubStruct', [{
    name: "a",
    type: Types.ByteSlice
}]);

codec1.registerConcrete(new SimpleStruct(), "SimpleStruct", {});
codec1.registerConcrete(new SubStruct(), "SubStruct", {});
var subStructs = [];
for (var i = 0; i < 3; ++i) {
    var subStruct = new SubStruct([i + 1, i + 2, i + 3]);
    subStructs.push(subStruct);
}
var obj = new SimpleStruct(100, subStructs, 1, "Je Suis Tan", new SubA('Hello', 32, new SubA2('World', 80)));
/*let subObj = new SubA(10)
let subObj2 = new SubA2("Do Ngoc Tan",21)
let aObj = new A(23,"Sanh la tin", new SubA("Toi la Tan",12,subObj2))    
let bObj = new A()
*/
var binary = codec1.marshalBinary(obj);
console.log(binary.toString());

/*
codec1.unMarshalBinary(binary,bObj)
if( Utils.isEqual(aObj,bObj)) {
    console.log("equal")
}
else console.log("Not equal")

//console.log(bObj)
*/

/*
codec1.registerConcrete(new B(), "SimpleStruct", {})  
let obj  = new B("Tan",1,2,new SubA2("sanh la tin",21));
let obj2 = new B();
let obj3 = new B()
let binary = codec1.marshalBinary(obj)
//console.log(binary)    
console.log(obj)
codec1.unMarshalBinary(binary,obj2)
console.log("obj2=",obj2)
console.log(Utils.isEqual(obj,obj2))

*/
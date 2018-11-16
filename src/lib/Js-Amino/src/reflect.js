let { Types } = require('./types')
let Factory = require('./typeFactory')

const typeOf = instance => {
    if ((typeof instance) === "undefined") {
        throw new Error("Undefined Type");
    }
    if( instance in Types ) return Types[instane]
    
    if (typeof instance == 'object') {
        if( instance.constructor.name == 'AminoType' ) return instance.typeName()
        return instance.constructor.name;

    }
 
    return typeof instance;
}
function type(o){
    var s  = Object.prototype.toString.call(o);
    return s.slice(s.indexOf(" ")+1,s.length-1).toLowerCase();
}

const ownKeys = instance => {    
    if( !Factory.isExisted(typeOf(instance)) ) return []//throw new TypeError("instance must be amino type") //remember to check it again
    return Reflect.ownKeys(instance).filter(key => {
        let val = instance.lookup(key)
        return val != null || val != undefined
    })
}

module.exports = {
    typeOf,
    ownKeys
}
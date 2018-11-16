const Reflection = require("./reflect")
const Encoder = require("./encoder")
let {
    Types,
    WireType,
    WireMap
} = require('./types')

const encodeJson = (instance, type) => {

    let tmpInstance = instance;

    //retrieve the single property of the Registered AminoType
    if (type != Types.Struct && type != Types.Interface && type != Types.Array) { //only get the first property with type != Struct        
        let keys = Reflection.ownKeys(instance);
        if (keys.length > 0) { //type of AminoType class with single property
            keys.forEach(key => {
                let aminoType = instance.lookup(key)
                if (type != aminoType) throw new TypeError("Amino type does not match")
                tmpInstance = instance[key]
                return;
            })
        }
    }

    if (tmpInstance.option && tmpInstance.option.marshalJson) {
        return tmpInstance.option.marshalJson(tmpInstance)
    }

    switch (type) {

        case Types.Int8:
            {
                return JSON.stringify(tmpInstance)
            }

        case Types.Int32:
            {
                return JSON.stringify(tmpInstance)
            }

        case Types.Int64:
            {
                return JSON.stringify(tmpInstance * 1)  // convert to string
            }
        case Types.Boolean:
            {
                return JSON.stringify(tmpInstance)
            }
        case Types.String:
            {
                return tmpInstance
            }

        case Types.Struct:
            {
                return encodeJsonStruct(tmpInstance)
            }
        case Types.ByteSlice:
            {
                return encodeJsonSlice(tmpInstance)
            }

        case Types.Array:
            {
                return encodeJsonArray(tmpInstance)
            }
        case Types.Interface:
            {
                return encodeJsonInterface(tmpInstance)
            }
        default:
            {
                console.log("There is no data type to encode:", type)
                break;
            }
    }
}

const encodeJsonInterface = (instance) => {
    let value = encodeJson(instance, instance.type) //dirty-hack
    let type = instance.info.name
    return {type:type, value: value}

}


const encodeJsonStruct = (instance) => {
    let result = {}
    Reflection.ownKeys(instance).forEach((key) => {
        let type = instance.lookup(key) //only valid with BaseTypeAmino.todo: checking 
        let value = encodeJsonField(instance[key], type)
        result[key] = value
    })

    return result;

}



const encodeJsonField = (typeInstance, type) => {    
    let value = null
    if (type == Types.Array) {        
        value = encodeJsonArray(typeInstance)
    } else {
        value = encodeJson(typeInstance, type)
    }

    return value
}

const encodeJsonArray = (instance) => {
    let result = []
    let withPrefix = false
    if (instance.option) {
        if (instance.option.isArrayOfInterface) {
            withPrefix = true
        }
    }

    for (let i = 0; i < instance.length; ++i) {
        let item = instance[i]      
        
        let type = item.type
        if (withPrefix) {
            type = Types.Interface
        }
        let data = encodeJson(item, type)        
        if (data) {       
            result = result.concat(data)
        }
    }

    return result;
}

const encodeJsonSlice = (tmpInstance) => {
    if (typeof window === 'undefined') {    // if nodejs
        return Buffer.from(tmpInstance).toString('base64')
    }
    let binary = ''
    let buffer = new Uint8Array(tmpInstance)
    for (let i = 0; i < buffer.byteLength; i++) {
        binary += String.fromCharCode(buffer[i])
    }
    return window.btoa(binary)
}



module.exports = {
    encodeJson
}
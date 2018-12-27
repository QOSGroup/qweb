// import nacl from 'tweetnacl'
// import { derivePath } from 'ed25519-hd-key'
// import bip39 from 'bip39'

export default {
	getHash256(input) {
		let sha256 = require('js-sha256')
		let hash2 = sha256.update(input)
		return hash2.array()
	},
	base64ToByteArray(base64String) {
		try {
			var sliceSize = 1024
			var byteCharacters = atob(base64String)
			var bytesLength = byteCharacters.length
			var slicesCount = Math.ceil(bytesLength / sliceSize)
			var byteArrays = new Array(slicesCount)

			for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
				var begin = sliceIndex * sliceSize
				var end = Math.min(begin + sliceSize, bytesLength)

				var bytes = new Array(end - begin)
				for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
					bytes[i] = byteCharacters[offset].charCodeAt(0)
				}
				byteArrays[sliceIndex] = new Uint8Array(bytes)
			}
			return byteArrays
		} catch (e) {
			console.log("Couldn't convert to byte array: " + e)
			return undefined
		}
	},
	/**
	 * buffer to hex
	 * @param {*} buffer buffer 数组
	 */
	buf2hex(buffer) {
		return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('')
	},
	stringToHex(str){
		var val=''
		for(var i = 0; i < str.length; i++){
			val +=  str.charCodeAt(i).toString(16)
		}
		return val
	}
}


// /**
//  * 生成助记符
//  */
// genarateSeed() {
// 	const mnemonic = bip39.generateMnemonic()
// 	return mnemonic
// },
// /**
//  * 生成公私钥对
//  * @param {string} mnemonic 助记符
//  * @returns {object} 公私钥对
//  */
// genarateKeyPair(mnemonic) {
// 	const hexSeed = bip39.mnemonicToSeedHex(mnemonic)
// 	const secret = derivePath("m/44'/148'/0'", hexSeed).key
// 	const keyPair = nacl.sign.keyPair.fromSeed(secret)
// 	return keyPair
// },
// /**
//  * 获取链上地址
//  * @param {Uint8Array} publicKey 公钥
//  */
// getAddress(publicKey) {
// 	const bech32 = require('bech32')
// 	const pkAarry = this.getHash256(publicKey)
// 	const nw = bech32.toWords((Buffer.from(pkAarry.slice(0, 20))))
// 	const addr = bech32.encode('address', nw)
// 	return addr
// },
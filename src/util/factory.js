import nacl from 'tweetnacl'
import { derivePath, getPublicKey } from 'ed25519-hd-key'
import bip39 from 'bip39'
let { Codec } = require('../lib/Js-Amino/src/index')
import {
	encodeBase64,
	decodeBase64
} from 'tweetnacl-util'
import msg from '../model/types'
import { default as tools } from '../util/tool'
const getHash256 = input => {
	let sha256 = require('js-sha256')
	let hash2 = sha256.update(input)
	return hash2.array()
}
export default {
	/**
	 * 生成助记符
	 */
	genarateSeed() {
		// 商 256，生成24个助记单词
		const mnemonic = bip39.generateMnemonic(256)
		return mnemonic
	},
	/**
	 * 生成公私钥对
	 * @param {string} mnemonic 助记符
	 * @returns {object} 公私钥对
	 */
	genarateKeyPair(mnemonic) {
		console.log('mnemonic', mnemonic)
		const hexSeed = bip39.mnemonicToSeedHex(mnemonic)
		const secret = derivePath("m/44'/148'/0'", hexSeed).key
		const keyPair = nacl.sign.keyPair.fromSeed(secret)
		// let secretKeyUint8 = keyPair.secretKey
		// let naclKeys = nacl.sign.keyPair.fromSeed(secretKeyUint8)

		// console.log('naclKeys', naclKeys)

		return keyPair
	},
	/**
	 * 获取链上地址
	 * @param {Uint8Array} publicKey 公钥
	 */
	getAddress(publicKey) {
		const bech32 = require('bech32')
		const publicKey_hash256 = getHash256(publicKey)
		const addr_suffix = bech32.toWords((Buffer.from(publicKey_hash256.slice(0, 20))))

		const addr = bech32.encode('address', addr_suffix)
		return addr
	},
	/**
     * 签名
     * @param {Uint8Array} msg 
     * @param {Uint8Array} secretKey 
     */
	sign(msg, secretKey) {
		return nacl.sign(msg, secretKey)
	},
	genarateTxMsg() {
		const codec = new Codec()
		const PubKeyEd25519 = msg.PubKeyEd25519,
			ITX = msg.ITX,
			AuthTx = msg.AuthTx,
			QSC = msg.QSC,
			Sender = msg.Sender,
			Receiver = msg.Receiver,
			Signature = msg.Signature

		codec.registerConcrete(new PubKeyEd25519(), 'tendermint/PubKeyEd25519', {})
		codec.registerConcrete(new ITX(), 'qos/txs/TransferTx', {})
		codec.registerConcrete(new AuthTx(), 'qbase/txs/stdtx', {})
		codec.registerConcrete(new Sender(), 'Sender', {})
		codec.registerConcrete(new Receiver(), 'Sender', {})
		codec.registerConcrete(new Signature, 'Signature', {})

		const seed = this.genarateSeed()
		console.log('seed', seed)
		const keyPair = this.genarateKeyPair(seed)
		console.log('keyPair', keyPair)

		console.log('publicKey hex', this.buf2hex(keyPair.publicKey))

		const addr = this.getAddress(keyPair.publicKey)
		console.log('addr', addr)

		const pubKeyEd25519 = new PubKeyEd25519(keyPair.publicKey)

		const qsc = new QSC('AOE', 5)
		const sender = new Sender('address1k0m8ucnqug974maa6g36zw7g2wvfd4sug6uxay', 2, [qsc])

		console.log('sender: ',sender)

		const receiver = new Receiver('address12as5uhdpf2y9zjkurx2l6dz8g98qkgryc4x355', 2, [qsc])

		const itx = new ITX([sender], [receiver])

		const privateKeyBuffers = (tools.base64ToByteArray('k0m8ucnqug974maa6g36zw7g2wvfd4sug6uxay'))
		console.log('privateKeyBuffers', privateKeyBuffers)
		console.log('privateKeyBuffers', privateKeyBuffers[0].buffer)
		const tmpBy = this.buf2hex1(privateKeyBuffers[0])
		console.log('tmpBy:', tmpBy)

		const signature = new Signature(pubKeyEd25519, 'JUTk/5Itlqv7VfjFwvARaEeJiAxfPhT4mCbbMVcF+MzYKkxXuz8f+PYTZeDIQ0W89/uTzBvQpn6Y1J8cyaCeBg==', 10)

		const authTx = new AuthTx(itx, [signature], 'qos-test', 0)

		// 最终生成的输出的JSON
		const str = codec.marshalJson(authTx)

		console.log('str', str)

		//测试签名后数据是否正确
		const privateKey = 'rpt3O80wAFI1+ZqNYt8DqJ5PaQ+foDq7G/InFfycoFYT8tgGFJLp+BSVELW2fTQNGZ/yTzTIXbu9fg33gOmmzA=='
		const singdata = 'b3f67e6260e20beaefbdd223a13bc8539896d61c3257614e5da14a88514adc1995fd3447414e0b206432716f732d7465737400000000000000000000000000000007'

		const by = Buffer.from(singdata, 'hex')
		console.log(by)

		const pk = decodeBase64(privateKey)
		console.log('pk', pk)

		const pubkey = decodeBase64('E/LYBhSS6fgUlRC1tn00DRmf8k80yF27vX4N94Dppsw=')
		console.log('pubkey', pubkey)

		console.log('Array.from(pk).slice(0,32)', Array.from(pk).slice(0, 32))
		const publicKey = getPublicKey(Array.from(pk).slice(0, 32)).slice(1)
		console.log('publicKey', publicKey)

		/**快捷获取签名的from Hex或者 to Hex 值 --start*/
		const bech32 = require('bech32')
		const addr_decode = bech32.decode('address1k0m8ucnqug974maa6g36zw7g2wvfd4sug6uxay')
		console.log('addr_decode', addr_decode)
		const fromwords = bech32.fromWords(addr_decode.words)
		console.log('fromwords', fromwords)
		const fromHex = this.buf2hex(fromwords)
		console.log('fromHex', fromHex)

		/**快捷获取签名的from Hex或者 to Hex 值 --end*/
		

		const publicKey_hash256 = getHash256(publicKey)
		const publicKey_hash256_slice20 = Buffer.from(publicKey_hash256.slice(0, 20))

		const publickeyHex = this.buf2hex1(publicKey_hash256_slice20)
		console.log('pucpublickeyHex', publickeyHex)



		const sd = nacl.sign.detached(by, pk)
		console.log(sd.buffer)
		console.log(this.buf2hex(sd.buffer))
		console.log(encodeBase64(sd))
	},
	/**
	 * buffer to hex
	 * @param {*} buffer buffer 数组
	 */
	buf2hex(buffer) {
		return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('')
	},
	/**
	 * buffer to hex
	 * @param {*} buffer buffer 数组
	 */
	buf2hex1(uint8Array) {
		return Array.prototype.map.call(uint8Array, x => ('00' + x.toString(16)).slice(-2)).join('')
	}
}

// function buf2hex(buffer) { // buffer is an ArrayBuffer
// 	return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('')
// }

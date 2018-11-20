import nacl from 'tweetnacl'
import { derivePath } from 'ed25519-hd-key'
import bip39 from 'bip39'
let { Codec } = require('../lib/Js-Amino/src/index')
import {
	encodeBase64,
	decodeBase64
} from 'tweetnacl-util'

import msg from '../model/txmsg'

export default {
	/**
	 * 生成助记符
	 */
	genarateSeed() {
		const mnemonic = bip39.generateMnemonic()
		return mnemonic
	},
	/**
	 * 生成公私钥对
	 * @param {string} mnemonic 助记符
	 * @returns {object} 公私钥对
	 */
	genarateKeyPair(mnemonic) {
		const hexSeed = bip39.mnemonicToSeedHex(mnemonic)
		const secret = derivePath("m/44'/148'/0'", hexSeed).key
		const keyPair = nacl.sign.keyPair.fromSeed(secret)
		return keyPair
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

		const pubKeyEd25519 = new PubKeyEd25519(keyPair.publicKey)

		const sender = new Sender('address1k0m8ucnqug974maa6g36zw7g2wvfd4sug6uxay', 2, 0)
		const receiver = new Receiver('address12as5uhdpf2y9zjkurx2l6dz8g98qkgryc4x355', 2, 0)

		const itx = new ITX([sender], [receiver])

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

		const sd = nacl.sign.detached(by, pk)
		console.log(buf2hex(sd.buffer))
		console.log(encodeBase64(sd))
	}
}

function buf2hex(buffer) { // buffer is an ArrayBuffer
	return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('')
}
